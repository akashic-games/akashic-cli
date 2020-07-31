import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ToolLabelButton.css";

export interface ToolLabelButtonProps {
	className?: string;
	title?: string;
	onClick?: () => void;
}

@observer
export class ToolLabelButton extends React.Component<ToolLabelButtonProps, {}> {
	render() {
		const { className, title, onClick, children } = this.props;
		return <p className={styles["tool-label-button"] + " " + className} title={title} onClick={onClick}>
			{ children }
		</p>;
	}
}
