import * as React from "react";
import { observer } from "mobx-react";

export interface ConfirmDialogProps {
	remainingSeconds: number;
	onClick?: (accepted: boolean) => void;
}

@observer
export class ConfirmDialog extends React.Component<ConfirmDialogProps, {}> {
	render(): React.ReactNode {
		// TODO: cssを入れてダイアログっぽい見た目にする
		return <div>
			<p>プレイヤー名をゲーム上で表示しますか？(残り時間：{ this.props.remainingSeconds })</p>
			<button onClick={ () => this.props.onClick(true) }>Accept</button>
			<button onClick={ () => this.props.onClick(false) }>Reject</button>
		</div>;
	}
}
