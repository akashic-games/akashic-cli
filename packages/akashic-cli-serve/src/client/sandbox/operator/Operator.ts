import { ContentLocator } from "../../../common/ContentLocator";
import { calculatePlayDuration } from "../../../common/playlogUtil";
import { isServiceTypeNicoliveLike } from "../../../common/targetServiceUtil";
import type { DumpedPlaylog } from "../../../common/types/DumpedPlaylog";
import type { Player } from "../../../common/types/Player";
import type { GameViewManager } from "../../akashic/GameViewManager";
import type { CreateCoeLocalInstanceParameterObject } from "../../akashic/plugin/CoePlugin";
import { CoePlugin } from "../../akashic/plugin/CoePlugin";
import { ServeMemoryAmflowClient } from "../../akashic/ServeMemoryAMFlowClient";
import type { ClientContentLocator } from "../../common/ClientContentLocator";
import type { ScreenSize } from "../../common/types/ScreenSize";
import { ContentEntity } from "../../store/ContentEntity";
import type { ExecutionMode } from "../../store/ExecutionMode";
import type { LocalInstanceEntity } from "../../store/LocalInstanceEntity";
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
	joinsSelf?: boolean;
	isReplay?: boolean;
	playlog?: DumpedPlaylog;
}

export class Operator {
	play: PlayOperator;
	localInstance: LocalInstanceOperator;
	ui: UiOperator;
	devtool: DevtoolOperator;
	private store: Store;
	private gameViewManager: GameViewManager;

	constructor(param: OperatorParameterObject) {
		this.store = param.store;
		this.localInstance = new LocalInstanceOperator(param.store);
		this.ui = new UiOperator(param.store);
		this.play = new PlayOperator(param.store);
		this.devtool = new DevtoolOperator(param.store);
		this.gameViewManager = param.gameViewManager;
	}

	assertInitialized(): Promise<unknown> {
		return this.store.assertInitialized();
	}

	async bootstrap(): Promise<void> {
		await this._initializePlugins(this.store.contentStore.defaultContent().locator);
		const store = this.store;
		const gameJson = this.store.contentStore.defaultContent().gameJson!;
		const features = gameJson.environment?.features;
		const enableWebAssembly = features?.includes("WebAssembly") || store.appOptions.disableFeatCheck;
		if (!enableWebAssembly) {
			Object.defineProperty(window, "WebAssembly", {
				get: function() {
					throw new Error("If you use WebAssembly, please add \"environment.features:[\"WebAssembly\"]\" to game.json");
				}
			});
		}

		await this.startContent();
	}

	startContent = async (params?: StartContentParameterObject): Promise<void> => {
		const store = this.store;
		const player = this._getPlayer();
		const executionMode: ExecutionMode = params?.playlog ? "replay" : "active";
		const playlog = params?.playlog;
		const playId = "0";

		if (store.currentPlay) {
			await store.currentPlay.deleteAllLocalInstances();
			store.setCurrentLocalInstance(null);
		}

		const amflow = new ServeMemoryAmflowClient({
			playId,
			tickList: playlog?.tickList ?? undefined,
			startPoints: playlog?.startPoints ?? undefined
		});
		const playDuration = playlog ? calculatePlayDuration(playlog) : 0;

		const playEntity = await this.store.playStore.createStandalonePlay({
			playId,
			playlog: params?.playlog,
			amflow,
			content: this.store.contentStore.defaultContent(),
			durationState: {
				duration: playDuration,
				isPaused: executionMode === "replay",
			},
		});

		store.setCurrentPlay(playEntity);

		let argument = undefined;
		if (isServiceTypeNicoliveLike(store.targetService)) {
			const isBroadcaster = playEntity.joinedPlayerTable.size === 0;
			argument = _createInstanceArgumentForNicolive(isBroadcaster);
		}

		const instance = await playEntity.createLocalInstance({
			playId: playEntity.playId,
			executionMode,
			player,
			argument,
			runInIframe: store.appOptions.runInIframe,
			useNonDebuggableScript: false,
			resizeGameView: true,
		});
		store.setCurrentLocalInstance(instance);

		await instance.start();
		instance.setMasterVolume(store.toolBarUiStore.audioVolume);
		this.devtool.setupNiconicoDevtoolValueWatcher();

		instance.setProfilerValueTrigger(value => {
			this.store.profilerStore.pushProfilerValueResult("fps", value.framePerSecond);
			this.store.profilerStore.pushProfilerValueResult("skipped", value.skippedFrameCount);
			this.store.profilerStore.pushProfilerValueResult("interval", value.rawFrameInterval);
			this.store.profilerStore.pushProfilerValueResult("frame", value.frameTime);
			this.store.profilerStore.pushProfilerValueResult("rendering", value.renderingTime);
		});

		if (params?.joinsSelf || this.store.targetService === "nicolive:multi") {
			playEntity.join(player.id, player.name);
		}

		this.play.sendAutoStartEvent();
	};

	setGameViewSize = (size: ScreenSize): void => {
		this.store.setGameViewSize(size);
	};

	uploadPlaylog = (): void => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "application/json";

		input.addEventListener("change", (event: Event) => {
			const target = event.target as HTMLInputElement;
			if (target.files?.length) {
				const file = target.files[0];
				const reader = new FileReader();

				reader.onload = async (e: ProgressEvent<FileReader>) => {
					const result = e.target?.result as string;
					let playlog: DumpedPlaylog | undefined;
					try {
						playlog = JSON.parse(result);
					} catch (error) {
						console.error(`could not load the file: ${file.name}`, error);
						return;
					}

					await this.startContent({
						playlog,
					});
				};

				reader.readAsText(file);
			}
		});

		input.click();
	};

	// TODO: 複数のコンテンツ対応。引数の contentLocator は複数コンテンツに対応していないが暫定とする
	private async _initializePlugins(contentLocator: ClientContentLocator): Promise<void> {
		this.gameViewManager.registerExternalPlugin(new CoePlugin({
			onLocalInstanceCreate: this._createLocalSessionInstance,
			onLocalInstanceDelete: this._deleteLocalSessionInstance,
		}));

		if (typeof agvplugin !== "undefined") {
			this.gameViewManager.registerExternalPlugin(new agvplugin.InstanceStoragePlugin({
				storage: window.sessionStorage,
			}));
			if (agvplugin.InstanceStorageLimitedPlugin)
				this.gameViewManager.registerExternalPlugin(new agvplugin.InstanceStorageLimitedPlugin());
		} else {
			this.gameViewManager.registerExternalPlugin(new agvPublicPlugins.InstanceStoragePlugin({
				storage: window.sessionStorage,
			}));
			this.gameViewManager.registerExternalPlugin(new agvPublicPlugins.InstanceStorageLimitedPlugin());
		}

		const content = this.store.contentStore.find(contentLocator);
		const sandboxConfig = content.sandboxConfig;
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
		if (!params.local) {
			throw new Error("non-local mode not supported");
		}

		const playId = params.playId;
		const player = this._getPlayer();
		const contentLocator = new ContentLocator({ path: params.contentUrl });
		const content = new ContentEntity({ contentLocatorData: contentLocator });
		const amflow = new ServeMemoryAmflowClient({ playId });

		const localSessionPlay = await this.store.playStore.createStandalonePlay({
			playId,
			amflow,
			content,
		});
		const localSessionInstance = await localSessionPlay.createLocalInstance({
			player,
			playId,
			executionMode: "active",
			argument: params.argument,
			initialEvents: params.initialEvents,
			proxyAudio: this.store.appOptions.proxyAudio,
			runInIframe: this.store.appOptions.runInIframe,
			useNonDebuggableScript: true,
			resizeGameView: false
		});
		await localSessionInstance.start();
		localSessionInstance.setMasterVolume(this.store.toolBarUiStore.audioVolume);

		return localSessionInstance;
	};

	private _deleteLocalSessionInstance = async (playId: string): Promise<void> => {
		await this.store.playStore.deletePlay(playId);
	};

	private _getPlayer = (): Player => {
		return this.store.player ?? { id: "sandbox-player", name: "sandbox-player" };
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

function _createInstanceArgumentForNicolive(isBroadcaster: boolean): any {
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
