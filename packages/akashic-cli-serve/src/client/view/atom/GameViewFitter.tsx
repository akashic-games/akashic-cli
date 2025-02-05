import * as React from "react";
import type { ContentRect } from "react-measure";
import Measure from "react-measure";
import type { ScreenSize } from "../../common/types/ScreenSize";
import styles from "./GameViewFitter.module.css";

export interface GameViewFitterProps {
	intrinsicSize: ScreenSize;
	setSize: (size: ScreenSize) => void;
	children?: React.ReactNode;
}

export function GameViewFitter(props: GameViewFitterProps): React.ReactElement<GameViewFitterProps> {
	const { intrinsicSize, setSize, children } = props;
	const [pos, setPos] = React.useState({ x: 0, y: 0 });

	const onResize = React.useCallback((r: ContentRect) => {
		const outer = { width: r.client?.width!, height: r.client?.height! };
		const inner = intrinsicSize;
		const scale = Math.min(outer.width / inner.width, outer.height / inner.height);
		const width = Math.floor(inner.width * scale);
		const height = Math.floor(inner.height * scale);
		setSize({ width, height });
		setPos({
			x: Math.floor((outer.width - width) / 2),
			y: Math.floor((outer.height - height) / 2)
		});
	}, [intrinsicSize, setSize]);

	return (
		<Measure client onResize={onResize}>
			{({ measureRef }) => (
				<div ref={measureRef} className={styles["game-view-fitter"]}>
					<div className={styles.offsetter} style={{ left: pos.x, top: pos.y }}>
						{ children }
					</div>
				</div>
			)}
		</Measure>
	);
}
