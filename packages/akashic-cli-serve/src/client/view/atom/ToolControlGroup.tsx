import { observer } from "mobx-react";
import * as React from "react";
import * as styles from "./ToolControlGroup.css";

export interface ToolControlGroupProps {
	label: string;
	children?: React.ReactNode;
}

@observer
export class ToolControlGroup extends React.Component<ToolControlGroupProps, {}> {
	render(): React.ReactNode {
		const { label, children } = this.props;
		return <div className={styles["tool-control-group"]}>
			<p className={styles.label}>{label}</p>
			{ children }
		</div>;
	}
}
