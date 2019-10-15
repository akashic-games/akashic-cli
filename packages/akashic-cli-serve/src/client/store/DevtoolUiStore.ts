import { action, observable, ObservableMap } from "mobx";
import { EDumpItem } from "../common/EDumpItem";
import { storage } from "./storage";

export class DevtoolUiStore {
	@observable height: number;
	@observable activeDevtool: string;
	@observable showsEventList: boolean;
	@observable eventListWidth: number;
	@observable eventEditContent: string;
	@observable entityTrees: EDumpItem[];
	@observable entityTreeStateTable: ObservableMap<number, boolean>;

	constructor() {
		this.height = storage.data.devtoolsHeight;
		this.activeDevtool = storage.data.activeDevtool;
		this.showsEventList = storage.data.showsEventList;
		this.eventListWidth = storage.data.eventListWidth;
		this.eventEditContent = storage.data.eventEditContent;
		this.entityTrees = [];
		this.entityTreeStateTable = observable.map<number, boolean>();
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
	setEntityTrees(entityTrees: EDumpItem[]): void {
		this.entityTrees = entityTrees;
	}

	@action
	toggleOpenEntityTreeChildren(e: EDumpItem): void {
		this.entityTreeStateTable.set(e.id, !this.entityTreeStateTable.get(e.id));
	}
}
