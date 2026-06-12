import type { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType.js";
import { observable, action, autorun } from "mobx";
import type { AppOptions } from "../../../common/types/AppOptions.js";
import type { Player } from "../../../common/types/Player.js";
import type { GameViewManager } from "../../akashic/GameViewManager.js";
import type { RuntimeWarning } from "../../akashic/RuntimeWarning.js";
import { apiClient } from "../../api/apiClientInstance.js";
import { ClientContentLocator } from "../../common/ClientContentLocator.js";
import type { ScreenSize } from "../../common/types/ScreenSize.js";
import { ContentStore } from "../../store/ContentStore.js";
import { DevtoolUiStore } from "../../store/DevtoolUiStore.js";
import type { LocalInstanceEntity } from "../../store/LocalInstanceEntity.js";
import { NotificationUiStore } from "../../store/NotificationUiStore.js";
import type { PlayEntity } from "../../store/PlayEntity.js";
import { ProfilerStore } from "../../store/ProfilerStore.js";
import { StartupScreenUiStore } from "../../store/StartupScreenUiStore.js";
import { storage } from "../../store/storage.js";
import { ToolBarUiStore } from "../../store/ToolBarUiStore.js";
import { PlayStore } from "./PlayStore.js";

export interface StoreParameterObject {
	contentId: string;
	gameViewManager: GameViewManager;
}

export class Store {
	@observable playStore: PlayStore;
	@observable contentStore: ContentStore;
	@observable toolBarUiStore: ToolBarUiStore;
	@observable devtoolUiStore: DevtoolUiStore;
	@observable notificationUiStore: NotificationUiStore;
	@observable startupScreenUiStore: StartupScreenUiStore;
	@observable profilerStore: ProfilerStore;
	@observable appOptions: AppOptions;
	@observable player: Player | null;
	@observable contentLocator: ClientContentLocator;

	@observable currentPlay: PlayEntity | null;
	@observable currentLocalInstance: LocalInstanceEntity | null;
	@observable gameViewSize: ScreenSize;

	private _gameViewManager: GameViewManager;
	private _initializationWaiter: Promise<void>;
	private _warnedTypes: Set<string>;

	constructor(param: StoreParameterObject) {
		this.contentLocator = new ClientContentLocator({ contentId: param.contentId });
		this.contentStore = new ContentStore();
		this.playStore = new PlayStore({ gameViewManager: param.gameViewManager });
		this.toolBarUiStore = new ToolBarUiStore();
		this.devtoolUiStore = new DevtoolUiStore();
		this.notificationUiStore = new NotificationUiStore();
		this.startupScreenUiStore = new StartupScreenUiStore();
		this.profilerStore = new ProfilerStore();
		this.appOptions = null!;
		this.player = null;
		this.currentPlay = null;
		this.currentLocalInstance = null;
		this.gameViewSize = { width: 10, height: 10 }; // ゲーム表示時に更新されるが不具合の際に現象が分かりやすいようサイズをつけておく

		this._gameViewManager = param.gameViewManager;
		this._initializationWaiter = apiClient.getOptions().then(result => {
			this.appOptions = result.data;
		});
		this._warnedTypes = new Set();

		autorun(() => {
			if (!this.toolBarUiStore.fitsToScreen && this.currentLocalInstance?.intrinsicSize) {
				this.setGameViewSize(this.currentLocalInstance.intrinsicSize);
			}
		});
	}

	async assertInitialized(): Promise<unknown> {
		return Promise.allSettled([
			this.contentStore.assertInitialized(),
			this.toolBarUiStore.assertInitialized(),
			storage.assertInitialized(),
			this._initializationWaiter,
		]).then((results) => {
			const hasError = results.some(result => result.status === "rejected");
			if (!hasError) {
				this.player = { id: storage.data.playerId, name: storage.data.playerName };
			}
		});
	}

	@action
	setCurrentLocalInstance(instance: LocalInstanceEntity | null): void {
		if (this.currentLocalInstance === instance)
			return;
		this.currentLocalInstance?.onWarn.remove(this._warn, this);
		this.currentLocalInstance = instance;
		this.currentLocalInstance?.onWarn.add(this._warn, this);
		this.devtoolUiStore.setEntityTrees([]);
		if (this.currentLocalInstance?.intrinsicSize)
			this.setGameViewSize(this.currentLocalInstance.intrinsicSize);
	}

	@action
	setCurrentPlay(play: PlayEntity): void {
		this.currentPlay = play;
	}

	@action
	setGameViewSize(size: ScreenSize): void {
		this.gameViewSize = size;
		this._gameViewManager.setViewSize(size.width, size.height);
	}

	get targetService(): ServiceType {
		return this.appOptions.targetService;
	}

	// FIXME: Store と共通化する
	private _warn(warning: RuntimeWarning): void {
		// すでに通知済みの type なら何もしない
		if (this._warnedTypes.has(warning.type)) return;

		const sandboxConfigWarn = this.currentLocalInstance!.content.sandboxConfig.warn;
		const warningTitle = "Runtime Warning";
		this._warnedTypes.add(warning.type);

		switch (warning.type) {
			case "useMathRandom":
				if (!sandboxConfigWarn || sandboxConfigWarn.useMathRandom !== false) {
					console.warn(`${warning.message}`);
					this.notificationUiStore.setActive({
						type: "error",
						title: warningTitle,
						name: warning.message, // 赤字表示のため name に message を設定
						message: "",
						referenceUrl: warning.referenceUrl,
						referenceMessage: warning.referenceMessage
					});
				}
				break;
			case "useMathSinCosTan":
				if (!sandboxConfigWarn || sandboxConfigWarn.useMathSinCosTan !== false) {
					console.warn(`${warning.message}`);
					this.notificationUiStore.setActive({
						type: "error",
						title: warningTitle,
						name: "",
						message: warning.message,
						referenceUrl: warning.referenceUrl,
						referenceMessage: warning.referenceMessage
					});
				}
				break;
			case "drawOutOfCanvas":
				if (!sandboxConfigWarn || sandboxConfigWarn.drawOutOfCanvas !== false) {
					console.warn(`${warning.message}`);
					this.notificationUiStore.setActive({type: "error", title: warningTitle, message: "", name: warning.message});
				}
				break;
			case "drawDestinationEmpty":
				if (!sandboxConfigWarn || sandboxConfigWarn.drawDestinationEmpty !== false) {
					console.warn(`${warning.message}`);
					this.notificationUiStore.setActive({type: "error", title: warningTitle, message: "", name: warning.message});
				}
				break;
			case "createNonIntegerSurface":
				if (!sandboxConfigWarn || sandboxConfigWarn.createNonIntegerSurface !== false) {
					console.warn(`${warning.message}`);
					this.notificationUiStore.setActive({type: "error", title: warningTitle, message: "", name: warning.message});
				}
				break;
		}
	}
}
