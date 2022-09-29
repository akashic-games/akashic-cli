import type { SandboxConfiguration } from "@akashic/sandbox-configuration";
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
		this.fitsToScreen = storage.data.fitsToScreen;
		this.showsBackgroundImage = storage.data.showsBackgroundImage;
		this.showsBackgroundColor = storage.data.showsBackgroundColor;
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

	setSandboxConfigValues(sandboxConfg: SandboxConfiguration): void {
		const displayOption = sandboxConfg.displayOption;
		let fitsToScreen = storage.data.fitsToScreen;
		let showsBackgroundImage = storage.data.showsBackgroundImage;
		let showsBackgroundColor = storage.data.showsBackgroundColor;
		let showsGrid = storage.data.showsGrid;
		let showsProfiler = storage.data.showsProfiler;
		let showsDesignGuideline = storage.data.showsDesignGuideline;

		if (displayOption) {
			if (typeof fitsToScreen === "undefined" && displayOption.fitsToScreen) {
				fitsToScreen = displayOption.fitsToScreen;
			}
			if (typeof showsBackgroundImage === "undefined" && displayOption.backgroundImage) {
				showsBackgroundImage = !!displayOption.backgroundImage;
			}
			if (typeof showsBackgroundColor === "undefined" && displayOption.backgroundColor) {
				showsBackgroundColor = !!displayOption.backgroundColor;
			}
			if (typeof showsGrid === "undefined" && displayOption.showsGrid) {
				showsGrid = displayOption.showsGrid;
			}
			if (typeof showsProfiler === "undefined" && displayOption.showsProfiler) {
				showsProfiler = displayOption.showsProfiler;
			}
			if (typeof showsDesignGuideline === "undefined" && displayOption.showsDesignGuideline) {
				showsDesignGuideline = displayOption.showsDesignGuideline;
			}
		}
		this.setFitsToScreen(fitsToScreen ?? false);
		this.setShowBackgroundImage(showsBackgroundImage ?? false);
		this.setShowBackgroundColor(showsBackgroundColor ?? false);
		this.setShowGrid(showsGrid ?? false);
		this.setShowsProfiler(showsProfiler ?? false);
		this.setShowDesignGuideline(showsDesignGuideline ?? false);
	}
}
