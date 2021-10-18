import { action, observable, ObservableMap } from "mobx";
import { EDumpItem } from "../common/types/EDumpItem";
import { storage } from "./storage";

export class DevtoolUiStore {
	static DEFAULT_TOTAL_TIME_LIMIT = 85;

	// storage に保存するもの
	@observable height: number;
	@observable activeDevtool: string;
	// storage に保存するもの - playback
	@observable isPauseOnSeek: boolean;
	@observable isForceResetOnSeek: boolean;
	// storege に保存するもの - events
	@observable showsEventList: boolean;
	@observable eventListWidth: number;
	@observable eventEditContent: string;
	// storege に保存するもの - entity
	@observable showsHiddenEntity: boolean;
	// storege に保存するもの - niconico
	@observable isAutoSendEvent: boolean;
	@observable emulatingShinichibaMode: string;
	@observable usePreferredTotalTimeLimit: boolean;
	@observable stopsGameOnTimeout: boolean;
	@observable totalTimeLimitInputValue: number;

	// storage に保存しないもの - playback
	@observable isSeeking: boolean;
	@observable currentTimePreview: number;
	@observable selectedStartPointHeaderIndex: number | null;
	// storage に保存しないもの - entity
	@observable isSelectingEntity: boolean;
	@observable selectedEntityId: number | null;
	@observable entityTrees: EDumpItem[];
	@observable entityTreeStateTable: ObservableMap<number, boolean>;
	// storage に保存しないもの - atsumaru
	@observable isSeekingVolume: boolean;
	@observable volume: number;
	// storage に保存しないもの - niconico
	@observable score: number;
	@observable playThreshold: number;
	@observable clearThreshold: number;
	@observable totalTimeLimit: number;
	@observable preferredTotalTimeLimit: number;

	constructor() {
		this.height = storage.data.devtoolsHeight;
		this.activeDevtool = storage.data.activeDevtool;
		this.isPauseOnSeek = false; // TODO
		this.isForceResetOnSeek = false; // TODO
		this.showsEventList = storage.data.showsEventList;
		this.eventListWidth = storage.data.eventListWidth;
		this.eventEditContent = storage.data.eventEditContent;
		this.showsHiddenEntity = storage.data.showsHiddenEntity;
		this.isSeeking = false;
		this.currentTimePreview = 0;
		this.selectedStartPointHeaderIndex = null;
		this.isSelectingEntity = false;
		this.selectedEntityId = null;
		this.entityTrees = [];
		this.entityTreeStateTable = observable.map<number, boolean>();
		this.isSeekingVolume = false;
		this.volume = 100;
		this.isAutoSendEvent = storage.data.isAutoSendEvents;
		this.emulatingShinichibaMode = storage.data.emulatingShinichibaMode;
		this.usePreferredTotalTimeLimit = storage.data.usePreferredTotalTimeLimit;
		this.stopsGameOnTimeout = storage.data.stopsGameOnTimeout;
		this.totalTimeLimitInputValue = storage.data.totalTimeLimitInputValue;
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
	togglePauseOnSeek(pauses: boolean): void {
		this.isPauseOnSeek = pauses;
	}

	@action
	toggleForceResetOnSeek(resets: boolean): void {
		this.isForceResetOnSeek = resets;
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
	previewSeekTo(seconds: number): void {
		this.currentTimePreview = seconds;
		this.isSeeking = true;
	}

	@action
	endPreviewSeek(): void {
		this.isSeeking = false;
	}

	@action
	seekTo(seconds: number): void {
		this.currentTimePreview = seconds;
	}

	@action
	setSelectedStartPointHeaderIndex(index: number | null): void {
		this.selectedStartPointHeaderIndex = index;
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
	toggleAutoSendEvents(isSend: boolean): void {
		this.isAutoSendEvent = isSend;
		storage.put({ isAutoSendEvents: isSend });
	}

	@action
	toggleUsePreferredTotalTimeLimit(v: boolean): void {
		this.usePreferredTotalTimeLimit = v;
		storage.put({ usePreferredTotalTimeLimit: v });
	}

	@action
	toggleUseStopGame(v: boolean): void {
		this.stopsGameOnTimeout = v;
		storage.put({ stopsGameOnTimeout: v });
	}
	@action
	setSupportedMode(mode: string): void {
		this.emulatingShinichibaMode = mode;
		storage.put({ emulatingShinichibaMode: mode });
	}
	@action
	setTotalTimeLimitInputValue(v: number): void {
		this.totalTimeLimitInputValue = v;
		storage.put({ totalTimeLimitInputValue: v });
	}
	@action
	settotalTimeLimit(v: number): void {
		this.totalTimeLimit = v;
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

	@action
	initTotalTimeLimit(_preferredTotalTimeLimit: number): void {
		this.preferredTotalTimeLimit = _preferredTotalTimeLimit;
		this.totalTimeLimit = this.usePreferredTotalTimeLimit ? _preferredTotalTimeLimit : this.totalTimeLimitInputValue;
	}
}
