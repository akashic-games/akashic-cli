import {action, observable} from "mobx";
import {storage} from "./storage";

export class StartupScreenUiStore {
	@observable selectedArgumentsName: string | null;
	@observable gameArgumentListWidth: number;
	@observable gameArgumentEditContent: string;
	@observable joinsAutomatically: boolean;

	constructor() {
		this.selectedArgumentsName = null;
		this.gameArgumentListWidth = storage.data.gameArgumentListWidth;
		this.gameArgumentEditContent = storage.data.gameArgumentEditContent;
		this.joinsAutomatically = storage.data.joinsAutomatically;
	}

	@action
	setSelectedArgumentsName(name: string | null): void {
		this.selectedArgumentsName = name;
		storage.put({ selectedArgumentsName: name });
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
