import { action, observable, ObservableMap } from "mobx";
import { EDumpItem } from "../common/types/EDumpItem";
import { storage } from "./storage";

export class DevtoolUiStore {
	@observable height: number;
	@observable activeDevtool: string;
	@observable showsEventList: boolean;
	@observable eventListWidth: number;
	@observable eventEditContent: string;
	@observable showsHiddenEntity: boolean;

	// storage に保存しないもの
	@observable isSelectingEntity: boolean;
	@observable selectedEntityId: number | null;
	@observable entityTrees: EDumpItem[];
	@observable entityTreeStateTable: ObservableMap<number, boolean>;
	@observable isSeekingVolume: boolean;
	@observable volume: number;

	constructor() {
		this.height = storage.data.devtoolsHeight;
		this.activeDevtool = storage.data.activeDevtool;
		this.showsEventList = storage.data.showsEventList;
		this.eventListWidth = storage.data.eventListWidth;
		this.eventEditContent = storage.data.eventEditContent;
		this.showsHiddenEntity = storage.data.showsHiddenEntity;
		this.isSelectingEntity = false;
		this.selectedEntityId = null;
		this.entityTrees = [];
		this.entityTreeStateTable = observable.map<number, boolean>();
		this.isSeekingVolume = false;
		this.volume = 100;
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
	setShowEventList(show: boolean): void {
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

	@action
	toggleShowHiddenEntity(show: boolean): void {
		this.showsHiddenEntity = show;
		storage.put({ showsHiddenEntity: show });
	}

	@action
	toggleIsSelectingEntity = (select: boolean): void => {
		this.isSelectingEntity = select;
	}

	@action
	setSelectedEntityId = (eid: number | null): void => {
		this.selectedEntityId = eid;
	}

	@action
	volumeSeekTo(volume: number): void {
		this.volume = volume;
		this.isSeekingVolume = true;
	}

	@action
	endVolumeSeek(volume: number): void {
		this.volume = volume;
		this.isSeekingVolume = false;
	}
}
