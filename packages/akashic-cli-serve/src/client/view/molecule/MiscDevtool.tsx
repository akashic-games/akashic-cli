import { observer } from "mobx-react";
import * as React from "react";
import { ToolLabelButton } from "../atom/ToolLabelButton";

export interface MiscDevtoolProps {
	downloadPlaylog: () => void;
	sendScreenshotEvent: () => void;
	sendFinishEvent: () => void;
}

@observer
// 現状のUIでカテゴリ分けが難しいものを暫定的に置くためのタグ
export class MiscDevtool extends React.Component<MiscDevtoolProps, {}> {
	render(): React.ReactNode {
		return <div>
			<ToolLabelButton
				className="external-ref_button_download-playlog"
				title="今までのリプレイ情報を保存"
				onClick={this.props.downloadPlaylog}
			>
				今までのリプレイ情報を保存
			</ToolLabelButton>
			<ToolLabelButton
				className="external-ref_button_send-screenshot-event"
				title="Playlogにtype:screenshotのEvent追加(テスト用)"
				onClick={this.props.sendScreenshotEvent}
			>
				Playlogにtype:screenshotのEvent追加(テスト用)
			</ToolLabelButton>
			<ToolLabelButton
				className="external-ref_button_send-finish-event"
				title="Playlogにtype:finishのEvent追加(テスト用)"
				onClick={this.props.sendFinishEvent}
			>
				Playlogにtype:finishのEvent追加(テスト用)
			</ToolLabelButton>
		</div>;
	}
}
