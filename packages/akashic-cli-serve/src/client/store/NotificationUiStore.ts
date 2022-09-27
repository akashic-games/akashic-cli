import { action, observable } from "mobx";
import type { NotificationType } from "./NotificationType";

export interface NotificationActiveParameterObject {
	type: NotificationType;
	title: string;
	name: string;
	message: string;
	referenceUrl?: string;
	referenceMessage?: string;
}

export class NotificationUiStore {
	@observable isActive: boolean;
	@observable type: NotificationType;
	@observable title: string;
	@observable name: string;
	@observable message: string;
	@observable referenceUrl?: string;
	@observable referenceMessage?: string;

	constructor() {
		this.isActive = false;
	}

	@action
	setActive(params: NotificationActiveParameterObject): void {
		this.isActive = true;
		this.type = params.type;
		this.title = params.title;
		this.name = params.name;
		this.message = params.message;
		this.referenceUrl = params.referenceUrl;
		this.referenceMessage = params.referenceMessage;
	}

	@action
	setInactive(): void {
		this.isActive = false;
	}
}
