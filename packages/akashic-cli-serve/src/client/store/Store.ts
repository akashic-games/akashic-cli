import {observable, action} from "mobx";
import * as queryString from "query-string";
import {ServiceType} from "@akashic/akashic-cli-commons";
import {Player} from "../../common/types/Player";
import {AppOptions} from "../../common/types/AppOptions";
import {ClientContentLocator} from "../common/ClientContentLocator";
import * as ApiClient from "../api/ApiClient";
import {PlayEntity} from "./PlayEntity";
import {PlayStore} from "./PlayStore";
import {LocalInstanceEntity} from "./LocalInstanceEntity";
import {DevtoolUiStore} from "./DevtoolUiStore";
import {ToolBarUiStore} from "./ToolBarUiStore";
import {ContentStore} from "./ContentStore";
import {NotificationUiStore} from "./NotificationUiStore";
import {StartupScreenUiStore} from "./StartupScreenUiStore";
import {ProfilerStore} from "./ProfilerStore";
import {storage} from "./storage";
import {ProfilerValue} from "../common/types/Profiler";

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
		const query = queryString.parse(window.location.search);
		// TODO xnv bootstrapから渡す方が自然では？
		this.contentLocator = new ClientContentLocator({ contentId: (query.id != null) ? query.id as string : "0" });
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

		this._initializationWaiter = ApiClient.getOptions().then(result => {
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
		if (this.currentLocalInstance) {
			this.currentLocalInstance.setProfilerValueTrigger((value: ProfilerValue) => {
				this.profilerStore.updateProfilerData("fps", value.framePerSecond);
				this.profilerStore.updateProfilerData("skipped", value.skippedFrameCount);
				this.profilerStore.updateProfilerData("interval", value.rawFrameInterval);
				this.profilerStore.updateProfilerData("frame", value.frameTime);
				this.profilerStore.updateProfilerData("rendering", value.renderingTime);
			});
		}
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
