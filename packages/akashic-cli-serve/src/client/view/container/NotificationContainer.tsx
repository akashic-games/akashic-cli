import { observer } from "mobx-react";
import * as React from "react";
import type { Operator } from "../../operator/Operator";
import type { NotificationUiStore } from "../../store/NotificationUiStore";
import { Notification } from "../atom/Notification";

export interface NotificationContainerProps {
	operator: Operator;
	notificationUiStore: NotificationUiStore;
}

/**
 * NotificatonUiStore の表示・操作をするためのコンポーネント
 */
export const NotificationContainer = observer(class NotificationContainer extends React.Component<NotificationContainerProps, {}> {
	componentDidMount(): void {
		// このコンポーネントの責務とは少し違うが、適当な場所が無いのでここでエラーをハンドルする
		window.addEventListener("error", this.handleError);
		window.addEventListener("rejectionhandled", this.handleError);
	}

	componentWillUnmount(): void {
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

	private handleError = (ev: ErrorEvent | PromiseRejectionEvent): void => {
		const errMessage = ev instanceof ErrorEvent ? ev.error.message : ev.reason;
		this.props.operator.ui.showNotification(
			"error",
			"エラーが発生しました",
			errMessage,
			"Developer Tool などでエラー内容を確認の上修正してください。"
		);
	};

	private handleClickNotificationClose = (): void => {
		this.props.operator.ui.hideNotification();
	};
});

