import { observer } from "mobx-react";
import * as React from "react";
import { DevtoolSelectorBar } from "../atom/DevtoolSelectorBar";
import { TopResizable } from "../atom/TopResizable";
import type { AtsumaruDevtoolProps } from "../molecule/AtsumaruDevtool";
import { AtsumaruDevtool } from "../molecule/AtsumaruDevtool";
import type { EntityTreeDevtoolProps } from "../molecule/EntityTreeDevtool";
import { EntityTreeDevtool } from "../molecule/EntityTreeDevtool";
import type { EventsDevtoolProps } from "../molecule/EventsDevtool";
import { EventsDevtool } from "../molecule/EventsDevtool";
import type { InstancesDevtoolProps } from "../molecule/InstancesDevtool";
import { InstancesDevtool } from "../molecule/InstancesDevtool";
import type { InternalDevtoolProps } from "../molecule/InternalDevtool";
import { InternalDevtool } from "../molecule/InternalDevtool";
import type { NiconicoDevtoolProps } from "../molecule/NiconicoDevtool";
import { NiconicoDevtool } from "../molecule/NiconicoDevtool";
import type { PlaybackDevtoolProps } from "../molecule/PlaybackDevtool";
import { PlaybackDevtool } from "../molecule/PlaybackDevtool";
import * as styles from "./Devtool.css";

// TODO 適切な箇所に定義を移す
export const devtoolTypes = [
	"Playback",
	"Instances",
	"Events",
	"EntityTree",
	"Atsumaru",
	"Niconico",
	"Internal"
];

export type DevtoolType = typeof devtoolTypes[number];

export interface DevtoolProps {
	height: number;
	minHeight: number;
	onResizeHeight: (height: number) => void;
	activeDevtool: DevtoolType;
	onSelectDevtool: (type: DevtoolType) => void;
	playbackDevtoolProps: PlaybackDevtoolProps;
	eventsDevtoolProps: EventsDevtoolProps;
	instancesDevtoolProps: InstancesDevtoolProps;
	entityTreeDevtoolProps: EntityTreeDevtoolProps;
	atsumaruDevtoolProps: AtsumaruDevtoolProps;
	niconicoDevtoolProps: NiconicoDevtoolProps;
	internalDevtoolProps: InternalDevtoolProps;
}

@observer
export class Devtool extends React.Component<DevtoolProps, {}> {
	private _onSelectToolTable: { [key: string]: () => void };

	constructor(props: DevtoolProps) {
		super(props);
		this._onSelectToolTable = {
			"Playback": this._onSelectPlaybackTool,
			"Instances": this._onSelectInstancesTool,
			"Events": this._onSelectEventsTool,
			"EntityTree": this._onSelectEntityListTool,
			"Atsumaru": this._onSelectAtsumaruTool,
			"Niconico": this._onSelectNiconicoTool,
			"Internal": this._onSelectInternalTool,
		};
	}

	render(): React.ReactNode {
		const props = this.props;
		const { activeDevtool } = props;
		return <TopResizable height={props.height} minHeight={props.minHeight} onResize={props.onResizeHeight}>
			<div className={styles.devtool}>
				<DevtoolSelectorBar items={
					devtoolTypes.map(t => ({
						name: t,
						active: (t === activeDevtool),
						onClick: this._onSelectToolTable[t]
					}))
				} />
				{ (activeDevtool === "Playback") && <PlaybackDevtool {...props.playbackDevtoolProps} /> }
				{ (activeDevtool === "Instances") && <InstancesDevtool {...props.instancesDevtoolProps} /> }
				{ (activeDevtool === "Events") && <EventsDevtool {...props.eventsDevtoolProps} /> }
				{ (activeDevtool === "EntityTree") && <EntityTreeDevtool {...props.entityTreeDevtoolProps} /> }
				{ (activeDevtool === "Atsumaru") && <AtsumaruDevtool {...props.atsumaruDevtoolProps} /> }
				{ (activeDevtool === "Niconico") && <NiconicoDevtool {...props.niconicoDevtoolProps} /> }
				{ (activeDevtool === "Internal") && <InternalDevtool {...props.internalDevtoolProps} /> }
			</div>
		</TopResizable>;
	}

	private _onSelectPlaybackTool = (): void => {
		this.props.onSelectDevtool("Playback");
	};

	private _onSelectInstancesTool = (): void => {
		this.props.onSelectDevtool("Instances");
	};

	private _onSelectEventsTool = (): void => {
		this.props.onSelectDevtool("Events");
	};

	private _onSelectEntityListTool = (): void => {
		this.props.onSelectDevtool("EntityTree");
	};

	private _onSelectAtsumaruTool = (): void => {
		this.props.onSelectDevtool("Atsumaru");
	};

	private _onSelectNiconicoTool = (): void => {
		this.props.onSelectDevtool("Niconico");
	};

	private _onSelectInternalTool = (): void => {
		this.props.onSelectDevtool("Internal");
	};
}
