import * as React from "react";
import { observer } from "mobx-react";
import { StartPointHeader } from "@akashic/headless-driver/lib/play/amflow/AMFlowStore";
import { ToolLabelButton } from "../atom/ToolLabelButton";

export interface SnapshotDevtoolProps {
	startPointHeaderList: StartPointHeader[];
	downloadSnapshot: (frame: number)=> void;
}

@observer
export class SnapshotDevtool extends React.Component<SnapshotDevtoolProps, {}> {
	render(): React.ReactNode {
		return <div>
			スナップショット一覧
			<ul>
				{
					this.props.startPointHeaderList.map(header => (
						<li key={header.frame}>
							<ToolLabelButton
								className="external-ref_button_download-playlog"
								title="ファイルに保存"
								onClick={() => {this.props.downloadSnapshot(header.frame)}}
							>
								ファイルに保存
							</ToolLabelButton>
							{header.frame}
						</li>
					))
				}
			</ul>
			</div>;
	}
}
