import type { EDumpItem } from "../../common/types/EDumpItem";
import type { Store } from "../Store";

function consoleLog(value: any): void {
	console.log(value);

	// 暫定便利機能: ダンプついでにしれっとグローバル変数に刺しておく (c.f. Chrome/Firefox の $0)
	// (console からグローバルに格納できる Chrome などでは不要なので暫定)
	(window as any).__testbed.$0 = value;
}

export class DevtoolOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	toggleForceResetOnSeek = (pauses: boolean): void => {
		this.store.devtoolUiStore.toggleForceResetOnSeek(pauses);
	};

	setHoveredStartPointIndex = (index: number, hover: boolean): void => {
		this.store.devtoolUiStore.setFocusedStartPointHeaderIndex(hover ? index : null);
	};

	dumpStartPointOfIndex = (index: number): Promise<void> => {
		return new Promise((resolve, reject) => {
			const currentPlay = this.store.currentPlay!;
			const frame = currentPlay?.startPointHeaders[index]?.frame;
			if (frame == null) {
				reject();
				return;
			}
			currentPlay.amflow.getStartPoint({ frame }, (err, startPoint) => {
				if (err) {
					console.error(err);
					reject();
					return;
				}
				consoleLog(startPoint);
				resolve();
			});
		});
	};

	updateEntityTrees = (): void => {
		const dumpItems = this.store.currentLocalInstance!.gameContent.dumpEntities();
		this.store.devtoolUiStore.setEntityTrees(dumpItems);
	};

	toggleOpenEntityTreeChildren = (e: EDumpItem): void => {
		this.store.devtoolUiStore.toggleOpenEntityTreeChildren(e);
	};

	setHighlightedEntity = (e: EDumpItem): void => {
		this.store.currentLocalInstance!.gameContent.changeHighlightedEntity(e.id);
	};

	clearHighlightedEntity = (): void => {
		this.store.currentLocalInstance!.gameContent.changeHighlightedEntity(null);
	};

	toggleShowHiddenEntity = (shows: boolean): void => {
		this.store.devtoolUiStore.toggleShowHiddenEntity(shows);
	};

	selectEntityByEDumpItem = (e: EDumpItem): void => {
		this.store.devtoolUiStore.setSelectedEntityId(e.id);
	};

	selectEntityByPoint = (x: number, y: number): void => {
		const gameContent = this.store.currentLocalInstance!.gameContent;
		const eid = gameContent.getEntityIdByPoint(x, y);
		this.store.devtoolUiStore.setSelectedEntityId(eid);
		gameContent.changeHighlightedEntity(eid);
	};

	startEntitySelection = (): void => {
		this.store.devtoolUiStore.toggleIsSelectingEntity(true);
	};

	finishEntitySelection = (x: number, y: number): void => {
		const gameContent = this.store.currentLocalInstance!.gameContent;
		this.updateEntityTrees();
		this.store.devtoolUiStore.toggleIsSelectingEntity(false);
		this.store.devtoolUiStore.setSelectedEntityId(gameContent.getEntityIdByPoint(x, y));
		gameContent.changeHighlightedEntity(null);
	};

	dumpSelectedEntity = (): void => {
		const gameContent = this.store.currentLocalInstance!.gameContent;
		const e = gameContent.getRawEntity(this.store.devtoolUiStore.selectedEntityId!);
		consoleLog(e);
	};

	// 現在は利用していないが、将来音量調節機能をつける時に使う
	volumeChangeTo = (vol: number): void => {
		this.store.devtoolUiStore.volumeSeekTo(vol);
		this.store.currentLocalInstance!.setMasterVolume(vol / 100); // convert percentage to decimal
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

	setupNiconicoDevtoolValueWatcher = (): void => {
		const gameContent = this.store.currentLocalInstance!.gameContent;
		if (!gameContent.onTick.contains(this.tickHandler, this))
			gameContent.onTick.add(this.tickHandler, this);
	};

	private async tickHandler(game: agv.GameLike): Promise<void> {
		if (this.store.devtoolUiStore.stopsGameOnTimeout)
			await this.updateRemainingTime();

		if (game.vars && game.vars.gameState) {
			this.store.devtoolUiStore.setScore(game.vars.gameState.score);
			this.store.devtoolUiStore.setPlayThreshold(game.vars.gameState.playThreshold);
			this.store.devtoolUiStore.setClearThreshold(game.vars.gameState.clearThreshold);
		}
	}

	private async updateRemainingTime(): Promise<void> {
		if (!this.store.devtoolUiStore.isAutoSendEvent
			|| this.store.devtoolUiStore.emulatingShinichibaMode !== "ranking"
			|| this.store.currentLocalInstance!.executionMode === "replay"
		) return;

		const dur = this.store.currentPlay!.duration / 1000;
		const totalTimeLimit = this.store.devtoolUiStore.totalTimeLimit;
		if (dur >= totalTimeLimit! && !this.store.currentPlay!.isActivePausing) {
			await this.store.currentPlay!.pauseActive();
		}
	}
}
