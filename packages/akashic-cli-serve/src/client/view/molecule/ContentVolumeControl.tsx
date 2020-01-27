import * as React from "react";
import { observer } from "mobx-react";
import { ToolProgressBar } from "../atom/ToolProgressBar";

export interface ContentVolumeControlPropsData {
	volume: number;
	isSeeking: boolean;
	changeVolume: (volume: number) => void;
	dicideVolume: (volume: number) => void;
}

export interface ContentVolumeControlProps {
	makeProps: () => ContentVolumeControlPropsData;
}

@observer
export class ContentVolumeControl extends React.Component<ContentVolumeControlProps, {}> {
	render(): React.ReactNode {
		const props = this.props.makeProps();
		return <div>
			<ToolProgressBar
				width={200}
				max={100} value={props.volume}
				active={props.isSeeking}
				onChange={props.changeVolume}
				onCommit={props.dicideVolume} />
			<p>
				{
					`${props.volume} / 100`
				}
			</p>
		</div>;
	}
}
