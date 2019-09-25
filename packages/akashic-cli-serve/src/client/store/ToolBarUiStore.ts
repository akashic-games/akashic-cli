import {action, observable} from "mobx";
import {storage} from "./storage";

export class ToolBarUiStore {
	@observable currentTimePreview: number;
	@observable isSeeking: boolean;
	@observable showsAppearanceMenu: boolean;
	@observable showsDevtools: boolean;
	@observable showsGameScreenPopover: boolean;
	@observable showsBgImage: boolean;
	@observable showsGridCanvas: boolean;

	constructor() {
		this.currentTimePreview = 0;
		this.isSeeking = false;
		this.showsAppearanceMenu = false;
		this.showsDevtools = storage.data.showsDevtools;
		this.showsGameScreenPopover = false;
		this.showsBgImage = storage.data.showsBgImage;
		this.showsGridCanvas = storage.data.showsGridCanvas;
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

	@action
	toggleShowGameScreenPopover(show: boolean): void {
		this.showsGameScreenPopover = show;
	}

	@action
	toggleShowBgImage(show: boolean): void {
		this.showsBgImage = show;
		storage.put({ showsBgImage: show });
	}

	@action
	toggleShowGridCanvas(show: boolean): void {
		this.showsGridCanvas = show;
		storage.put({ showsGridCanvas: show });
	}
}
