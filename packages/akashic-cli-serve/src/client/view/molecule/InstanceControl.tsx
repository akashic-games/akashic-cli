import * as React from "react";
import { observer } from "mobx-react";
import { millisecondsToHms } from "../../common/DateUtil";
import { ToolIconButton } from "../atom/ToolIconButton";
import { ToolProgressBar } from "../atom/ToolProgressBar";
import { ToolControlGroup } from "../atom/ToolControlGroup";
import * as styles from "./InstanceControl.css";

export interface InstanceControlPropsData {
	currentTime: number;
	duration: number;
	isPaused: boolean;
	isProgressActive?: boolean;
	enableFastForward?: boolean;
	onProgressChange?: (val: number) => void;
	onProgressCommit?: (val: number) => void;
	onClickPause?: (pause: boolean) => void;
	onClickFastForward?: () => void;
}

export interface InstanceControlProps {
	makeProps: () => InstanceControlPropsData;
}

@observer
export class InstanceControl extends React.Component<InstanceControlProps, {}> {
	render(): React.ReactNode {
		const props = this.props.makeProps();
		const { currentTime, duration } = props;
		return <ToolControlGroup label="Instance">
			<ToolIconButton
				className="external-ref_button_pause"
				icon="pause" onClick={props.onClickPause}
				title={"このインスタンスをポーズ\r\rポーズ中も他インスタンスは進行します。"}
				pushed={props.isPaused} pushedIcon="play_arrow" />
			<ToolIconButton
				className="external-ref_button_real-time-execution"
				icon="skip_next" onClick={props.onClickFastForward}
				title={"リアルタイム実行に戻る\r\rリプレイ再生をやめ、リアルタイム実行(他インスタンスと同期)します。"}
				disabled={!props.enableFastForward} />
			<ToolProgressBar
				width={200}
				max={duration} value={currentTime}
				active={props.isProgressActive}
				showsKnob={true}
				onChange={props.onProgressChange}
				onCommit={props.onProgressCommit} />
			<p className={styles["time"]}>
				{
					props.enableFastForward ?
						`${millisecondsToHms(currentTime)} / ${millisecondsToHms(duration)}` :
						"" + millisecondsToHms(duration)
				}
			</p>
		</ToolControlGroup>;
	}
}
