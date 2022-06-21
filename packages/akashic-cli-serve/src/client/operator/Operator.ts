import type { PlayAudioState } from "../../common/types/PlayAudioState";
import type { PlayBroadcastTestbedEvent } from "../../common/types/TestbedEvent";
import type { GameViewManager } from "../akashic/GameViewManager";
import type { PlayerInfoResolverResultMessage } from "../akashic/plugin/CoeLimitedPlugin";
import { CoeLimitedPlugin } from "../akashic/plugin/CoeLimitedPlugin";
import type { CreateCoeLocalInstanceParameterObject } from "../akashic/plugin/CoePlugin";
import { CoePlugin } from "../akashic/plugin/CoePlugin";
import { NicoPlugin } from "../akashic/plugin/NicoPlugin";
import { SendPlugin } from "../akashic/plugin/SendPlugin";
import { apiClient } from "../api/apiClientInstance";
import * as Subscriber from "../api/Subscriber";
import { RPGAtsumaruApi } from "../atsumaru/RPGAtsumaruApi";
import { ClientContentLocator } from "../common/ClientContentLocator";
import { createSessionParameter } from "../common/createSessionParameter";
import { queryParameters as query } from "../common/queryParameters";
import type {ProfilerValue} from "../common/types/Profiler";
import type { ScreenSize } from "../common/types/ScreenSize";
import type { LocalInstanceEntity } from "../store/LocalInstanceEntity";
import type { PlayEntity } from "../store/PlayEntity";
import type { Store } from "../store/Store";
import { DevtoolOperator } from "./DevtoolOperator";
import { LocalInstanceOperator } from "./LocalInstanceOperator";
import { PlayOperator } from "./PlayOperator";
import { UiOperator } from "./UiOperator";

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
	private store: Store;
	private gameViewManager: GameViewManager;

	constructor(param: OperatorParameterObject) {
		const store = param.store;
		this.play = new PlayOperator(store);
		this.localInstance = new LocalInstanceOperator(store);
		this.ui = new UiOperator(store);
		this.devtool = new DevtoolOperator(store);
		this.store = param.store;
		this.gameViewManager = param.gameViewManager;

		Subscriber.onBroadcast.add(this._handleBroadcast);
	}

	assertInitialized(): Promise<unknown> {
		return this.store.assertInitialized();
	}

	async bootstrap(contentLocator?: ClientContentLocator): Promise<void> {
		this._initializePlugins(contentLocator || this.store.contentStore.defaultContent().locator);
		const store = this.store;
		let play: PlayEntity = null;
		if (query.playId != null) {
			play = store.playStore.plays[query.playId];
			if (!play) {
				throw new Error(`play(id: ${query.playId}) is not found.`);
			}
		} else if (contentLocator) {
			play = await this._createServerLoop(contentLocator);
		} else {
			play = store.playStore.getLastPlay();
			if (!play) {
				const loc = store.contentStore.defaultContent().locator;
				play = await this._createServerLoop(loc, null); // TODO: (起動時の最初のプレイで) audioState を指定する方法
			}
		}
		if (store.targetService === "atsumaru:single") {
			(window as any).RPGAtsumaru = new RPGAtsumaruApi({
				// 元のAPIが0～1の実数を返す仕様になっているので、それに合わせた
				getVolumeCallback: () => this.store.devtoolUiStore.volume / 100
			});
		}
		await this.setCurrentPlay(play, query.mode === "replay");

		if (query.mode === "replay") {
			if (query.replayResetAge != null) {
				await this.localInstance.resetByAge(query.replayResetAge);
			}
			if (query.replayTargetTime != null) {
				this.store.currentLocalInstance.setTargetTime(query.replayTargetTime);
			}
		}

		if (query.paused) {
			store.currentLocalInstance.targetTimePause();
		}
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
		if (/^nicolive.*/.test(store.targetService) || store.targetService === "atsumaru:multi") {
			if (previousPlay) {
				isJoin = previousPlay.joinedPlayerTable.has(store.player.id);
			} else {
				isJoin = play.joinedPlayerTable.size === 0;
			}
			argument = this._createInstanceArgumentForNicolive(isJoin);
		}

		if (query.argumentsValue) {
			argument = JSON.parse(query.argumentsValue);
			store.startupScreenUiStore.setInstanceArgumentEditContent(query.argumentsValue, true);
		} else if (query.argumentsName && !!store.currentPlay.content.argumentsTable[query.argumentsName]) {
			argument = JSON.parse(store.currentPlay.content.argumentsTable[query.argumentsName]);
			this.ui.selectInstanceArguments(query.argumentsName, true);
		}

		if (store.appOptions.autoStart) {
			await this.startContent({
				joinsSelf: isJoin,
				instanceArgument: argument,
				isReplay
			});
		}
	};

	startContent = async (params?: StartContentParameterObject): Promise<void> => {
		const store = this.store;
		const play = store.currentPlay;
		const tokenResult = await apiClient.createPlayToken(play.playId, store.player.id, false, store.player.name);
		const instance = await play.createLocalInstance({
			playId: play.playId,
			playToken: tokenResult.data.playToken,
			playlogServerUrl: "dummy-playlog-server-url",
			executionMode: params != null && params.isReplay ? "replay" : "passive",
			player: store.player,
			argument: params != null ? params.instanceArgument : undefined,
			proxyAudio: store.appOptions.proxyAudio,
			resizeGameView: true
		});
		instance.onStop.addOnce(this._endPlayerInfoResolver);
		store.setCurrentLocalInstance(instance);
		await instance.start();
		instance.setProfilerValueTrigger((value: ProfilerValue) => {
			this.store.profilerStore.pushProfilerValueResult("fps", value.framePerSecond);
			this.store.profilerStore.pushProfilerValueResult("skipped", value.skippedFrameCount);
			this.store.profilerStore.pushProfilerValueResult("interval", value.rawFrameInterval);
			this.store.profilerStore.pushProfilerValueResult("frame", value.frameTime);
			this.store.profilerStore.pushProfilerValueResult("rendering", value.renderingTime);
		});
		if (store.targetService !== "atsumaru:single") {
			this.store.devtoolUiStore.initTotalTimeLimit(play.content.preferredSessionParameters.totalTimeLimit);
			this.devtool.setupNiconicoDevtoolValueWatcher();
		}

		if (params != null && params.joinsSelf) {
			store.currentPlay.join(store.player.id, store.player.name);
		}
	};

	// TODO: このメソッドの処理は本来サーバー側で行うべき
	restartWithNewPlay = async (): Promise<void> => {
		await this.store.currentPlay.content.updateSandboxConfig();
		const audioState = this.store.playStore.getLastPlay()?.audioState;
		const play = await this._createServerLoop(this.store.currentPlay.content.locator, audioState);
		await this.store.currentPlay.deleteAllServerInstances();
		await apiClient.broadcast(this.store.currentPlay.playId, { type: "switchPlay", nextPlayId: play.playId });
		this.ui.hideNotification();
	};

	setGameViewSize = (size: ScreenSize): void => {
		this.store.setGameViewSize(size);
	};

	private async _createServerLoop(contentLocator: ClientContentLocator, audioState?: PlayAudioState): Promise<PlayEntity> {
		const play = await this.store.playStore.createPlay({ contentLocator, audioState });
		const tokenResult = await apiClient.createPlayToken(play.playId, "", true);  // TODO 空文字列でなくnullを使う
		await play.createServerInstance({ playToken: tokenResult.data.playToken });
		await apiClient.resumePlayDuration(play.playId);

		// autoSendEvents
		const content = this.store.contentStore.findOrRegister(contentLocator);
		const sandboxConfig = content.sandboxConfig || {};

		const { events, autoSendEvents, autoSendEventName } = sandboxConfig;
		if (events && autoSendEventName && events[autoSendEventName] instanceof Array) {
			events[autoSendEventName].forEach((pev: any) => play.amflow.enqueueEvent(pev));
		} else if (events && autoSendEvents && events[autoSendEvents] instanceof Array) {
			// TODO: `autoSendEvents` は非推奨。互換性のためこのパスを残しているが、`autoSendEvents` の削除時にこのパスも削除する。
			console.warn("[deprecated] `autoSendEvents` in sandbox.config.js is deprecated. Please use `autoSendEventName`.");
			events[autoSendEvents].forEach((pev: any) => play.amflow.enqueueEvent(pev));
		} else if (!autoSendEventName && (/^nicolive.*/.test(this.store.targetService) || this.store.targetService === "atsumaru:multi")) {
			play.amflow.enqueueEvent(createSessionParameter(this.store.targetService)); // セッションパラメータを送る
		}

		if (this.store.devtoolUiStore.isAutoSendEvent) {
			this.store.devtoolUiStore.initTotalTimeLimit(play.content.preferredSessionParameters.totalTimeLimit);
			const nicoEvent = this.devtool.createNicoEvent();
			nicoEvent.forEach((pev: any) => play.amflow.enqueueEvent(pev));
		}

		return play;
	}

	private async _createClientLoop(contentUrl: string, playId: string): Promise<PlayEntity> {
		const play = await this.store.playStore.createStandalonePlay({
			contentLocator: new ClientContentLocator({ path: contentUrl }),
			playId
		});
		return play;
	}

	private _handleBroadcast = (arg: PlayBroadcastTestbedEvent): void => {
		try {
			switch (arg.message.type) {
				case "switchPlay":  // TODO typeを型づける
					if (this.store.currentPlay.playId === arg.playId) {
						this.setCurrentPlay(this.store.playStore.plays[arg.message.nextPlayId]);
					}
					break;
				default:
					throw new Error("invalid type: " + arg.message.type);
			}
		} catch (e) {
			console.error("_handleBroadcast()", e);
		}
	};

	private _createInstanceArgumentForNicolive(isBroadcaster: boolean): any {
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
	};

	//  TODO: 複数のコンテンツ対応。引数の contentLocator は複数コンテンツに対応していないが暫定とする
	private async _initializePlugins(contentLocator: ClientContentLocator): Promise<void> {
		this.gameViewManager.registerExternalPlugin(new NicoPlugin());
		this.gameViewManager.registerExternalPlugin(new SendPlugin());
		this.gameViewManager.registerExternalPlugin(new CoePlugin({
			onLocalInstanceCreate: this._createLocalSessionInstance,
			onLocalInstanceDelete: this._deleteLocalSessionInstance
		}));

		if (typeof agvplugin !== "undefined") {
			this.gameViewManager.registerExternalPlugin(new agvplugin.CoeLimitedPlugin());
			this.gameViewManager.registerExternalPlugin(new agvplugin.AgvSupplementPlugin());
			this.gameViewManager.registerExternalPlugin(new agvplugin.InstanceStoragePlugin({
				storage: window.sessionStorage
			}));
		} else {
			this.gameViewManager.registerExternalPlugin(new CoeLimitedPlugin({
				startPlayerInfoResolver: this._startPlayerInfoResolver,
				endPlayerInfoResolver: this._endPlayerInfoResolver
			}));
		}

		const content = this.store.contentStore.findOrRegister(contentLocator);
		const sandboxConfig = content.sandboxConfig || {};
		const client = sandboxConfig?.client;
		if (client?.external) {
			for (const pluginName of Object.keys(client.external)) {
				await this._loadScript(`/contents/${contentLocator.contentId}/sandboxConfig/plugins/${pluginName}`);

				const pluginObj = {
					name: pluginName,
					onload: function (game: any, _dataBus: unknown, _gameContent: agv.GameContent) {
						game.external[pluginName] = (window as any).__testbed.pluginFuncs[pluginName]()();
					}
				};
				this.gameViewManager.registerExternalPlugin(pluginObj);
			}
		}
	}

	private _createLocalSessionInstance = async (params: CreateCoeLocalInstanceParameterObject): Promise<LocalInstanceEntity> => {
		// TODO: local === true のみ対応
		if (!params.local) {
			// TODO: エラーハンドリング
			throw new Error("Not supported");
		}
		const childPlay = await this._createClientLoop(params.contentUrl, params.playId);
		const localInstance = await childPlay.createLocalInstance({
			player: this.store.player,
			playId: params.playId,
			executionMode: "active",
			argument: params.argument,
			initialEvents: params.initialEvents,
			proxyAudio: this.store.appOptions.proxyAudio,
			useNonDebuggableScript: true,
			resizeGameView: false
		});
		await localInstance.start();
		return localInstance;
	};

	private _deleteLocalSessionInstance = async (playId: string): Promise<void> => {
		const play = this.store.playStore.plays[playId];
		if (play == null) {
			throw new Error("Play not found" + playId);
		}
		await play.teardown();
	};

	private _startPlayerInfoResolver = (limitSeconds: number, cb: (res: PlayerInfoResolverResultMessage) => void): void => {
		this.store.playerInfoResolverUiStore.showDialog(limitSeconds);
		this.store.playerInfoResolverUiStore.onResolve.addOnce(cb);
	};

	private _endPlayerInfoResolver = (): void => {
		this.store.playerInfoResolverUiStore.hideDialog();
	};

	private _loadScript(scriptPath: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = scriptPath;
			script.onload = () => {
				resolve();
			};
			script.onerror = function (e) {
				reject(e);
			};
			document.body.append(script);
		});
	}
}
