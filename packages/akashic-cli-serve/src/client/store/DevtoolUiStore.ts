import { action, observable, ObservableMap } from "mobx";
import { EDumpItem } from "../common/types/EDumpItem";
import { storage } from "./storage";
import { GameConfiguration } from "../../common/types/GameConfiguration";
import { ServiceType } from "../../common/types/ServiceType";

export class DevtoolUiStore {
	readonly defaultTotalTimeLimit = 85;

	@observable height: number;
	@observable activeDevtool: string;
	@observable showsEventList: boolean;
	@observable eventListWidth: number;
	@observable eventEditContent: string;
	@observable showsHiddenEntity: boolean;
	@observable isAutoSendEvent: boolean;
	@observable supportMode: string;
	@observable usePreferredTotalTimeLimit: boolean;
	@observable useStopGameOnTimeout: boolean;
	@observable totalTimeLimit: string;
	@observable remainingTime: number;

	// storage に保存しないもの
	@observable isSelectingEntity: boolean;
	@observable selectedEntityId: number | null;
	@observable entityTrees: EDumpItem[];
	@observable entityTreeStateTable: ObservableMap<number, boolean>;
	@observable isSeekingVolume: boolean;
	@observable volume: number;
	@observable score: number;
	@observable playThreshold: number;
	@observable clearThreshold: number;
	@observable preferredTotalTimeLimit: number;

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
		this.isAutoSendEvent = storage.data.isAutoSendEvents;
		this.supportMode = storage.data.supportedMode;
		this.usePreferredTotalTimeLimit = storage.data.usePreferredTotalTimeLimit;
		this.useStopGameOnTimeout = storage.data.useStopGame;
		this.totalTimeLimit = storage.data.totalTimeLimit ;
		this.remainingTime = storage.data.remainingTime || this.defaultTotalTimeLimit;
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
		this.useStopGameOnTimeout = v;
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
	setRemainingTime(v: number): void {
		this.remainingTime = v;
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
	initializePrefferdSessionParams(gameJson: GameConfiguration): void {
		const niconicoConfig = gameJson && gameJson.environment && gameJson.environment.niconico;
		this.preferredTotalTimeLimit =
			!niconicoConfig || !niconicoConfig.preferredSessionParameters || !niconicoConfig.preferredSessionParameters.totalTimeLimit
				? this.defaultTotalTimeLimit
				: niconicoConfig.preferredSessionParameters.totalTimeLimit;

		this.initializeReamingTime();
	}


	@action
	initializeReamingTime(): void {
		if (this.totalTimeLimit === "")
			this.totalTimeLimit = this.defaultTotalTimeLimit.toString();
		this.remainingTime = this.usePreferredTotalTimeLimit ? this.preferredTotalTimeLimit : parseInt(this.totalTimeLimit, 10);
		storage.put({ totalTimeLimit: this.totalTimeLimit });
		storage.put({ remainingTime: this.remainingTime });
	}

	createTickHandler(targetService: ServiceType): (game: agv.GameLike) => void {
		return (game: agv.GameLike) => {
			if (targetService !== ServiceType.Atsumaru && game.vars && game.vars.gameState) {
				this.setScore(game.vars.gameState.score);
				this.setPlayThreshold(game.vars.gameState.playThreshold);
				this.setClearThreshold(game.vars.gameState.clearThreshold);
			}
		};
	}
}
