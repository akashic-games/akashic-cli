import type { ObservableMap } from "mobx";
import { action, observable } from "mobx";
import type { EDumpItem } from "../common/types/EDumpItem";
import type { NiconicoDevtoolPageType } from "../view/molecule/NiconicoDevtool";
import { DevtoolUiCommentPageStore } from "./DevtoolUiCommentPageStore";
import { storage } from "./storage";

export class DevtoolUiStore {
	static DEFAULT_TOTAL_TIME_LIMIT = 85;

	// storage に保存するもの
	@observable height: number;
	@observable activeDevtool: string;
	@observable isForceResetOnSeek: boolean;
	@observable showsEventList: boolean;
	@observable eventListWidth: number;
	@observable eventEditContent: string;
	@observable showsHiddenEntity: boolean;
	@observable isAutoSendEvent: boolean;
	@observable emulatingShinichibaMode: string;
	@observable usePreferredTotalTimeLimit: boolean;
	@observable stopsGameOnTimeout: boolean;
	@observable totalTimeLimitInputValue: number;
	@observable niconicoToolActivePage: NiconicoDevtoolPageType;

	// storage に保存しないもの
	@observable focusedStartPointHeaderIndex: number | null;
	@observable isSelectingEntity: boolean;
	@observable selectedEntityId: number | null;
	@observable entityTrees: EDumpItem[];
	@observable entityTreeStateTable: ObservableMap<number, boolean>;
	@observable isSeekingVolume: boolean;
	@observable volume: number;
	@observable score: number | undefined;
	@observable playThreshold: number | undefined;
	@observable clearThreshold: number | undefined;
	@observable totalTimeLimit: number | null;
	@observable preferredTotalTimeLimit: number | null;
	@observable niconicoToolSelectorWidth: number;

	commentPage: DevtoolUiCommentPageStore;

	constructor() {
		this.height = storage.data.devtoolsHeight;
		this.activeDevtool = storage.data.activeDevtool;
		this.isForceResetOnSeek = storage.data.isForceResetOnSeek;
		this.showsEventList = storage.data.showsEventList;
		this.eventListWidth = storage.data.eventListWidth;
		this.eventEditContent = storage.data.eventEditContent;
		this.showsHiddenEntity = storage.data.showsHiddenEntity;
		this.focusedStartPointHeaderIndex = null;
		this.isSelectingEntity = false;
		this.selectedEntityId = null;
		this.entityTrees = [];
		this.entityTreeStateTable = observable.map<number, boolean>();
		this.isSeekingVolume = false;
		this.volume = 100;
		this.niconicoToolActivePage = storage.data.niconicoToolActivePage;
		this.isAutoSendEvent = storage.data.isAutoSendEvents;
		this.emulatingShinichibaMode = storage.data.emulatingShinichibaMode;
		this.usePreferredTotalTimeLimit = storage.data.usePreferredTotalTimeLimit;
		this.stopsGameOnTimeout = storage.data.stopsGameOnTimeout;
		this.totalTimeLimitInputValue = storage.data.totalTimeLimitInputValue;
		this.score = undefined;
		this.playThreshold = undefined;
		this.clearThreshold = undefined;
		this.totalTimeLimit = null;
		this.preferredTotalTimeLimit = null;
		this.niconicoToolSelectorWidth = 120;
		this.commentPage = new DevtoolUiCommentPageStore();
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
	toggleForceResetOnSeek(reset: boolean): void {
		this.isForceResetOnSeek = reset;
		storage.put({ isForceResetOnSeek: reset });
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
	setFocusedStartPointHeaderIndex(index: number | null): void {
		this.focusedStartPointHeaderIndex = index;
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

	/* eslint-disable @typescript-eslint/indent */
	// annotation の次行の関数式でインデントエラーとなるため disable とする。
	@action
	toggleIsSelectingEntity = (select: boolean): void => {
		this.isSelectingEntity = select;
	};

	@action
	setSelectedEntityId = (eid: number | null): void => {
		this.selectedEntityId = eid;
	};
	/* eslint-enable @typescript-eslint/indent */

	@action
	// 現在は利用していないが、将来音量調節機能をつける時に使う
	volumeSeekTo(volume: number): void {
		this.volume = volume;
		this.isSeekingVolume = true;
	}

	@action
	// 現在は利用していないが、将来音量調節機能をつける時に使う
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

	@action
	setNiconicoToolActivePage(pageType: NiconicoDevtoolPageType): void {
		this.niconicoToolActivePage = pageType;
		storage.put({ niconicoToolActivePage: pageType });
	}

	@action
	setNiconicoToolSelectorWidth(w: number): void {
		this.niconicoToolSelectorWidth = w;
	}
}
