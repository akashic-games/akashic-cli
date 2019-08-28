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
import { ExternalPluginOperator } from "./ExternalPluginOperator";
import { ServiceType } from "../../common/types/ServiceType";

export interface OperatorParameterObject {
	store: Store;
	gameViewManager: GameViewManager;
}

export interface StartContentParameterObject {
	joinsSelf: boolean;
	instanceArgument: any;
}

export class Operator {
	play: PlayOperator;
	localInstance: LocalInstanceOperator;
	ui: UiOperator;
	externalPlugin: ExternalPluginOperator;
	private store: Store;
	private gameViewManager: GameViewManager;

	constructor(param: OperatorParameterObject) {
		const store = param.store;
		this.play = new PlayOperator(store);
		this.localInstance = new LocalInstanceOperator(store);
		this.ui = new UiOperator(store);
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
		let play: PlayEntity = null;
		let isPlayCreated = false;
		if (contentLocator) {
			play = await this._createServerLoop(contentLocator);
			isPlayCreated = true;
		} else {
			const plays = store.playStore.playsList();
			if (plays.length > 0) {
				play = plays[plays.length - 1];
			} else {
				const loc = store.contentStore.defaultContent().locator;
				play = await this._createServerLoop(loc);
				isPlayCreated = true;
			}
		}
		await this.setCurrentPlay(play);
		if (isPlayCreated) this.play.sendRegisteredEvent(play.content.sandboxConfig.autoSendEvents);
	}

	setCurrentPlay = async (play: PlayEntity): Promise<void> => {
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
				instanceArgument: argument
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
			executionMode: "passive",
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
		const play = await this._createServerLoop(this.store.currentPlay.content.locator);
		await ApiClient.broadcast(this.store.currentPlay.playId, { type: "switchPlay", nextPlayId: play.playId });
		await this.store.currentPlay.deleteAllServerInstances();
	}

	private async _createServerLoop(contentLocator: ClientContentLocator): Promise<PlayEntity> {
		const play = await this.store.playStore.createPlay({ contentLocator });
		const tokenResult = await ApiClient.createPlayToken(play.playId, "", true);  // TODO 空文字列でなくnullを使う
		await play.createServerInstance({ playToken: tokenResult.data.playToken });
		await ApiClient.resumePlayDuration(play.playId);
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
