import {action, observable} from "mobx";
import {storage} from "./storage";

export class ToolBarUiStore {
	@observable currentTimePreview: number;
	@observable isSeeking: boolean;
	@observable showsAppearanceMenu: boolean;
	@observable showsDevtools: boolean;

	constructor() {
		this.currentTimePreview = 0;
		this.isSeeking = false;
		this.showsAppearanceMenu = false;
		this.showsDevtools = storage.data.showsDevtools;
	}

	@action
	previewSeekTo(seconds: number): void {
		this.currentTimePreview = seconds;
		this.isSeeking = true;
	}

	@action
	endPreviewSeek(): void {
		this.isSeeking = false;
	}

	@action
	toggleShowAppearance(show: boolean): void {
		this.showsAppearanceMenu = show;
	}

	@action
	toggleShowDevtools(show: boolean): void {
		this.showsDevtools = show;
		storage.put({ showsDevtools: show });
	}
}
