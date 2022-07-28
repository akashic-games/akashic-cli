export type NotificationType = "error";

export interface Notification {
	type: NotificationType;
	title: string;
	detail: string;
	message: string;
};
