import { observable, action } from "mobx";
import * as queryString from "query-string";
import * as RootFrameAPiHost from "../api/RootFrameApiHost";
import { AppOptions } from "../../common/types/AppOptions";
import { ClientContentLocator } from "../common/ClientContentLocator";
import * as ApiClient from "../api/ApiClient";
import { PlayStore } from "./PlayStore";
import { ContentStore } from "./ContentStore";
import { ServiceType } from "@akashic/akashic-cli-commons";
import { PlayEntity } from "./PlayEntity";

export class RootFrameStore {
	@observable appOptions: AppOptions;
	@observable contentLocator: ClientContentLocator;
  @observable panes: string[]; // length: 1-4
	@observable currentPlay: PlayEntity | null;

	contentStore: ContentStore;
	playStore: PlayStore;

  private _nextPaneId: number;
	private _initializationWaiter: Promise<void>;

	constructor() {
		const query = queryString.parse(window.location.search);
		// TODO xnv bootstrapから渡す方が自然では？
		this.contentLocator = new ClientContentLocator({ contentId: (query.id != null) ? query.id as string : "0" });
		this.appOptions = null!;
    this._nextPaneId = 0;
    this.panes = ["pane" + this._nextPaneId++];
		this.currentPlay = null;
		this.contentStore = new ContentStore();
		this.playStore = new PlayStore({ contentStore: this.contentStore });

		RootFrameAPiHost.setHandlers({
			getPanes: () => this.panes.map(p => "" + p)
		});

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
  removePane(paneKey: string): void {
    this.panes = this.panes.filter(id => id !== paneKey);
		RootFrameAPiHost.notifyBroadcastPaneRemove(paneKey);
  }

	@action
	addPane(): void {
		const paneKey = "pane" + this._nextPaneId++;
    this.panes.push(paneKey);
		RootFrameAPiHost.notifyBroadcastPaneAdd(paneKey);
	}

	@action
	setCurrentPlay(play: PlayEntity): void {
		this.currentPlay = play;
	}

	get targetService(): ServiceType {
		return this.appOptions.targetService;
	}
}