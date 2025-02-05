import { observer } from "mobx-react";
import * as React from "react";
import type { PlayAudioStateSummary } from "../../../common/types/PlayAudioState";
import { Popover } from "../atom/Popover";
import type { ToolChoiceButtonItem } from "../atom/ToolChoiceButton";
import { ToolChoiceButton } from "../atom/ToolChoiceButton";
import { ToolIconButton } from "../atom/ToolIconButton";
import styles from "./AudioOptionControl.module.css";

export interface AudioOptionControlPropsData {
	showsAudioOptionPopover: boolean;
	audioStateSummary?: PlayAudioStateSummary;
	onClickAudioOptionPopover: (show: boolean) => void;
	onClickMuteAll: () => void;
	onClickSolo: () => void;
	onClickMuteNone: () => void;
}

export interface AudioOptionControlProps {
	makeProps: () => AudioOptionControlPropsData;
}

const muteButtonItems: ToolChoiceButtonItem[] = [
	{
		label: "All",
		title: "Mute all instances"
	},
	{
		label: "Solo",
		title: "Mute all instances and unmute this"
	},
	{
		label: "None",
		title: "Unmute all instances"
	},
];

export const AudioOptionControl = observer(function AudioOptionControl(props: AudioOptionControlProps) {
	const {
		showsAudioOptionPopover,
		audioStateSummary,
		onClickAudioOptionPopover,
		onClickMuteAll,
		onClickSolo,
		onClickMuteNone
	} = props.makeProps();
	const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;

	const handleClickMuteChoice = React.useCallback((index: number) => {
		const handlers = [onClickMuteAll, onClickSolo, onClickMuteNone]; // muteButtonItems に対応
		return handlers[index]!();
	}, [onClickMuteAll, onClickSolo, onClickMuteNone]);

	// muteButtonItems の順序に対応
	const muteChoicePushedIndex =
		(audioStateSummary === "all-player-muted") ? 0 :
		(audioStateSummary === "only-this-player-unmuted") ? 1 :
		(audioStateSummary === "all-player-unmuted") ? 2 : null;
	const isMuted = (
		audioStateSummary === "all-player-muted" ||
		audioStateSummary === "only-other-player-unmuted"
	);

	return <div ref={ref} style={{ position: "relative" }}>
		<ToolIconButton
			className="external-ref_button_audio-option"
			icon={isMuted ? "volume_mute" : "volume_up"}
			title={"オーディオオプション"}
			pushed={showsAudioOptionPopover}
			onClick={onClickAudioOptionPopover} />
		<Popover
			className={styles.popover}
			shows={showsAudioOptionPopover}
			caption={"Audio Options"}
			onChangeShows={onClickAudioOptionPopover}
			outsideRef={ref}
		>
			<div className={styles.mutebar}>
				<span className={styles["mutebar-label"]}>Mute:</span>
				<ToolChoiceButton
					items={muteButtonItems}
					pushedIndex={muteChoicePushedIndex}
					onClick={handleClickMuteChoice} />
			</div>
		</Popover>
	</div>;
});
