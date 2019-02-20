import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ToolToggleLabel.css";

export interface ToolToggleLabelProps {
	isPushed: boolean;
	onToggle: (nextValue: boolean) => void;
}

@observer
export class ToolToggleLabel extends React.Component<ToolToggleLabelProps, {}> {
	render(): React.ReactNode {
		const optClassName = this.props.isPushed ? (" " + styles["pushed"]) : "";
		return <div className={styles["tool-toggle-label"] + optClassName} onClick={this._onClick}>
			{this.props.children}
		</div>;
	}

	private _onClick = (): void => {
		this.props.onToggle(!this.props.isPushed);
	}
}
