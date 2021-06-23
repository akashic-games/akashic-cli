import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ToolLabelButton.css";

export interface ToolSnapshotButtonProps {
	className?: string;
	title?: string;
	onClick?: (frame: string) => void;
}

@observer
export class ToolSnapshotButton extends React.Component<ToolSnapshotButtonProps, {}> {
	render() {
		const { className, title, onClick, children } = this.props;
		return <p className={styles["tool-snapshot-button"] + " " + className} title={title} onClick={() => {onClick()}}>
			{ children }
		</p>;
	}
}
