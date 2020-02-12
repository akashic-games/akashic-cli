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
	@observable showSessionParameterTable: boolean;
	@observable supportMode: string;
	@observable usePreferredTotalTimeLimit: boolean;
	@observable useStopGame: boolean;
	@observable totalTimeLimit: string;

	// storage に保存しないもの
	@observable isSelectingEntity: boolean;
	@observable selectedEntityId: number | null;
	@observable entityTrees: EDumpItem[];
	@observable entityTreeStateTable: ObservableMap<number, boolean>;
	@observable isSeekingVolume: boolean;
	@observable volume: number;
	@observable stopGameOnTimeOut: boolean;
	@observable remainingTime: number;
	@observable score: number;
	@observable playThreshold: number;
	@observable clearThreshold: number;

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
		this.showSessionParameterTable = storage.data.showSessionParameterTable;
		this.supportMode = storage.data.supportedMode;
		this.usePreferredTotalTimeLimit = storage.data.usePreferredTotalTimeLimit;
		this.useStopGame = storage.data.useStopGame;
		this.totalTimeLimit = storage.data.totalTimeLimit;
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

	@action
	toggleShowSessionParameterTable(show: boolean): void {
		this.showSessionParameterTable = show;
		storage.put({ showSessionParameterTable: show });
	}

	@action
	toggleUsePreferredTotalTimeLimit(v: boolean): void {
		this.usePreferredTotalTimeLimit = v;
		storage.put({ usePreferredTotalTimeLimit: v });
	}

	@action
	toggleUseStopGame(v: boolean): void {
		this.useStopGame = v;
		storage.put({ useStopGame: v });
	}
	@action
	setSupportedMode(mode: string): void {
		this.supportMode = mode;
		storage.put({ supportedMode: mode });
	}
	@action
	setTotalTimeLimit(v: string): void {
		this.totalTimeLimit = v;
		storage.put({ totalTimeLimit: v });
	}
	@action
	setRemainingTimeUntilGameStop(v: number): void {
		this.remainingTime = v;
	}
	@action
	setStopGameOnTimeOut(v: boolean): void {
		this.stopGameOnTimeOut = v;
	}

	@action
	setScore(v: number): void {
		this.score = v;
	}

	@action
	setPlayThreshold(v: number): void {
		this.playThreshold = v;
	}

	@action
	setClearThreshold(v: number): void {
		this.clearThreshold = v;
	}
}
