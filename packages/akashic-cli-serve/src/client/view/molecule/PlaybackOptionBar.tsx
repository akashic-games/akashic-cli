import { observer } from "mobx-react";
import * as React from "react";
import type { StartPointHeader } from "../../../common/types/StartPointHeader";
import { millisecondsToHms } from "../../common/DateUtil";
import { ToolCheckbox } from "../atom/ToolCheckbox";
import { ToolIconButton } from "../atom/ToolIconButton";
import { ToolProgressBar } from "../atom/ToolProgressBar";
import * as styles from "./PlaybackOptionBar.module.css";

export interface PlaybackOptionBarProps {
	currentTime: number;
	duration: number;
	resetTime: number;
	isPaused: boolean;
	isProgressActive: boolean;
	isReplay: boolean;
	isActiveExists: boolean;
	isActivePaused: boolean;
	isForceResetOnSeek: boolean;
	startPointHeaders: StartPointHeader[];
	focusedStartPointHeaderIndex: number;
	onClickPauseActive: (pause: boolean) => void;
	onClickSavePlaylog: () => void;
	onClickForceResetOnSeek: (reset: boolean) => void;
	onProgressChange: (val: number) => void;
	onProgressCommit: (val: number) => void;
	onClickPause: (pause: boolean) => void;
	onClickFastForward: () => void;
}

export const PlaybackOptionBar = observer(function (props: PlaybackOptionBarProps) {
	const {
		currentTime,
		duration,
		resetTime,
		isPaused,
		isProgressActive,
		isReplay,
		isActiveExists,
		isActivePaused,
		isForceResetOnSeek,
		startPointHeaders,
		focusedStartPointHeaderIndex,
		onClickPauseActive,
		onClickSavePlaylog,
		onClickForceResetOnSeek,
		onProgressChange,
		onProgressCommit,
		onClickPause,
		onClickFastForward,
	} = props;

	const startedAt = startPointHeaders[0]?.timestamp;
	const startPoint = startPointHeaders[focusedStartPointHeaderIndex];
	const startPointTime = (startedAt != null && startPoint != null) ? startPoint.timestamp - startedAt : undefined;

	return <div className={styles["replay-option-bar"]}>
		<div className={styles.row}>
			<ToolIconButton
				className="external-ref_button_active-pause_devtool"
				icon="pause_circle_filled"
				title={`アクティブインスタンスをポーズ${isActivePaused ? "解除" : ""}\r\r`
								+ "ポーズ中は全インスタンスの進行が停止します。"}
				pushed={isActivePaused}
				disabled={!isActiveExists}
				pushedIcon="play_circle_filled"
				size={18}
				onClick={onClickPauseActive}
			>
				{isActivePaused ? "Resume" : "Pause"} active
			</ToolIconButton>
			<ToolIconButton
				className="external-ref_button_download-playlog_devtool"
				icon="file_download"
				size={18}
				title={"現在のプレイのリプレイ情報(playlog)をダウンロードします。"}
				onClick={onClickSavePlaylog}
			>
				Save playlog
			</ToolIconButton>
			<div className={styles.sep} />
			<ToolCheckbox
				checked={isForceResetOnSeek}
				label="Force reset on seek"
				onChange={onClickForceResetOnSeek} />
		</div>

		<div className={styles.row}>
			<ToolIconButton
				className="external-ref_button_pause_devtool"
				icon="pause" onClick={onClickPause}
				size={20}
				title={"このインスタンスをポーズ\r\rポーズ中も他インスタンスは進行します。"}
				pushed={isPaused} pushedIcon="play_arrow" />
			<ToolIconButton
				className="external-ref_button_real-time-execution"
				icon="skip_next" onClick={onClickFastForward}
				size={20}
				title={"リアルタイム実行に戻る\r\rリプレイ再生をやめ、リアルタイム実行(他インスタンスと同期)します。"}
				disabled={!isReplay} />
			<div className={styles.progress}>
				<ToolProgressBar
					max={duration}
					value={currentTime}
					subValue={resetTime}
					markerValue={startPointTime}
					active={isProgressActive}
					onChange={onProgressChange}
					onCommit={onProgressCommit} />
			</div>
			<p className={styles.time}>
				{
					isReplay ?
						`${millisecondsToHms(currentTime)} / ${millisecondsToHms(duration)}` :
						"" + millisecondsToHms(duration)
				}
			</p>
		</div>
	</div>;
});
