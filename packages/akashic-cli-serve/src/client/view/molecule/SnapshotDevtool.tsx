import * as React from "react";
import { observer } from "mobx-react";
import { StartPointHeader } from "@akashic/headless-driver/lib/play/amflow/AMFlowStore";

export interface SnapshotDevtoolProps {
	startPointHeaderList: StartPointHeader[];
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
							{header.frame}
						</li>
					))
				}
			</ul>
			</div>;
	}
}
