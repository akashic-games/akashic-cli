import { observer } from "mobx-react";
import * as React from "react";
import Modal from "react-modal";
import styles from "./ModalView.module.css";

interface ModalProps {
	isOpen: boolean;
	message: string;
}

/**
 * モーダルを表示するたコンポーネント
 */
export const ModalContainer = observer(class NotificationContainer extends React.Component<ModalProps, {}> {
	render(): React.ReactNode {
		return (
			// 現状、リロードを強いるため閉じるボタンが必要ない
			<Modal
				isOpen={this.props.isOpen}
				className={styles.modal}
				overlayClassName={styles.overlay}
			>
				<div className={styles["modal-content"]}>
					<p>{this.props.message}</p>
				</div>
			</Modal>
		);
	}
});

