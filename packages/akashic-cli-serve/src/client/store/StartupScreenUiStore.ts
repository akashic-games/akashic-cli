import {action, observable} from "mobx";

export class StartupScreenUiStore {
	@observable showsStartupArgumentList: boolean;
	@observable startupArgumentListWidth: number;
	@observable startupArgumentEditContent: string;
	@observable joinsToPlay: boolean;

	constructor() {
		this.showsStartupArgumentList = true;
		this.startupArgumentListWidth = 150;
		this.startupArgumentEditContent = "";
		this.joinsToPlay = false;
	}

	@action
	toggleShowStartupArgumentList(show: boolean): void {
		this.showsStartupArgumentList = show;
	}

	@action
	setStartupArgumentListWidth(w: number): void {
		this.startupArgumentListWidth = w;
	}

	@action
	setStartupArgumentEditContent(content: string): void {
		this.startupArgumentEditContent = content;
	}

	@action
	setJoinsToPlay(join: boolean): void {
		this.joinsToPlay = join;
	}
}
