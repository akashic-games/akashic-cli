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

	toggleShowBgImage = (show: boolean): void => {
		this.store.toolBarUiStore.toggleShowBgImage(show);
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
		// assert(this.store.currentLocalInstance.content.sandboxConfig.events);
		const sandboxConfig = this.store.currentLocalInstance.content.sandboxConfig;
		const eventsStr = JSON.stringify(sandboxConfig.events[eventName], null, 2);
		this.store.devtoolUiStore.setEventEditContent(eventsStr);
	}

	setEventEditContent = (eventsStr: string): void => {
		this.store.devtoolUiStore.setEventEditContent(eventsStr);
	}

	setInstanceArgumentListWidth = (w: number): void => {
		this.store.startupScreenUiStore.setInstanceArgumentListWidth(w);
	}

	selectInstanceArguments = (name: string | null): void => {
		const argumentsTable = this.store.currentPlay.content.argumentsTable;
		const argStr = (name != null) ? argumentsTable[name] : "";
		const { startupScreenUiStore } = this.store;
		startupScreenUiStore.setSelectedArgumentName(name);
		startupScreenUiStore.setInstanceArgumentEditContent(argStr);
	}

	setInstanceArgumentEditContent = (argStr: string): void => {
		this.store.startupScreenUiStore.setInstanceArgumentEditContent(argStr);
	}

	setJoinsAutomatically = (join: boolean): void => {
		this.store.startupScreenUiStore.setJoinsAutomatically(join);
	}
}
