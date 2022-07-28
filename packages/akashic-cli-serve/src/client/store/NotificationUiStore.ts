import { action, observable } from "mobx";
import type { NotificationType } from "../common/types/Notification";

export class NotificationUiStore {
	@observable isActive: boolean;
	@observable type: NotificationType;
	@observable title: string;
	@observable name: string;
	@observable message: string;

	constructor() {
		this.isActive = false;
	}

	@action
	setActive(type: NotificationType, title: string, name: string, message: string): void {
		this.isActive = true;
		this.type = type;
		this.title = title;
		this.name = name;
		this.message = message;
	}

	@action
	setInactive(): void {
		this.isActive = false;
	}
}
