import {action, observable} from "mobx";
import {storage} from "./storage";

export class ToolBarUiStore {
	@observable currentTimePreview: number;
	@observable isSeeking: boolean;
	@observable showsAppearanceMenu: boolean;
	@observable showsDevtools: boolean;
	@observable showsDisplayOptionPopover: boolean;
	@observable showsBackgroundImage: boolean;
	@observable showsGrid: boolean;
	@observable showsProfiler: boolean;
	@observable showsDesignGuideline: boolean;

	constructor() {
		this.currentTimePreview = 0;
		this.isSeeking = false;
		this.showsAppearanceMenu = false;
		this.showsDevtools = storage.data.showsDevtools;
		this.showsDisplayOptionPopover = false;
		this.showsBackgroundImage = storage.data.showsBackgroundImage;
		this.showsGrid = storage.data.showsGrid;
		this.showsProfiler = storage.data.showsProfiler;
		this.showsDesignGuideline = storage.data.showsDesignGuideline;
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
	seekTo(seconds: number): void {
		this.currentTimePreview = seconds;
	}

	@action
	setShowAppearance(show: boolean): void {
		this.showsAppearanceMenu = show;
	}

	@action
	setShowDevtools(show: boolean): void {
		this.showsDevtools = show;
		storage.put({ showsDevtools: show });
	}

	@action
	setShowDisplayOptionPopover(show: boolean): void {
		this.showsDisplayOptionPopover = show;
	}

	@action
	setShowBackgroundImage(show: boolean): void {
		this.showsBackgroundImage = show;
		storage.put({ showsBackgroundImage: show });
	}

	@action
	setShowGrid(show: boolean): void {
		this.showsGrid = show;
		storage.put({ showsGrid: show });
	}

	@action
	setShowsProfiler(show: boolean): void {
		this.showsProfiler = show;
		storage.put({ showsProfiler: show });
	}

	@action
	setShowDesignGuideline(show: boolean): void {
		this.showsDesignGuideline = show;
		storage.put({ showsDesignGuideline: show });
	}
}
