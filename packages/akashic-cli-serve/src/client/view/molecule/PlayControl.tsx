import * as React from "react";
import { observer } from "mobx-react";
import { ToolIconButton } from "../atom/ToolIconButton";
import { ToolControlGroup } from "../atom/ToolControlGroup";

export interface PlayControlPropsData {
	playbackRate: number;
	isActivePausing: boolean;
	disablesFrameAdd?: boolean;
	onClickReset?: () => void;
	onClickActivePause?: (toPause: boolean) => void;
	onClickAddInstance?: () => void;
	onClickAddFrame?: () => void;
	onClickStep?: () => void;
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
				className="external-ref_button_new-play"
				icon="power_settings_new"
				title={"新規プレイ\r\r新しいプレイを作成し、現在の全インスタンスから接続します。"}
				onClick={props.onClickReset} />
			<ToolIconButton
				className="external-ref_button_active-pause"
				icon="pause_circle_filled"
				title={`アクティブインスタンスをポーズ${props.isActivePausing ? "解除" : ""}\r\r`
				        + `ポーズ中は全インスタンスの進行が停止します。`}
				pushed={props.isActivePausing}
				pushedIcon="play_circle_filled"
				onClick={props.onClickActivePause} />
			<ToolIconButton
				className="external-ref_button_active-step"
				icon="skip_next"
				disabled={!props.isActivePausing}
				title={`アクティブインスタンスのポーズ中、プレイを1フレーム進めます。`}
				onClick={props.onClickStep} />
			<ToolIconButton
				className="external-ref_button_add-instance"
				icon="web_asset"
				title={"インスタンスを追加(ウィンドウ)\r\r現在のプレイに接続するインスタンスを新しいタブ・ウィンドウで追加します。"}
				onClick={props.onClickAddInstance} />
			<ToolIconButton
				className="external-ref_button_add-frame"
				icon="group_add"
				title={"インスタンスを追加(フレーム)\r\r現在のプレイに接続するインスタンスをこのウィンドウ内に追加します。"}
				disabled={props.disablesFrameAdd}
				onClick={props.onClickAddFrame} />
			{/* // 未実装
			<ToolLabelButton title="Playback Rate (Active)" onClick={props.onClickActivePlaybackRate}>
				x{"" + props.playbackRate}
			</ToolLabelButton>
			*/}
		</ToolControlGroup>;
	}
}
