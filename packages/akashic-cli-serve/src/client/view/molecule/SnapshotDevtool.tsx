import { observer } from "mobx-react";
import * as React from "react";
import { StartPointHeader } from "../../../common/types/StartPointHeader";
import { ToolSnapshotButton } from "../atom/ToolSnapshotButton";

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
							<ToolSnapshotButton
								className="external-ref_button_seek-snapshot"
								title="シーク"
								onClick={() => {
									this.props.onClickSeekToSnapshot(header.frame);
								}}
							>
								シーク
							</ToolSnapshotButton>
							<ToolSnapshotButton
								className="external-ref_button_download-snapshot"
								title="ファイルに保存"
								onClick={() => {
									this.props.downloadSnapshot(header.frame);
								}}
							>
								ファイルに保存
							</ToolSnapshotButton>
							{header.frame}
						</li>
					))
				}
			</ul>
		</div>;
	}
}
