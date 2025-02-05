import { observer } from "mobx-react";
import * as React from "react";
import styles from "./DevtoolSelectorBar.module.css";

export interface DevtoolSelectorBarItem {
	name: string;
	active?: boolean;
	warning?: boolean;
	onClick?: () => void;
}

export interface DevtoolSelectorBarProps {
	items: DevtoolSelectorBarItem[];
}

export const DevtoolSelectorBar = observer(class DevtoolSelectorBar extends React.Component<DevtoolSelectorBarProps, {}> {
	render(): React.ReactNode {
		return <div className={styles["devtool-selector-bar"]}>
			{
				this.props.items.map(item => (
					<div key={item.name}
						className={styles.item + (item.active ? " " + styles.active : "")}
						onClick={item.onClick}>
						{ item.name }
						{ item.warning ? <span className={"material-icons " + styles.icon}>warning</span> : null }
					</div>
				))
			}
		</div>;
	}
});

