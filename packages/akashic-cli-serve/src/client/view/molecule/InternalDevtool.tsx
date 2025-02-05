import { observer } from "mobx-react";
import * as React from "react";
import { ToolLabelButton } from "../atom/ToolLabelButton";

export interface InternalDevtoolProps {
	sendScreenshotEvent: () => void;
	sendFinishEvent: () => void;
}

// 現状のUIでカテゴリ分けが難しいものを暫定的に置くためのタグ
export const InternalDevtool = observer(class InternalDevtool extends React.Component<InternalDevtoolProps, {}> {
	render(): React.ReactNode {
		return <div>
			<ToolLabelButton
				className="external-ref_button_send-screenshot-event"
				title="コンテンツにtype:screenshotのMessageEvent送信(テスト用)"
				onClick={this.props.sendScreenshotEvent}
			>
				コンテンツにtype:screenshotのMessageEvent送信(テスト用)
			</ToolLabelButton>
			<ToolLabelButton
				className="external-ref_button_send-finish-event"
				title="コンテンツにtype:finishのMessageEvent送信(テスト用)"
				onClick={this.props.sendFinishEvent}
			>
				コンテンツにtype:finishのMessageEvent送信(テスト用)
			</ToolLabelButton>
		</div>;
	}
});
