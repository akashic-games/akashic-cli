import { observer } from "mobx-react";
import * as React from "react";
import type { NotificationType } from "../../store/NotificationType";
import styles from "./Notification.module.css";
import { ToolIconButton } from "./ToolIconButton";

export interface NotificationProps {
	isShown: boolean;
	type: NotificationType;
	title: string;
	name: string;
	message: string;
	referenceUrl?: string;
	referenceMessage?: string;
	onClickClose: () => void;
}

export const Notification = observer(class Notification extends React.Component<NotificationProps, {}> {

	render(): React.ReactNode {
		const hidden = this.props.isShown ? "" : styles["notification-hidden"];
		const icon = this.resolveMaterialIcon();
		return (
			<div className={[styles["notification-body-main"], styles[`notification-body-${this.props.type}`], hidden].join(" ")}>
				<div className={[styles["notification-title-main"], styles[`notification-title-${this.props.type}`]].join(" ")}>
					{
					icon ? <i className={[
						"material-icons",
						styles["notification-icon-main"],
						styles[`notification-icon-${this.props.type}`]].join(" ")}>
						{icon}
					</i> : null
					}
					{this.props.title}
				</div>
				<div className={[styles["notification-name-main"], styles[`notification-name-${this.props.type}`]].join(" ")}>
					{this.props.name}
				</div>
				<div className={[styles["notification-message-main"], styles[`notification-message-${this.props.type}`]].join(" ")}>
					{this.props.message}
				</div>
				<div className={[styles["notification-message-referenceUrl"], styles[`notification-message-${this.props.type}`]].join(" ")}
					style={{ display: !!this.props.referenceUrl ? "block" : "none" }}>
					<a href={this.props.referenceUrl} target="_blank" rel="noreferrer">{this.props.referenceMessage ?? "参考リンク"}</a>
				</div>
				<div className={styles["notification-close-btn"]}>
					<ToolIconButton
						icon="close"
						title="通知を閉じる"
						onClick={this.props.onClickClose}></ToolIconButton>
				</div>
			</div>);
	}

	private resolveMaterialIcon(): string | null {
		if (this.props.type === "error") {
			return "warning";
		}
		return null;
	}
});

