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

	setGameArgumentListWidth = (w: number): void => {
		this.store.startupScreenUiStore.setGameArgumentListWidth(w);
	}

	selectGameArguments = (name: string | null): void => {
		const content = (name != null) ? this.store.argumentsTable[name] : "";
		const { startupScreenUiStore } = this.store;
		startupScreenUiStore.setSelectedArgumentsName(name);
		startupScreenUiStore.setGameArgumentEditContent(content);
	}

	setGameArgumentEditContent = (content: string): void => {
		this.store.startupScreenUiStore.setGameArgumentEditContent(content);
	}

	setJoinsAutomatically = (join: boolean): void => {
		this.store.startupScreenUiStore.setJoinsAutomatically(join);
	}
}
