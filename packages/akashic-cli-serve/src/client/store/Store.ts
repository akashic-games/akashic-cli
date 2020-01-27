import {observable, action} from "mobx";
import * as queryString from "query-string";
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
import {storage} from "./storage";
import {StartupScreenUiStore} from "./StartupScreenUiStore";
import {ServiceType} from "../../common/types/ServiceType";
import { RPGAtsumaruApi } from "../atsumaru/RPGAtsumaruApi";

export class Store {
	@observable contentStore: ContentStore;
	@observable playStore: PlayStore;
	@observable toolBarUiStore: ToolBarUiStore;
	@observable devtoolUiStore: DevtoolUiStore;
	@observable notificationUiStore: NotificationUiStore;
	@observable startupScreenUiStore: StartupScreenUiStore;
	@observable appOptions: AppOptions;
	@observable player: Player | null;
	@observable contentLocator: ClientContentLocator;

	@observable currentPlay: PlayEntity | null;
	@observable currentLocalInstance: LocalInstanceEntity | null;
	@observable atsumaruApi: RPGAtsumaruApi | null;

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
		this.appOptions = null!;
		this.player = { id: storage.data.playerId, name: storage.data.playerName };
		this.currentPlay = null;
		this.currentLocalInstance = null;
		this.atsumaruApi = null;

		this._initializationWaiter = ApiClient.getOptions().then(result => {
			this.appOptions = result.data;
		});
	}

	assertInitialized(): Promise<unknown> {
		return Promise.all([
			this.playStore.assertInitialized(),
			this.contentStore.assertInitialized(),
			this._initializationWaiter
		]);
	}

	@action
	setCurrentLocalInstance(instance: LocalInstanceEntity): void {
		if (this.currentLocalInstance === instance)
			return;
		this.currentLocalInstance = instance;
		this.devtoolUiStore.setEntityTrees([]);
		if (this.targetService === ServiceType.Atsumaru) {
			this.atsumaruApi = new RPGAtsumaruApi({
				targetContent: this.currentLocalInstance.gameContent
			});
			(window as any).RPGAtsumaru = this.atsumaruApi;
		}
	}

	@action
	setCurrentPlay(play: PlayEntity): void {
		this.currentPlay = play;
	}

	@action
	changeVolume(vol: number): void {
		this.currentLocalInstance.gameContent.agvGameContent.setMasterVolume(vol);
		if (this.atsumaruApi) {
			this.atsumaruApi.volumeTrigger.fire(vol);
		}
	}

	get targetService(): ServiceType {
		return this.appOptions.targetService;
	}
}
