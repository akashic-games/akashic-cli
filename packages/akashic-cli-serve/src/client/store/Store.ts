import {ServiceType} from "@akashic/akashic-cli-commons/lib/ServiceType";
import {observable, action} from "mobx";
import {AppOptions} from "../../common/types/AppOptions";
import {Player} from "../../common/types/Player";
import { apiClientLocalHost } from "../api/ApiClient";
import {ClientContentLocator} from "../common/ClientContentLocator";
import {queryParameters as query} from "../common/queryParameters";
import {ContentStore} from "./ContentStore";
import {DevtoolUiStore} from "./DevtoolUiStore";
import {LocalInstanceEntity} from "./LocalInstanceEntity";
import {NotificationUiStore} from "./NotificationUiStore";
import {PlayEntity} from "./PlayEntity";
import {PlayStore} from "./PlayStore";
import {ProfilerStore} from "./ProfilerStore";
import {StartupScreenUiStore} from "./StartupScreenUiStore";
import {storage} from "./storage";
import {ToolBarUiStore} from "./ToolBarUiStore";

export class Store {
	@observable contentStore: ContentStore;
	@observable playStore: PlayStore;
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

	private _initializationWaiter: Promise<void>;

	constructor() {
		// TODO xnv bootstrapから渡す方が自然では？
		this.contentLocator = new ClientContentLocator({ contentId: (query.id != null) ? query.id : "0" });
		this.contentStore = new ContentStore();
		this.playStore = new PlayStore({ contentStore: this.contentStore });
		this.toolBarUiStore = new ToolBarUiStore();
		this.devtoolUiStore = new DevtoolUiStore();
		this.notificationUiStore = new NotificationUiStore();
		this.startupScreenUiStore = new StartupScreenUiStore();
		this.profilerStore = new ProfilerStore();
		this.appOptions = null!;
		this.player = null;
		this.currentPlay = null;
		this.currentLocalInstance = null;

		this._initializationWaiter = apiClientLocalHost.getOptions().then(result => {
			this.appOptions = result.data;
		});
	}

	assertInitialized(): Promise<unknown> {
		return Promise.all([
			this.playStore.assertInitialized(),
			this.contentStore.assertInitialized(),
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
		this.devtoolUiStore.setEntityTrees([]);
	}

	@action
	setCurrentPlay(play: PlayEntity): void {
		this.currentPlay = play;
	}

	get targetService(): ServiceType {
		return this.appOptions.targetService;
	}
}
