import {action, observable} from "mobx";
import {NotificationType} from "./NotificationType";

export class NotificationUiStore {
	@observable isShown: boolean;
	@observable type: NotificationType;
	@observable title: string;
	@observable name: string;
	@observable message: string;

	constructor() {
		this.isShown = false;
	}

	@action
	show(type: NotificationType, title: string, name: string, message: string): void {
		this.isShown = true;
		this.type = type;
		this.title = title;
		this.name = name;
		this.message = message;
	}

	@action
	hide(): void {
		this.isShown = false;
	}
}
