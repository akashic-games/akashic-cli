import {action, observable} from "mobx";
import {PlayTree} from "../../common/types/PlayTree";
import * as ApiClient from "../api/ApiClient";
import {storage} from "./storage";

export class DevtoolUiStore {
	@observable height: number;
	@observable activeDevtool: string;
	@observable showsEventList: boolean;
	@observable eventListWidth: number;
	@observable eventEditContent: string;
	@observable playTree: PlayTree[] = [];

	private _initializationWaiter: Promise<void>;

	constructor() {
		this.height = storage.data.devtoolsHeight;
		this.activeDevtool = storage.data.activeDevtool;
		this.showsEventList = storage.data.showsEventList;
		this.eventListWidth = storage.data.eventListWidth;
		this.eventEditContent = storage.data.eventEditContent;

		this._initializationWaiter = ApiClient.getPlayTree().then(res => {
			this.playTree = res.data;
		});
	}

	assertInitialized(): Promise<void> {
		return this._initializationWaiter;
	}

	@action
	setHeight(h: number): void {
		this.height = h;
		storage.put({ devtoolsHeight: h });
	}

	@action
	setActiveDevtool(type: string): void {
		this.activeDevtool = type;
		storage.put({ activeDevtool: type });
	}

	@action
	toggleShowEventList(show: boolean): void {
		this.showsEventList = show;
		storage.put({ showsEventList: show });
	}

	@action
	setEventListWidth(w: number): void {
		this.eventListWidth = w;
		storage.put({ eventListWidth: w });
	}

	@action
	setEventEditContent(content: string): void {
		this.eventEditContent = content;
		storage.put({ eventEditContent: content });
	}

	@action
	setPlayTree(playTree: PlayTree[]): void {
		this.playTree = playTree;
	}
}
