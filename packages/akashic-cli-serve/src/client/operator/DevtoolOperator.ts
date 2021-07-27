import { EDumpItem } from "../common/types/EDumpItem";
import { Store } from "../store/Store";

export class DevtoolOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	updateEntityTrees = (): void => {
		const dumpItems = this.store.currentLocalInstance.gameContent.dumpEntities();
		this.store.devtoolUiStore.setEntityTrees(dumpItems);
	};

	toggleOpenEntityTreeChildren = (e: EDumpItem): void => {
		this.store.devtoolUiStore.toggleOpenEntityTreeChildren(e);
	};

	setHighlightedEntity = (e: EDumpItem): void => {
		this.store.currentLocalInstance.gameContent.changeHighlightedEntity(e.id);
	};

	clearHighlightedEntity = (): void => {
		this.store.currentLocalInstance.gameContent.changeHighlightedEntity(null);
	};

	toggleShowHiddenEntity = (shows: boolean): void => {
		this.store.devtoolUiStore.toggleShowHiddenEntity(shows);
	};

	selectEntityByEDumpItem = (e: EDumpItem): void => {
		this.store.devtoolUiStore.setSelectedEntityId(e.id);
	};

	selectEntityByPoint = (x: number, y: number): void => {
		const gameContent = this.store.currentLocalInstance.gameContent;
		const eid = gameContent.getEntityIdByPoint(x, y);
		this.store.devtoolUiStore.setSelectedEntityId(eid);
		gameContent.changeHighlightedEntity(eid);
	};

	startEntitySelection = (): void => {
		this.store.devtoolUiStore.toggleIsSelectingEntity(true);
	};

	finishEntitySelection = (x: number, y: number): void => {
		const gameContent = this.store.currentLocalInstance.gameContent;
		this.updateEntityTrees();
		this.store.devtoolUiStore.toggleIsSelectingEntity(false);
		this.store.devtoolUiStore.setSelectedEntityId(gameContent.getEntityIdByPoint(x, y));
		gameContent.changeHighlightedEntity(null);
	};

	dumpSelectedEntity = (): void => {
		const gameContent = this.store.currentLocalInstance.gameContent;
		const e = gameContent.getRawEntity(this.store.devtoolUiStore.selectedEntityId);
		console.log(e);

		// 暫定便利機能: ダンプついでにしれっとグローバル変数に刺しておく (c.f. Chrome/Firefox の $0)
		// (console からグローバルに格納できる Chrome などでは不要なので暫定)
		(window as any).__testbed.$0 = e;
	};

	volumeChangeTo = (vol: number): void => {
		this.store.devtoolUiStore.volumeSeekTo(vol);
		const atsumaruApi = (window as any).RPGAtsumaru;
		if (atsumaruApi) {
			atsumaruApi.volumeTrigger.fire(vol / 100);
		}
	};

	volumeSeekTo = (vol: number): void => {
		this.store.devtoolUiStore.endVolumeSeek(vol);
		const atsumaruApi = (window as any).RPGAtsumaru;
		if (atsumaruApi) {
			atsumaruApi.volumeTrigger.fire(vol / 100);
		}
	};

	toggleAutoSendEvents = (isSend: boolean): void => {
		this.store.devtoolUiStore.toggleAutoSendEvents(isSend);
	};

	toggleUsePreferredTotalTimeLimit = (use: boolean): void => {
		this.store.devtoolUiStore.toggleUsePreferredTotalTimeLimit(use);
	};

	toggleUseStopGame = (use: boolean): void => {
		this.store.devtoolUiStore.toggleUseStopGame(use);
	};

	setSupportedMode = (value: string): void => {
		this.store.devtoolUiStore.setSupportedMode(value);
	};

	setTotalTimeLimitInputValue = (value: number): void => {
		this.store.devtoolUiStore.setTotalTimeLimitInputValue(value);
	};

	createNicoEvent = (): any => {
		const emulatingShinichibaMode = this.store.devtoolUiStore.emulatingShinichibaMode;
		const params: any = {
			"mode": emulatingShinichibaMode
		};
		if (emulatingShinichibaMode === "ranking") {
			params.totalTimeLimit = this.store.devtoolUiStore.totalTimeLimit;
		}
		const event = [[32, 0, "dummy", {
			"type": "start",
			"parameters": params
		}]];
		return event;
	};

	setupNiconicoDevtoolValueWatcher = (): void => {
		const gameContent = this.store.currentLocalInstance.gameContent;
		if (!gameContent.onTick.contains(this.tickHandler, this))
			gameContent.onTick.add(this.tickHandler, this);
	};

	private tickHandler(game: agv.GameLike): void {
		if (this.store.devtoolUiStore.stopsGameOnTimeout)
			this.updateRemainingTime();

		if (game.vars && game.vars.gameState) {
			this.store.devtoolUiStore.setScore(game.vars.gameState.score);
			this.store.devtoolUiStore.setPlayThreshold(game.vars.gameState.playThreshold);
			this.store.devtoolUiStore.setClearThreshold(game.vars.gameState.clearThreshold);
		}
	}

	private updateRemainingTime(): void {
		if (!this.store.devtoolUiStore.isAutoSendEvent
			|| this.store.devtoolUiStore.emulatingShinichibaMode !== "ranking"
			|| this.store.currentLocalInstance.executionMode === "replay"
		) return;

		const dur = this.store.currentPlay.duration / 1000;
		const totalTimeLimit = this.store.devtoolUiStore.totalTimeLimit;
		if (dur >= totalTimeLimit && !this.store.currentPlay.isActivePausing) {
			this.store.currentPlay.pauseActive();
		}
	}
}
