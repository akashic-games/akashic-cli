import { observer } from "mobx-react";
import * as React from "react";
import styles from "./DevtoolPageSelector.module.css";

export interface DevtoolPageSelectorItem {
	label: string;
	disabled?: boolean;
}

export interface DevtoolPageSelectorProps {
	items: DevtoolPageSelectorItem[];
	activeIndex: number;
	onChangeActive: (idx: number) => void;
}

export const DevtoolPageSelector = observer(function DevtoolPageSelector(props: DevtoolPageSelectorProps) {
	return (
		<ul className={styles["page-selector-list"]}>
			{
				props.items.map((item, i) => (
					<li
						key={item.label}
						className={
							item.disabled ? styles.disabled : (i === props.activeIndex ? styles.active : "")
						}
						title={item.label}
						onClick={() => {
							if (item.disabled) return;
							props.onChangeActive(i);
						}}
					>
						{ item.label }
					</li>
				))
			}
		</ul>
	);
});
