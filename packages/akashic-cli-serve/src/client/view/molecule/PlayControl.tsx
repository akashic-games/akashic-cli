import * as React from "react";
import { observer } from "mobx-react";
import { ToolIconButton } from "../atom/ToolIconButton";
import { ToolControlGroup } from "../atom/ToolControlGroup";

export interface PlayControlPropsData {
	playbackRate: number;
	isActivePausing: boolean;
	onClickReset?: () => void;
	onClickActivePause?: (toPause: boolean) => void;
	onClickAddInstance?: () => void;
}

export interface PlayControlProps {
	makeProps: () => PlayControlPropsData;
}

@observer
export class PlayControl extends React.Component<PlayControlProps, {}> {
	render(): React.ReactNode {
		const props = this.props.makeProps();
		return <ToolControlGroup label="Play">
			<ToolIconButton
				icon="power_settings_new"
				title={"新規プレイ\r\r新しいプレイを作成し、現在の全インスタンスから接続します。"}
				onClick={props.onClickReset} />
			<ToolIconButton
				icon="pause_circle_filled"
				title={`アクティブインスタンスをポーズ${props.isActivePausing ? "解除" : ""}\r\r`
				        + `ポーズ中は全インスタンスの進行が停止します。`}
				pushed={props.isActivePausing}
				pushedIcon="play_circle_filled"
				onClick={props.onClickActivePause} />
			<ToolIconButton
				icon="group_add"
				title={"インスタンスを追加\r\r新しいタブ・ウィンドウでこのプレイに接続するインスタンスを追加します。"}
				onClick={props.onClickAddInstance} />
			{/* // 未実装
			<ToolLabelButton title="Playback Rate (Active)" onClick={props.onClickActivePlaybackRate}>
				x{"" + props.playbackRate}
			</ToolLabelButton>
			*/}
		</ToolControlGroup>;
	}
}
