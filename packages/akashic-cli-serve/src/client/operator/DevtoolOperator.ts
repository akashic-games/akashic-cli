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
	}

	toggleOpenEntityTreeChildren = (e: EDumpItem): void => {
		this.store.devtoolUiStore.toggleOpenEntityTreeChildren(e);
	}

	setHighlightedEntity = (e: EDumpItem): void => {
		this.store.currentLocalInstance.gameContent.changeHighlightedEntity(e.id);
	}

	clearHighlightedEntity = (): void => {
		this.store.currentLocalInstance.gameContent.changeHighlightedEntity(null);
	}

	toggleShowHiddenEntity = (shows: boolean): void => {
		this.store.devtoolUiStore.toggleShowHiddenEntity(shows);
	}

	selectEntityByEDumpItem = (e: EDumpItem): void => {
		this.store.devtoolUiStore.setSelectedEntityId(e.id);
	}

	selectEntityByPoint = (x: number, y: number): void => {
		const gameContent = this.store.currentLocalInstance.gameContent;
		const eid = gameContent.getEntityIdByPoint(x, y);
		this.store.devtoolUiStore.setSelectedEntityId(eid);
		gameContent.changeHighlightedEntity(eid);
	}

	startEntitySelection = (): void => {
		this.store.devtoolUiStore.toggleIsSelectingEntity(true);
	}

	finishEntitySelection = (x: number, y: number): void => {
		const gameContent = this.store.currentLocalInstance.gameContent;
		this.updateEntityTrees();
		this.store.devtoolUiStore.toggleIsSelectingEntity(false);
		this.store.devtoolUiStore.setSelectedEntityId(gameContent.getEntityIdByPoint(x, y));
		gameContent.changeHighlightedEntity(null);
	}
}
