import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ToolLabel.css";

export interface ToolLabelProps {
	title?: string;
	emphasizeBorder?: boolean;
}

@observer
export class ToolLabel extends React.Component<ToolLabelProps, {}> {
	render() {
		const { title, children, emphasizeBorder} = this.props;
		const borderStyle = emphasizeBorder ? "border-emphasize" : "";
		return <p className={[styles["tool-label"], styles[borderStyle]].join(" ")} title={title}>
			{ children }
		</p>;
	}
}

