import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./DevtoolSelectorBar.css";

export interface DevtoolSelectorBarItem {
	name: string;
	active?: boolean;
	warning?: boolean;
	onClick?: () => void;
}

export interface DevtoolSelectorBarProps {
	items: DevtoolSelectorBarItem[];
}

@observer
export class DevtoolSelectorBar extends React.Component<DevtoolSelectorBarProps, {}> {
	render(): React.ReactNode {
		return <div className={styles["devtool-selector-bar"]}>
			{
				this.props.items.map(item => (
					<div key={item.name}
					     className={styles["item"] + (item.active ? " " + styles["active"] : "")}
					     onClick={item.onClick}>
						{ item.name }
						{ item.warning ? <span className={"material-icons " + styles["icon"]}>warning</span> : null }
					</div>
				))
			}
		</div>;
	}
}
