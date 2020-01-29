import * as React from "react";
import { observer } from "mobx-react";
import { ToolProgressBar } from "../atom/ToolProgressBar";

export interface AtsumaruDevtoolProps {
	disabled: boolean;
	volume: number;
	isSeekingVolume: boolean;
	changeVolume: (volume: number) => void;
	dicideVolume: (volume: number) => void;
}

@observer
export class AtsumaruDevtool extends React.Component<AtsumaruDevtoolProps, {}> {
	render(): React.ReactNode {
		const props = this.props;
		return <div>
		volume:
		<ToolProgressBar
			width={200}
			max={100} value={props.volume}
			active={props.isSeekingVolume}
			onChange={!props.disabled && props.changeVolume}
			onCommit={!props.disabled && props.dicideVolume} />
		{
			`${props.volume} / 100`
		}
	</div>;
	}
}
