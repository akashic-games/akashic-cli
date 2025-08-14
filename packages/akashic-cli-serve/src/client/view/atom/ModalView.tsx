import { observer } from "mobx-react";
import * as React from "react";
import styles from "./ModalView.module.css";

interface DisconnectModalProps {
	isOpen: boolean;
	message: string;
}

/**
 * モーダルを表示するたコンポーネント
 */
export const DisconnectModal = observer(class NotificationContainer extends React.Component<DisconnectModalProps, {}> {
	render(): React.ReactNode {
		return this.props.isOpen ? 
		<div id="modal" className={styles.overlay}>
			<div className={styles["modal-content"]}>
				<p>{this.props.message}</p>
			</div>
		</div>
		: null;
	}
});
