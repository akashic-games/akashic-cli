import { observer } from "mobx-react";
import * as React from "react";
import styles from "./DevtoolPageSelector.module.css";

export interface DevtoolPageSelectorProps {
	items: string[];
	activeIndex: number;
	onChangeActive: (idx: number) => void;
}

export const DevtoolPageSelector = observer(function DevtoolPageSelector(props: DevtoolPageSelectorProps) {
	return (
		<ul className={styles["page-selector-list"]}>
			{
				props.items.map((item, i) => (
					<li
						key={item}
						className={i === props.activeIndex ? styles.active : ""}
						title={item}
						onClick={() => props.onChangeActive(i)}
					>
						{ item }
					</li>
				))
			}
		</ul>
	);
});
