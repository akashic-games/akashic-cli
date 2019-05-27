import {action, observable} from "mobx";
import {storage} from "./storage";

export interface ELikeListItem {
	id: number;
	className: string;
	children: ELikeListItem[];
}

export class DevtoolUiStore {
	@observable height: number;
	@observable activeDevtool: string;
	@observable showsEventList: boolean;
	@observable eventListWidth: number;
	@observable eventEditContent: string;
	@observable entityList: ELikeListItem[];

	constructor() {
		this.height = storage.data.devtoolsHeight;
		this.activeDevtool = storage.data.activeDevtool;
		this.showsEventList = storage.data.showsEventList;
		this.eventListWidth = storage.data.eventListWidth;
		this.eventEditContent = storage.data.eventEditContent;
		this.entityList = [];
	}

	@action
	setHeight(h: number): void {
		this.height = h;
		storage.put({ devtoolsHeight: h });
	}

	@action
	setActiveDevtool(type: string): void {
		this.activeDevtool = type;
		storage.put({ activeDevtool: type });
	}

	@action
	toggleShowEventList(show: boolean): void {
		this.showsEventList = show;
		storage.put({ showsEventList: show });
	}

	@action
	setEventListWidth(w: number): void {
		this.eventListWidth = w;
		storage.put({ eventListWidth: w });
	}

	@action
	setEventEditContent(content: string): void {
		this.eventEditContent = content;
		storage.put({ eventEditContent: content });
	}

	@action
	setEntityList(entityList: ELikeListItem[]): void {
		this.entityList = entityList;
	}
}
