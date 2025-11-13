import type { NotificationType } from "../../store/NotificationType";
import type { Store } from "../store/Store";

export class UiOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	setShowDevtools = (show: boolean): void => {
		this.store.toolBarUiStore.setShowDevtools(show);
	};

	setShowDisplayOptionPopover = (show: boolean): void => {
		this.store.toolBarUiStore.setShowDisplayOptionPopover(show);
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
		const sandboxConfig = this.store.currentLocalInstance!.content.sandboxConfig;
		const pevs = sandboxConfig.events ? sandboxConfig.events[eventName] : [];
		const eventsStr = JSON.stringify(pevs, null, 2);
		this.store.devtoolUiStore.setEventEditContent(eventsStr);
	};

	setEventEditContent = (eventsStr: string): void => {
		this.store.devtoolUiStore.setEventEditContent(eventsStr);
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
}
