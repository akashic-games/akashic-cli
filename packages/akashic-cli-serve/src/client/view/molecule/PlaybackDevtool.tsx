import * as React from "react";
import { observer } from "mobx-react";
import { StartPointHeader } from "../../../common/types/StartPointHeader";
import { FlexScrollY } from "../atom/FlexScrollY";
// TODO コンポーネントごと削除
// import { ToolSnapshotButton } from "../atom/ToolSnapshotButton";
import { PlaybackOptionBar, PlaybackOptionBarProps } from "./PlaybackOptionBar";
import * as styles from "./PlaybackDevtool.css";
import { millisecondsToHms, timeValueToString } from "../../common/DateUtil";

export interface PlaybackDevtoolProps extends PlaybackOptionBarProps {
	startPointHeaders: StartPointHeader[];
	selectedStartPointHeaderIndex: number;
	onClickStartPoint: (index: number) => void;
	onDoubleClikStartPoint: (idnex: number) => void;
}

export const PlaybackDevtool = observer(function(props: PlaybackDevtoolProps) {
	const {
		startPointHeaders,
		selectedStartPointHeaderIndex,
		onClickStartPoint,
		onDoubleClikStartPoint
	} = props;

	return <div className={styles["playback-devtool"]}>
		<PlaybackOptionBar {...props} />
		<FlexScrollY>
			<table className={styles["startpoint-table"]}>
				<thead>
					<tr>
						<th>Age</th>
						<th>Time (milliseconds)</th>
						<th>Timestamp (time value)</th>
					</tr>
				</thead>
				<tbody>
					{
						startPointHeaders.map((sp, i) => {
							const startedAt = startPointHeaders[0].timestamp;
							const { frame, timestamp } = sp;
							const time = timestamp - startedAt;
							return <tr
								key={frame}
								className={(i === selectedStartPointHeaderIndex) ? styles["active"] : ""}
								onClick={() => onClickStartPoint(i)}
								onDoubleClick={() => onDoubleClikStartPoint(i)}
							>
								<td>{ frame }</td>
								<td>
									{ millisecondsToHms(time) }
									<span className={styles["rawvalue"]}>({ time })</span>
								</td>
								<td>
									{ timeValueToString(timestamp) }
									<span className={styles["rawvalue"]}>({ timestamp })</span>
								</td>
							</tr>;
						})
					}
				</tbody>
			</table>
		</FlexScrollY>
	</div>;
});