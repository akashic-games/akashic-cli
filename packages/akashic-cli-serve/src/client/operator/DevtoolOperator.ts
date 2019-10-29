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

	dumpSelectedEntity = (): void => {
		const gameContent = this.store.currentLocalInstance.gameContent;
		const e = gameContent.getRawEntity(this.store.devtoolUiStore.selectedEntityId);
		console.log(e);

		// 暫定便利機能: ダンプついでにしれっとグローバル変数に刺しておく (c.f. Chrome/Firefox の $0)
		// (console からグローバルに格納できる Chrome などでは不要なので暫定)
		(window as any).__testbed.$0 = e;
	}

	setInjectionValue = (key: string, val: any): void => {
		this.store.devtoolUiStore.setInjectionValue(key, val);

		if ((window as any).__testbedInject) {
			const item = (window as any).__testbedInject[key];
			if (item) {
				item.set(val);
				item.onchange();
			}
		}
	}
}
