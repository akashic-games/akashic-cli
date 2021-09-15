import * as React from "react";
import { observer } from "mobx-react";
import { ToolLabelButton } from "../atom/ToolLabelButton";

export interface MiscDevtoolProps {
	downloadPlaylog: () => void;
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
		</div>;
	}
}
