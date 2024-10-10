import { observer } from "mobx-react";
import * as React from "react";
import type { StartPointHeader } from "../../../common/types/StartPointHeader";
import { millisecondsToHms, timeValueToString } from "../../common/DateUtil";
import { FlexScrollY } from "../atom/FlexScrollY";
import { ToolIconButton } from "../atom/ToolIconButton";
import * as styles from "./PlaybackDevtool.module.css";
import type { PlaybackOptionBarProps } from "./PlaybackOptionBar";
import { PlaybackOptionBar } from "./PlaybackOptionBar";

export interface PlaybackDevtoolProps extends PlaybackOptionBarProps {
	startPointHeaders: StartPointHeader[];
	onHoverStartPoint: (index: number, hover: boolean) => void;
	onJumpWithStartPoint: (index: number) => void;
	onDumpStartPoint: (index: number) => void;
}

export const PlaybackDevtool = observer(function(props: PlaybackDevtoolProps) {
	const {
		startPointHeaders,
		onHoverStartPoint,
		onJumpWithStartPoint,
		onDumpStartPoint
	} = props;

	return <div className={styles["playback-devtool"]}>
		<PlaybackOptionBar {...props} />
		<FlexScrollY>
			<table className={styles["startpoint-table"]}>
				<thead>
					<tr>
						<th className={styles.shrank}></th>
						<th>Age</th>
						<th>Time (milliseconds)</th>
						<th>Timestamp (time value)</th>
						<th className={styles.shrank}></th>
					</tr>
				</thead>
				<tbody>
					{
						startPointHeaders.map((sp, i) => {
							const startedAt = startPointHeaders[0].timestamp;
							const { frame, timestamp } = sp;
							const time = timestamp - startedAt;
							return <tr
								key={`${i}-${frame}-${timestamp}`}
								onMouseEnter={() => onHoverStartPoint(i, true)}
								onMouseLeave={() => onHoverStartPoint(i, false)}
								onDoubleClick={() => onJumpWithStartPoint(i)}
							>
								<td className={styles.shrank}>
									<ToolIconButton
										icon="play_arrow"
										size={18}
										title="このスナップショットでゲーム状態をリセットします"
										onClick={() => onJumpWithStartPoint(i)}
									>
									</ToolIconButton>
								</td>
								<td>{ frame }</td>
								<td>
									{ millisecondsToHms(time) }
									<span className={styles["raw-value"]}>({ time.toFixed(3) })</span>
								</td>
								<td>
									{ timeValueToString(timestamp) }
									<span className={styles["raw-value"]}>({ timestamp.toFixed(3) })</span>
								</td>
								<td className={styles.shrank}>
									<ToolIconButton
										className="external-ref_button_dump-snapshot"
										icon="web_asset"
										size={18}
										title={"このスナップショットをコンソールにダンプします"}
										onClick={() => onDumpStartPoint(i)}
									>
										console.log()
									</ToolIconButton>
								</td>
							</tr>;
						})
					}
				</tbody>
			</table>
		</FlexScrollY>
	</div>;
});
