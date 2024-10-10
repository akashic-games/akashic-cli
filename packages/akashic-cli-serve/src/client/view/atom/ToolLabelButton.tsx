import { observer } from "mobx-react";
import * as React from "react";
import * as styles from "./ToolLabelButton.module.css";

export interface ToolLabelButtonProps {
	className?: string;
	title?: string;
	children?: React.ReactNode;
	onClick?: () => void;
}

export const ToolLabelButton = observer(class ToolLabelButton extends React.Component<ToolLabelButtonProps, {}> {
	render(): JSX.Element {
		const { className, title, onClick, children } = this.props;
		return <p className={styles["tool-label-button"] + " " + className} title={title} onClick={onClick}>
			{ children }
		</p>;
	}
});

