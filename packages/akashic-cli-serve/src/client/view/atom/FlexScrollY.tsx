import * as React from "react";
import styles from "./FlexScrollY.module.css";

export interface FlexScrollYProps {
	children?: React.ReactNode;
}

export function FlexScrollY(props: FlexScrollYProps): React.ReactElement<FlexScrollYProps> {
	return <div className={styles["flex-scroll-y"]}>
		<div className={styles.outer}>
			<div className={styles.inner}>
				{ props.children }
			</div>
		</div>
	</div>;
}
