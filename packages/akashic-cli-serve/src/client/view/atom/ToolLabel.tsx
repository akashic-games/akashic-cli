import { observer } from "mobx-react";
import * as React from "react";
import * as styles from "./ToolLabel.module.css";

export interface ToolLabelProps {
	title?: string;
	emphasizeBorder?: boolean;
	children?: React.ReactNode;
}

export const ToolLabel = observer(class ToolLabel extends React.Component<ToolLabelProps, {}> {
	render(): JSX.Element {
		const { title, children } = this.props;
		return <p className={styles["tool-label"]} title={title}>
			{ children }
		</p>;
	}
});


