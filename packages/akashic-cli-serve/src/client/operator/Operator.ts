import * as queryString from "query-string";
import { PlayBroadcastTestbedEvent } from "../../common/types/TestbedEvent";
import { ClientContentLocator } from "../common/ClientContentLocator";
import * as ApiClient from "../api/ApiClient";
import * as Subscriber from "../api/Subscriber";
import { GameViewManager } from "../akashic/GameViewManager";
import { PlayEntity } from "../store/PlayEntity";
import { Store } from "../store/Store";
import { PlayOperator } from "./PlayOperator";
import { LocalInstanceOperator } from "./LocalInstanceOperator";
import { UiOperator } from "./UiOperator";
import { DevtoolOperator } from "./DevtoolOperator";
import { ExternalPluginOperator } from "./ExternalPluginOperator";
import { ServiceType } from "../../common/types/ServiceType";

export interface OperatorParameterObject {
	store: Store;
	gameViewManager: GameViewManager;
}

export interface StartContentParameterObject {
	joinsSelf: boolean;
	instanceArgument: any;
	isReplay?: boolean;
}

export class Operator {
	play: PlayOperator;
	localInstance: LocalInstanceOperator;
	ui: UiOperator;
	devtool: DevtoolOperator;
	externalPlugin: ExternalPluginOperator;
	private store: Store;
	private gameViewManager: GameViewManager;

	constructor(param: OperatorParameterObject) {
		const store = param.store;
		this.play = new PlayOperator(store);
		this.localInstance = new LocalInstanceOperator(store);
		this.ui = new UiOperator(store);
		this.devtool = new DevtoolOperator(store);
		this.externalPlugin = new ExternalPluginOperator(param.gameViewManager);
		this.store = param.store;
		this.gameViewManager = param.gameViewManager;

		Subscriber.onBroadcast.add(this._handleBroadcast);
	}

	assertInitialized(): Promise<unknown> {
		return this.store.assertInitialized();
	}

	async bootstrap(contentLocator?: ClientContentLocator): Promise<void> {
		const store = this.store;
		const query = queryString.parse(window.location.search);
		let play: PlayEntity = null;
		if (query.playId != null) {
			play = store.playStore.plays[query.playId as string];
			if (!play) {
				throw new Error(`play(id: ${query.playId}) is not found.`);
			}
		} else if (contentLocator) {
			play = await this._createServerLoop(contentLocator);
		} else {
			const plays = store.playStore.playsList();
			if (plays.length > 0) {
				play = plays[plays.length - 1];
			} else {
				const loc = store.contentStore.defaultContent().locator;
				play = await this._createServerLoop(loc);
			}
		}
		await this.setCurrentPlay(play, query.mode === "replay");
	}

	setCurrentPlay = async (play: PlayEntity, isReplay: boolean = false): Promise<void> => {
		const store = this.store;
		if (store.currentPlay === play)
			return;

		let previousPlay;
		if (store.currentPlay) {
			previousPlay = store.currentPlay;
			store.currentPlay.deleteAllLocalInstances();
			store.setCurrentLocalInstance(null);
		}

		// TODO play からコンテンツを引くべき？

		store.setCurrentPlay(play);

		let isJoin = false;
		let argument = undefined;
		if (store.targetService === ServiceType.NicoLive) {
			if (previousPlay) {
				isJoin = previousPlay.joinedPlayerTable.has(store.player.id);
			} else {
				isJoin = play.joinedPlayerTable.size === 0;
			}
			argument = this._createInstanceArgumentForNicolive(isJoin);
		}
		if (store.appOptions.autoStart) {
			await this.startContent({
				joinsSelf: isJoin,
				instanceArgument: argument,
				isReplay
			});
		}
	}

	startContent = async (params?: StartContentParameterObject): Promise<void> => {
		const store = this.store;
		const play = store.currentPlay;
		const tokenResult = await ApiClient.createPlayToken(play.playId, store.player.id, false, store.player.name);
		const instance = await play.createLocalInstance({
			gameViewManager: this.gameViewManager,
			playId: play.playId,
			playToken: tokenResult.data.playToken,
			playlogServerUrl: "dummy-playlog-server-url",
			executionMode: params != null && params.isReplay ? "replay" : "passive",
			player: store.player,
			argument: params != null ? params.instanceArgument : undefined,
			proxyAudio: store.appOptions.proxyAudio,
			coeHandler: {
				onLocalInstanceCreate: async params => {
					// TODO: local === true のみ対応
					if (!params.local) {
						// TODO: エラーハンドリング
						throw new Error("Not supported");
					}
					const childPlay = await this._createClientLoop(params.contentUrl, params.playId);
					return await childPlay.createLocalInstance({
						gameViewManager: this.gameViewManager,
						player: this.store.player,
						playId: params.playId,
						executionMode: "active",
						argument: params.argument,
						initialEvents: params.initialEvents,
						proxyAudio: store.appOptions.proxyAudio
					});
				},
				onLocalInstanceDelete: async playId => {
					const play = this.store.playStore.plays[playId];
					if (play == null) {
						throw new Error("Play not found" + playId);
					}
					await play.teardown();
				}
			}
		});
		store.setCurrentLocalInstance(instance);
		if (params != null && params.joinsSelf) {
			store.currentPlay.join(store.player.id, store.player.name);
		}
	}

	restartWithNewPlay = async (): Promise<void> => {
		await this.store.currentPlay.content.updateSandboxConfig();
		const play = await this._createServerLoop(this.store.currentPlay.content.locator);
		await this.store.currentPlay.deleteAllServerInstances();
		await ApiClient.broadcast(this.store.currentPlay.playId, { type: "switchPlay", nextPlayId: play.playId });
		this.ui.hideNotification();
	}

	private async _createServerLoop(contentLocator: ClientContentLocator): Promise<PlayEntity> {
		const play = await this.store.playStore.createPlay({ contentLocator });
		const tokenResult = await ApiClient.createPlayToken(play.playId, "", true);  // TODO 空文字列でなくnullを使う
		await play.createServerInstance({ playToken: tokenResult.data.playToken });
		await ApiClient.resumePlayDuration(play.playId);

		// autoSendEvents
		const sandboxConfig = this.store.contentStore.findOrRegister(contentLocator).sandboxConfig || {};
		const { events, autoSendEvents } = sandboxConfig;
		if (events && autoSendEvents && events[autoSendEvents] instanceof Array) {
			events[autoSendEvents].forEach((pev: any) => play.amflow.enqueueEvent(pev));
		}

		return play;
	}

	private async _createClientLoop(contentUrl: string, playId: string): Promise<PlayEntity> {
		const play = await this.store.playStore.createStandalonePlay({
			contentLocator: new ClientContentLocator({ path: contentUrl }),  // TODO xnv 多分動かない。COEプラグインからまともに ContentLocator を組み立てる必要がある
			playId
		});
		return play;
	}

	private _handleBroadcast = (arg: PlayBroadcastTestbedEvent): void => {
		try {
			switch (arg.message.type) {
			case "switchPlay":  // TODO typeを型づける
				this.setCurrentPlay(this.store.playStore.plays[arg.message.nextPlayId]);
				break;
			default:
				throw new Error("invalid type: " + arg.message.type);
			}
		} catch (e) {
			console.error("_handleBroadcast()", e);
		}
	}

	private _createInstanceArgumentForNicolive(isBroadcaster: boolean) {
		return {
			coe: {
				permission: {
					advance: false,
					advanceRequest: isBroadcaster,
					aggregation: false
				},
				roles: isBroadcaster ? ["broadcaster"] : [],
				debugMode: true
			}
		};
	}
}
