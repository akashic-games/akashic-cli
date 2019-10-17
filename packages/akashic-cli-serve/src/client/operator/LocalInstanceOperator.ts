import { Store } from "../store/Store";
import { EDumpItem, makeEDumpItem } from "../akashic/EDumpItem";

export class LocalInstanceOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	previewSeekTo = (seconds: number): void => {
		this.store.toolBarUiStore.previewSeekTo(seconds);
	}

	seekTo = (seconds: number): void => {
		this.store.currentLocalInstance.setExecutionMode("replay");
		this.store.currentLocalInstance.setTargetTime(seconds);
		this.store.toolBarUiStore.endPreviewSeek();
	}

	togglePause = (pause: boolean): void => {
		this.store.currentLocalInstance.togglePause(pause);
	}

	switchToRealtime = (): void => {
		this.store.currentLocalInstance.setExecutionMode("passive");
		this.store.currentLocalInstance.resume();
	}

	// TODO DevtoolOperator を作って以下を移す

	updateEntityTrees = (): void => {
		// TODO /akashic/ 以下に移す
		// TODO any をなんとかする(現状で型をつけてもuntrustedの時整合しない)。デバッグ用機能がエンジンやAGVに必要？
		const game: any = this.store.currentPlay.localInstances[0].gameContent.agvGameContent.getGame();
		const children = game.scene().children;
		this.store.devtoolUiStore.setEntityTrees((children || []).map(makeEDumpItem));
	}

	toggleOpenEntityTreeChildren = (e: EDumpItem): void => {
		this.store.devtoolUiStore.toggleOpenEntityTreeChildren(e);
	}

	setHighlightedEntity = (e: EDumpItem): void => {
		this.store.currentPlay.localInstances[0].gameContent.changeHighlightedEntity(e.id);
	}

	clearHighlightedEntity = (): void => {
		this.store.currentPlay.localInstances[0].gameContent.changeHighlightedEntity(null);
	}

	setHighlightedEntityByPoint = (x: number, y: number): void => {
		const gameContent = this.store.currentPlay.localInstances[0].gameContent;
		gameContent.changeHighlightedEntity(gameContent.getEntityIdByPoint(x, y));
	}

	toggleShowHiddenEntity = (shows: boolean): void => {
		this.store.devtoolUiStore.toggleShowHiddenEntity(shows);
	}

	startEntitySelection = (): void => {
		this.store.devtoolUiStore.toggleIsSelectingEntity(true);
	}

	finishEntitySelection = (x: number, y: number): void => {
		const gameContent = this.store.currentPlay.localInstances[0].gameContent;
		this.store.devtoolUiStore.toggleIsSelectingEntity(false);
		this.store.devtoolUiStore.setSelectedEntityId(gameContent.getEntityIdByPoint(x, y));
		gameContent.changeHighlightedEntity(null);
	}

	selectEntityByEDumpItem = (e: EDumpItem): void => {
		this.store.devtoolUiStore.setSelectedEntityId(e.id);
	}
}
