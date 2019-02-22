import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ToolLabel.css";

export interface ToolLabelProps {
	title?: string;
}

@observer
export class ToolLabel extends React.Component<ToolLabelProps, {}> {
	render() {
		const { title, children } = this.props;
		return <p className={styles["tool-label"]} title={title}>
			{ children }
		</p>;
	}
}

