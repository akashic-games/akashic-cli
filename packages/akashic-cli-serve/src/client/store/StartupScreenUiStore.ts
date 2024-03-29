import {action, observable} from "mobx";
import {storage} from "./storage";

export class StartupScreenUiStore {
	@observable selectedArgumentName: string | null;
	@observable instanceArgumentListWidth: number;
	@observable instanceArgumentEditContent: string;
	@observable joinsAutomatically: boolean;

	constructor() {
		this.selectedArgumentName = null;
		this.instanceArgumentListWidth = storage.data.instanceArgumentListWidth;
		this.instanceArgumentEditContent = storage.data.instanceArgumentEditContent;
		this.joinsAutomatically = storage.data.joinsAutomatically;
	}

	@action
	setSelectedArgumentName(name: string | null, noPutStorage: boolean = false): void {
		this.selectedArgumentName = name;
		if (noPutStorage) return;
		storage.put({ selectedArgumentName: name });
	}

	@action
	setInstanceArgumentListWidth(w: number): void {
		this.instanceArgumentListWidth = w;
		storage.put({ instanceArgumentListWidth: w });
	}

	@action
	setInstanceArgumentEditContent(content: string, noPutStorage: boolean = false): void {
		this.instanceArgumentEditContent = content;
		if (noPutStorage) return;
		storage.put({ instanceArgumentEditContent: content });
	}

	@action
	setJoinsAutomatically(join: boolean): void {
		this.joinsAutomatically = join;
		storage.put({ joinsAutomatically: join });
	}
}
