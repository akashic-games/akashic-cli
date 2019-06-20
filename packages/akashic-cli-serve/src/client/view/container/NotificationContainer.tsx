import * as React from "react";
import { observer } from "mobx-react";
import { Notification } from "../atom/Notification";
import { Operator } from "../../operator/Operator";
import { NotificationUiStore } from "../../store/NotificationUiStore";

export interface NotificationContainerProps {
	operator: Operator;
	notificationUiStore: NotificationUiStore;
}

@observer
export class NotificationContainer extends React.Component<NotificationContainerProps, {}> {
	componentDidMount() {
		window.addEventListener("error", this.handleError);
		window.addEventListener("rejectionhandled", this.handleError);
	}

	componentWillUnmount() {
		window.removeEventListener("error", this.handleError);
		window.removeEventListener("rejectionhandled", this.handleError);
	}

	render(): React.ReactNode {
		return <Notification
			onClickClose={this.handleClickNotificationClose}
			isShown={this.props.notificationUiStore.isActive}
			{...this.props.notificationUiStore}
		/>;
	}

	private handleError = (ev: ErrorEvent) => {
		this.props.operator.ui.showNotification(
			"warn",
			"エラーが発生しました",
			ev.error.message,
			"Developer Tool などでエラー内容を確認の上修正してください。"
		);
	}

	private handleClickNotificationClose = () => {
		this.props.operator.ui.hideNotification();
	}
}
