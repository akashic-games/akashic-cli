import {action, observable} from "mobx";
import {storage} from "./storage";

export class ToolBarUiStore {
	// TODO: 切り出す。devtool にもプログレスバーを置いたので ToolBarUiStore といいつつ共有してしまっている
	@observable currentTimePreview: number;
	@observable isSeeking: boolean;

	@observable showsAppearanceMenu: boolean;
	@observable showsDevtools: boolean;
	@observable showsAudioOptionPopover: boolean;

	@observable showsDisplayOptionPopover: boolean;
	@observable fitsToScreen: boolean;
	@observable showsBackgroundImage: boolean;
	@observable showsGrid: boolean;
	@observable showsProfiler: boolean;
	@observable showsDesignGuideline: boolean;

	constructor() {
		this.currentTimePreview = 0;
		this.isSeeking = false;
		this.showsAppearanceMenu = false;
		this.showsDevtools = storage.data.showsDevtools;
		this.showsAudioOptionPopover = false;
		this.showsDisplayOptionPopover = false;
		this.fitsToScreen = storage.data.fitsToScreen;
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
	setShowAudioOptionPopover(show: boolean): void {
		this.showsAudioOptionPopover = show;
	}

	@action
	setShowDisplayOptionPopover(show: boolean): void {
		this.showsDisplayOptionPopover = show;
	}

	@action
	setFitsToScreen(fits: boolean): void {
		this.fitsToScreen = fits;
		storage.put({ fitsToScreen: fits });
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
