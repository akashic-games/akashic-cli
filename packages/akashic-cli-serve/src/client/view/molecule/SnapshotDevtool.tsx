import * as React from "react";
import { observer } from "mobx-react";
import { StartPointHeader } from "../../../common/types/StartPointHeader";
import { ToolLabelButton } from "../atom/ToolLabelButton";

export interface SnapshotDevtoolProps {
	startPointHeaders: StartPointHeader[];
	downloadSnapshot: (frame: number) => void;
	onClickSeekToSnapshot: (frame: number) => void;
}

@observer
export class SnapshotDevtool extends React.Component<SnapshotDevtoolProps, {}> {
	render(): React.ReactNode {
		return <div>
			スナップショット一覧
			<ul>
				{
					this.props.startPointHeaders.map(header => (
						<li key={header.frame}>
							<ToolLabelButton
								className="external-ref_button_download-playlog"
								title="ファイルに保存"
								onClick={() => {this.props.downloadSnapshot(header.frame); }}
							>
								ファイルに保存
							</ToolLabelButton>
							<ToolLabelButton
								className="external-ref_button_download-playlog"
								title="シーク"
								onClick={() => {this.props.onClickSeekToSnapshot(header.frame); }}
							>
								シーク
							</ToolLabelButton>
							{header.frame}
						</li>
					))
				}
			</ul>
			</div>;
	}
}
