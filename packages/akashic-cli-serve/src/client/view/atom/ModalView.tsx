import { observer } from "mobx-react";
import * as React from "react";
import Modal from "react-modal";
import styles from "./ModalView.module.css";

// 文言は固定にしているが、必要があれば props で受け取るようにする
// 現状、リロードを強いるため閉じるボタンが必要ない
interface ModalProps {
	isOpen: boolean;
}

/**
 * モーダルを表示するたコンポーネント
 */
export const ModalContainer = observer(class NotificationContainer extends React.Component<ModalProps, {}> {
	render(): React.ReactNode {
		return (
			<Modal
				isOpen={this.props.isOpen}
				className={styles.modal}
				overlayClassName={styles.overlay}
			>
				<div className={styles["modal-content"]}>
					<p>接続が切れました。serve を再起動してブラウザをリロードしてください。</p>
				</div>
			</Modal>
		);
	}
});

