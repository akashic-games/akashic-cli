import {observable, action} from "mobx";
import * as queryString from "query-string";
import {Player} from "../../common/types/Player";
import {ClientContentLocator} from "../common/ClientContentLocator";
import {PlayEntity} from "./PlayEntity";
import {PlayStore} from "./PlayStore";
import {LocalInstanceEntity} from "./LocalInstanceEntity";
import {DevtoolUiStore} from "./DevtoolUiStore";
import {ToolBarUiStore} from "./ToolBarUiStore";
import {ContentStore} from "./ContentStore";
import {storage} from "./storage";
import {StartupScreenUiStore} from "./StartupScreenUiStore";

export class Store {
	@observable contentStore: ContentStore;
	@observable playStore: PlayStore;
	@observable toolBarUiStore: ToolBarUiStore;
	@observable devtoolUiStore: DevtoolUiStore;
	@observable startupScreenUiStore: StartupScreenUiStore;
	@observable player: Player | null;
	@observable contentLocator: ClientContentLocator;

	@observable currentPlay: PlayEntity | null;
	@observable currentLocalInstance: LocalInstanceEntity | null;

	constructor() {
		const query = queryString.parse(window.location.search);
		this.contentLocator = new ClientContentLocator({ contentId: (query.id != null) ? query.id : "0" }); // TODO xnv bootstrapから渡す方が自然では？
		this.contentStore = new ContentStore();
		this.playStore = new PlayStore({ contentStore: this.contentStore });
		this.toolBarUiStore = new ToolBarUiStore();
		this.devtoolUiStore = new DevtoolUiStore();
		this.startupScreenUiStore = new StartupScreenUiStore();
		this.player = { id: storage.data.playerId, name: storage.data.playerName };
		this.currentPlay = null;
		this.currentLocalInstance = null;
	}

	assertInitialized(): Promise<unknown> {
		return Promise.all([
			this.playStore.assertInitialized(),
			this.contentStore.assertInitialized()
		]);
	}

	@action
	setCurrentLocalInstance(instance: LocalInstanceEntity): void {
		this.currentLocalInstance = instance;
	}

	@action
	setCurrentPlay(play: PlayEntity): void {
		this.currentPlay = play;
	}
}
