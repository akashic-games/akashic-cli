import { Store } from "../store/Store";

export class UiOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	showActivePlabackRateDialog = (): void => {
		// not implemented
		// this.store.ui.toolBar.showActivePlaybackRateDialog();
	}

	toggleShowAppearance = (show: boolean): void => {
		this.store.toolBarUiStore.toggleShowAppearance(show);
	}

	toggleShowDevtools = (show: boolean): void => {
		this.store.toolBarUiStore.toggleShowDevtools(show);
	}

	setDevtoolHeight = (height: number) => {
		this.store.devtoolUiStore.setHeight(height);
	}

	setActiveDevtool = (type: string): void => {
		this.store.devtoolUiStore.setActiveDevtool(type);
	}

	setEventListWidth = (width: number): void => {
		this.store.devtoolUiStore.setEventListWidth(width);
	}

	toggleShowEventList = (show: boolean): void => {
		this.store.devtoolUiStore.toggleShowEventList(show);
	}

	copyRegisteredEventToEditor = (eventName: string): void => {
		const content = JSON.stringify(this.store.sandboxConfig.events[eventName], null, 2);
		this.store.devtoolUiStore.setEventEditContent(content);
	}

	setEventEditContent = (content: string): void => {
		this.store.devtoolUiStore.setEventEditContent(content);
	}
}
