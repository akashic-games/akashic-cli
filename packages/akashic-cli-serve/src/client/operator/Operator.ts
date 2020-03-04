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
import { RPGAtsumaruApi } from "../atsumaru/RPGAtsumaruApi";

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
	private gameStopIntervalId: any;

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
		if (store.targetService === ServiceType.Atsumaru) {
			(window as any).RPGAtsumaru = new RPGAtsumaruApi({
				// 元のAPIが0～1の実数を返す仕様になっているので、それに合わせた
				getVolumeCallback: () => this.store.devtoolUiStore.volume / 100
			});
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
		const tickHandler = store.devtoolUiStore.createTickHandler(store.targetService);
		const instance = await play.createLocalInstance({
			gameViewManager: this.gameViewManager,
			playId: play.playId,
			playToken: tokenResult.data.playToken,
			playlogServerUrl: "dummy-playlog-server-url",
			executionMode: params != null && params.isReplay ? "replay" : "passive",
			player: store.player,
			argument: params != null ? params.instanceArgument : undefined,
			proxyAudio: store.appOptions.proxyAudio,
			tickHandler: tickHandler,
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
						proxyAudio: store.appOptions.proxyAudio,
						tickHandler: tickHandler
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
		this.startTimerToStopGame();
	}

	restartWithNewPlay = async (): Promise<void> => {
		if (this.gameStopIntervalId) clearInterval(this.gameStopIntervalId);
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
		const content = this.store.contentStore.findOrRegister(contentLocator);
		const sandboxConfig = content.sandboxConfig || {};

		const { events, autoSendEvents, autoSendEventName } = sandboxConfig;
		if (events && autoSendEventName && events[autoSendEventName] instanceof Array) {
			events[autoSendEventName].forEach((pev: any) => play.amflow.enqueueEvent(pev));
		} else if (events && autoSendEvents && events[autoSendEvents] instanceof Array) {
			// TODO: `autoSendEvents` は deprecated となった。互換性のためこのパスを残しているが、`autoSendEvents` の削除時にこのパスも削除する。
			console.warn("[deprecated] `autoSendEvents` in sandbox.config.js is deprecated. Please use `autoSendEventName`.");
			events[autoSendEvents].forEach((pev: any) => play.amflow.enqueueEvent(pev));
		}

		this.store.devtoolUiStore.initializePrefferdSessionParams(content.gameJson);
		if (this.store.devtoolUiStore.isAutoSendEvent) {
			const nicoEvent = this.createNicoEvent();
			nicoEvent.forEach((pev: any) => play.amflow.enqueueEvent(pev));
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

	private startTimerToStopGame = (): void => {
		if (!this.store.devtoolUiStore.isAutoSendEvent
			|| this.store.devtoolUiStore.supportMode !== "ranking"
			|| !this.store.devtoolUiStore.useStopGameOnTimeout
			|| this.store.currentLocalInstance.executionMode === "replay"
		) return;

		const gameStartTime = Date.now();
		const fps = this.store.currentLocalInstance.content.gameJson.fps;
		const dur = this.store.currentPlay.duration / 1000;
		let remainingTime = this.store.devtoolUiStore.remainingTime;
		const reamainTimeOrg = remainingTime;
		remainingTime = dur > remainingTime ? 0 : remainingTime - dur;

		const intervalId = setInterval(() => {
			const currentRemainingTime = remainingTime - (Date.now() - gameStartTime) / 1000;
			this.store.devtoolUiStore.setRemainingTime(currentRemainingTime >= 0 ? Math.ceil(currentRemainingTime) : 0);
			const dur = this.store.currentPlay.duration / 1000 - currentRemainingTime;
			if (dur >= reamainTimeOrg) {
				this.stopGameOnTimeout(intervalId);
			}
		}, 1000 / fps);
		this.gameStopIntervalId = intervalId;
	}

	private stopGameOnTimeout(intervalId: any): void {
		if (this.gameStopIntervalId !== intervalId) return;

		this.store.devtoolUiStore.setRemainingTime(0);
		clearInterval(this.gameStopIntervalId);
		if (this.store.devtoolUiStore.useStopGameOnTimeout) {
			this.store.currentPlay.pauseActive();
		}
	}

	private createNicoEvent(): any {
		const supportMode = this.store.devtoolUiStore.supportMode;
		const params: any = {
			"mode": supportMode
		};
		if (supportMode === "ranking") {
			params["totalTimeLimit"] = this.store.devtoolUiStore.remainingTime;
		}
		const event = [[32, 0, "dummy", {
			"type": "start",
			"parameters": params
		}]];
		return event;
	}
}
