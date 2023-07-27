import {action, observable, runInAction} from "mobx";
import {storage} from "./storage";

export class ToolBarUiStore {
	// TODO: 切り出す。devtool にもプログレスバーを置いたので ToolBarUiStore といいつつ共有してしまっている
	@observable currentTimePreview: number;
	@observable isSeeking: boolean;

	@observable showsAppearanceMenu: boolean;
	@observable showsDevtools: boolean;
	@observable showsAudioOptionPopover: boolean;

	@observable showsDisplayOptionPopover: boolean;
	@observable fitsToScreen!: boolean;
	// 以下のプロパティは assertInitialize() が resolve されるまでの値は保証されない
	@observable showsBackgroundImage: boolean;
	@observable showsBackgroundColor: boolean;
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
		this.showsBackgroundImage = null!;
		this.showsBackgroundColor = null!;
		this.showsGrid = null!;
		this.showsProfiler = null!;
		this.showsDesignGuideline = null!;
	}

	async assertInitialized(): Promise<void> {
		await storage.assertInitialized();
		runInAction(() => {
			this.fitsToScreen = storage.data.fitsToScreen;
			this.showsBackgroundImage = storage.data.showsBackgroundImage;
			this.showsBackgroundColor = storage.data.showsBackgroundColor;
			this.showsGrid = storage.data.showsGrid;
			this.showsProfiler = storage.data.showsProfiler;
			this.showsDesignGuideline = storage.data.showsDesignGuideline;
			this.showsDevtools = storage.data.showsDevtools;
		});
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
	setShowBackgroundColor(show: boolean): void {
		this.showsBackgroundColor = show;
		storage.put({ showsBackgroundColor: show });
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
