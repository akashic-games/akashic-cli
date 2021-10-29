import { observer } from "mobx-react";
import * as React from "react";
import * as styles from "./PlayerInfoResolverDialog.css";

export interface PlayerInfoResolverDialogProps {
	remainingSeconds: number;
	name: string;
	guestName: string;
	onClick: (accepted: boolean) => void;
}

@observer
export class PlayerInfoResolverDialog extends React.Component<PlayerInfoResolverDialogProps, {}> {
	render(): React.ReactNode {
		const { remainingSeconds, onClick, name, guestName } = this.props;
		return <div className={styles.dialog}>
			<p className={styles["dialog-msg"]}>このコンテンツは名前を利用します。どちらを使いますか？(残り時間：{ remainingSeconds })</p>
			<div className={styles["button-column"]}>
				<button
					className={styles.button + " external-ref_button_player-info-accept"}
					onClick={() => onClick(true)}>{name} (プレイヤー名)
				</button>
				<button
					className={styles.button + " external-ref_button_player-info-reject"}
					onClick={() => onClick(false)}
				>
					{guestName}
				</button>
			</div>
		</div>;
	}
}
