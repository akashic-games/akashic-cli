import type { NotificationType } from "../store/NotificationType";
import type { Store } from "../store/Store";

export class UiOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	showActivePlabackRateDialog = (): void => {
		// not implemented
		// this.store.ui.toolBar.showActivePlaybackRateDialog();
	};

	setShowAppearance = (show: boolean): void => {
		this.store.toolBarUiStore.setShowAppearance(show);
	};

	setShowDevtools = (show: boolean): void => {
		this.store.toolBarUiStore.setShowDevtools(show);
	};

	setShowAudioOptionPopover = (show: boolean): void => {
		this.store.toolBarUiStore.setShowAudioOptionPopover(show);
	};

	setShowDisplayOptionPopover = (show: boolean): void => {
		this.store.toolBarUiStore.setShowDisplayOptionPopover(show);
	};

	setShowsAddInstanceOptions = (show: boolean): void => {
		this.store.toolBarUiStore.setShowsAddInstanceOptions(show);
	};

	setFitsToScreen = (fits: boolean): void => {
		this.store.toolBarUiStore.setFitsToScreen(fits);
	};

	setShowBackgroundImage = (show: boolean): void => {
		this.store.toolBarUiStore.setShowBackgroundImage(show);
	};

	setShowBackgroundColor = (show: boolean): void => {
		this.store.toolBarUiStore.setShowBackgroundColor(show);
	};

	setShowGrid = (show: boolean): void => {
		this.store.toolBarUiStore.setShowGrid(show);
	};

	setShowDesignGuideline = (show: boolean): void => {
		this.store.toolBarUiStore.setShowDesignGuideline(show);
	};

	setDevtoolHeight = (height: number): void => {
		this.store.devtoolUiStore.setHeight(height);
	};

	setActiveDevtool = (type: string): void => {
		this.store.devtoolUiStore.setActiveDevtool(type);
	};

	setEventListWidth = (width: number): void => {
		this.store.devtoolUiStore.setEventListWidth(width);
	};

	setShowEventList = (show: boolean): void => {
		this.store.devtoolUiStore.setShowEventList(show);
	};

	copyRegisteredEventToEditor = (eventName: string): void => {
		// assert(this.store.currentLocalInstance.content.sandboxConfig.events);
		const sandboxConfig = this.store.currentLocalInstance!.content.sandboxConfig;
		const pevs = sandboxConfig.events ? sandboxConfig.events[eventName] : [];
		const eventsStr = JSON.stringify(pevs, null, 2);
		this.store.devtoolUiStore.setEventEditContent(eventsStr);
	};

	setEventEditContent = (eventsStr: string): void => {
		this.store.devtoolUiStore.setEventEditContent(eventsStr);
	};

	setInstanceArgumentListWidth = (w: number): void => {
		this.store.startupScreenUiStore.setInstanceArgumentListWidth(w);
	};

	selectInstanceArguments = (name: string | null, noPutStrage: boolean = false): void => {
		const argumentsTable = this.store.currentPlay!.content.argumentsTable;
		const argStr = (name != null) ? argumentsTable[name] : "";
		const { startupScreenUiStore } = this.store;
		startupScreenUiStore.setSelectedArgumentName(name, noPutStrage);
		startupScreenUiStore.setInstanceArgumentEditContent(argStr, noPutStrage);
	};

	setInstanceArgumentEditContent = (argStr: string): void => {
		this.store.startupScreenUiStore.setInstanceArgumentEditContent(argStr);
	};

	setJoinsAutomatically = (join: boolean): void => {
		this.store.startupScreenUiStore.setJoinsAutomatically(join);
	};

	showNotification = (type: NotificationType, title: string, name: string, message: string): void => {
		this.store.notificationUiStore.setActive({type, title, name, message});
	};

	hideNotification = (): void => {
		this.store.notificationUiStore.setInactive();
	};

	setShowsProfiler = (show: boolean): void => {
		this.store.toolBarUiStore.setShowsProfiler(show);
	};

	setAudioVolume = (vol: number): void => {
		this.store.toolBarUiStore.setAudioVolume(vol);
		this.store.currentLocalInstance?.setMasterVolume(vol);
	};
}
