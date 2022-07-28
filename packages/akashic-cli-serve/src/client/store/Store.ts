import type {ServiceType} from "@akashic/akashic-cli-commons/lib/ServiceType";
import {observable, action, autorun} from "mobx";
import type {AppOptions} from "../../common/types/AppOptions";
import type {Player} from "../../common/types/Player";
import type {GameViewManager} from "../akashic/GameViewManager";
import {apiClient} from "../api/apiClientInstance";
import {ClientContentLocator} from "../common/ClientContentLocator";
import {queryParameters as query} from "../common/queryParameters";
import type { ScreenSize } from "../common/types/ScreenSize";
import {ContentStore} from "./ContentStore";
import {DevtoolUiStore} from "./DevtoolUiStore";
import type {LocalInstanceEntity} from "./LocalInstanceEntity";
import {NotificationUiStore} from "./NotificationUiStore";
import type {PlayEntity} from "./PlayEntity";
import {PlayerInfoResolverUiStore} from "./PlayerInfoResolverUiStore";
import {PlayStore} from "./PlayStore";
import {ProfilerStore} from "./ProfilerStore";
import {StartupScreenUiStore} from "./StartupScreenUiStore";
import {storage} from "./storage";
import {ToolBarUiStore} from "./ToolBarUiStore";

export interface StoreParameterObject {
	gameViewManager: GameViewManager;
}

export class Store {
	@observable contentStore: ContentStore;
	@observable playStore: PlayStore;
	@observable toolBarUiStore: ToolBarUiStore;
	@observable devtoolUiStore: DevtoolUiStore;
	@observable notificationUiStore: NotificationUiStore;
	@observable startupScreenUiStore: StartupScreenUiStore;
	@observable playerInfoResolverUiStore: PlayerInfoResolverUiStore;
	@observable profilerStore: ProfilerStore;
	@observable appOptions: AppOptions;
	@observable player: Player | null;
	@observable contentLocator: ClientContentLocator;

	@observable currentPlay: PlayEntity | null;
	@observable currentLocalInstance: LocalInstanceEntity | null;
	@observable gameViewSize: ScreenSize;

	private _gameViewManager: GameViewManager;
	private _initializationWaiter: Promise<void>;

	constructor(param: StoreParameterObject) {
		// TODO xnv bootstrapから渡す方が自然では？
		this.contentLocator = new ClientContentLocator({ contentId: (query.id != null) ? query.id : "0" });
		this.contentStore = new ContentStore();
		this.playStore = new PlayStore({ contentStore: this.contentStore, gameViewManager: param.gameViewManager });
		this.toolBarUiStore = new ToolBarUiStore();
		this.devtoolUiStore = new DevtoolUiStore();
		this.notificationUiStore = new NotificationUiStore();
		this.startupScreenUiStore = new StartupScreenUiStore();
		this.playerInfoResolverUiStore = new PlayerInfoResolverUiStore();
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

		autorun(() => {
			if (!this.toolBarUiStore.fitsToScreen && this.currentLocalInstance?.intrinsicSize) {
				this.setGameViewSize(this.currentLocalInstance.intrinsicSize);
			}
		});
	}

	assertInitialized(): Promise<unknown> {
		return Promise.all([
			this.playStore.assertInitialized(),
			this.contentStore.assertInitialized(),
			this.playerInfoResolverUiStore.assertInitialized(),
			storage.assertInitialized(),
			this._initializationWaiter
		]).then(() => {
			this.player = { id: storage.data.playerId, name: storage.data.playerName };
		});
	}

	@action
	setCurrentLocalInstance(instance: LocalInstanceEntity): void {
		if (this.currentLocalInstance === instance)
			return;
		this.currentLocalInstance = instance;
		if (this.currentLocalInstance) {
			this.currentLocalInstance.onNotification.add(n => {
				console.warn(n.detail);
				this.notificationUiStore.setActive( n.type, n.title, n.detail, n.message);
			});
		}
		this.devtoolUiStore.setEntityTrees([]);
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
}
