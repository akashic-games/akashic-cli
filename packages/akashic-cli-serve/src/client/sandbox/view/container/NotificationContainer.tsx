import { observer } from "mobx-react";
import * as React from "react";
import type { NotificationUiStore } from "../../../store/NotificationUiStore";
import { Notification } from "../../../view/atom/Notification";
import type { UiOperator } from "../../operator/UiOperator";

export interface NotificationContainerProps {
	operator: UiOperator;
	notificationUiStore: NotificationUiStore;
}

/**
 * NotificationUiStore の表示・操作をするためのコンポーネント
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
		this.props.operator.showNotification(
			"error",
			"エラーが発生しました",
			errMessage,
			"Developer Tool などでエラー内容を確認の上修正してください。"
		);
	};

	private handleClickNotificationClose = (): void => {
		this.props.operator.hideNotification();
	};
});

