import * as React from "react";
import { observer } from "mobx-react";
import { Notification } from "../atom/Notification";
import { NotificationStore } from "../../store/NotificationStore";

export interface NotificationContainerProps {
	notificationStore: NotificationStore;
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
			{...this.props.notificationStore}
		/>;
	}

	private handleError = (ev: ErrorEvent) => {
		this.props.notificationStore.show(
			"warn",
			"エラーが発生しました",
			ev.error.message,
			"Developer Tool などでエラー内容を確認の上修正してください。"
		);
	}

	private handleClickNotificationClose = () => {
		this.props.notificationStore.hide();
	}
}
