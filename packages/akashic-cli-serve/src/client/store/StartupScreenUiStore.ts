import {action, observable} from "mobx";
import {storage} from "./storage";

export class StartupScreenUiStore {
	@observable showsStartupArgumentList: boolean;
	@observable startupArgumentListWidth: number;
	@observable startupArgumentEditContent: string;
	@observable joinsToPlay: boolean;

	constructor() {
		this.showsStartupArgumentList = storage.data.showsStartupArgumentList;
		this.startupArgumentListWidth = storage.data.startupArgumentListWidth;
		this.startupArgumentEditContent = storage.data.startupArgumentEditContent;
		this.joinsToPlay = storage.data.joinsToPlay;
	}

	@action
	toggleShowStartupArgumentList(show: boolean): void {
		this.showsStartupArgumentList = show;
		storage.put({ showsStartupArgumentList: show });
	}

	@action
	setStartupArgumentListWidth(w: number): void {
		this.startupArgumentListWidth = w;
		storage.put({ startupArgumentListWidth: w });
	}

	@action
	setStartupArgumentEditContent(content: string): void {
		this.startupArgumentEditContent = content;
		storage.put({ startupArgumentEditContent: content });
	}

	@action
	setJoinsToPlay(join: boolean): void {
		this.joinsToPlay = join;
		storage.put({ joinsToPlay: join });
	}
}
