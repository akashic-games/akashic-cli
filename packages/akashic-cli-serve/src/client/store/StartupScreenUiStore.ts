import {action, observable} from "mobx";
import {storage} from "./storage";

export class StartupScreenUiStore {
	@observable showsGameArgumentList: boolean;
	@observable gameArgumentListWidth: number;
	@observable gameArgumentEditContent: string;
	@observable joinsAutomatically: boolean;

	constructor() {
		this.showsGameArgumentList = storage.data.showsGameArgumentList;
		this.gameArgumentListWidth = storage.data.gameArgumentListWidth;
		this.gameArgumentEditContent = storage.data.gameArgumentEditContent;
		this.joinsAutomatically = storage.data.joinsAutomatically;
	}

	@action
	toggleShowGameArgumentList(show: boolean): void {
		this.showsGameArgumentList = show;
		storage.put({ showsGameArgumentList: show });
	}

	@action
	setGameArgumentListWidth(w: number): void {
		this.gameArgumentListWidth = w;
		storage.put({ gameArgumentListWidth: w });
	}

	@action
	setGameArgumentEditContent(content: string): void {
		this.gameArgumentEditContent = content;
		storage.put({ gameArgumentEditContent: content });
	}

	@action
	setJoinsAutomatically(join: boolean): void {
		this.joinsAutomatically = join;
		storage.put({ joinsAutomatically: join });
	}
}
