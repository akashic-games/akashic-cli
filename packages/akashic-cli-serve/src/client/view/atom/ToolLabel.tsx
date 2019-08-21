import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ToolLabel.css";

export interface ToolLabelProps {
	title?: string;
	hidden?: string;
	optionClass?: string;
}

@observer
export class ToolLabel extends React.Component<ToolLabelProps, {}> {
	render() {
		const { title, children, hidden, optionClass} = this.props;
		return <p className={[styles["tool-label"], hidden, optionClass].join(" ")} title={title}>
			{ children }
		</p>;
	}
}

