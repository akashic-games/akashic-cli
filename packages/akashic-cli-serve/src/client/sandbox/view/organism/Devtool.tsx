import { observer } from "mobx-react";
import * as React from "react";
import { DevtoolSelectorBar } from "../../../view/atom/DevtoolSelectorBar";
import { TopResizable } from "../../../view/atom/TopResizable";
import type { EntityTreeDevtoolProps } from "../../../view/molecule/EntityTreeDevtool";
import { EntityTreeDevtool } from "../../../view/molecule/EntityTreeDevtool";
import type { EventsDevtoolProps } from "../../../view/molecule/EventsDevtool";
import { EventsDevtool } from "../../../view/molecule/EventsDevtool";
import type { NiconicoDevtoolProps } from "../../../view/molecule/NiconicoDevtool";
import { NiconicoDevtool } from "../../../view/molecule/NiconicoDevtool";
import type { PlaybackDevtoolProps } from "../../../view/molecule/PlaybackDevtool";
import { PlaybackDevtool } from "../../../view/molecule/PlaybackDevtool";
import styles from "./Devtool.module.css";

// TODO 適切な箇所に定義を移す
export const devtoolTypes = [
	"Playback",
	"Events",
	"EntityTree",
	"Niconico",
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
	entityTreeDevtoolProps: EntityTreeDevtoolProps;
	niconicoDevtoolProps: NiconicoDevtoolProps;
}

export const Devtool = observer(class Devtool extends React.Component<DevtoolProps, {}> {
	private _onSelectToolTable: { [key: string]: () => void };

	constructor(props: DevtoolProps) {
		super(props);
		this._onSelectToolTable = {
			"Playback": this._onSelectPlaybackTool,
			"Events": this._onSelectEventsTool,
			"EntityTree": this._onSelectEntityListTool,
			"Niconico": this._onSelectNiconicoTool,
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
				{ (activeDevtool === "Events") && <EventsDevtool {...props.eventsDevtoolProps} /> }
				{ (activeDevtool === "EntityTree") && <EntityTreeDevtool {...props.entityTreeDevtoolProps} /> }
				{ (activeDevtool === "Niconico") && <NiconicoDevtool {...props.niconicoDevtoolProps} /> }
			</div>
		</TopResizable>;
	}

	private _onSelectPlaybackTool = (): void => {
		this.props.onSelectDevtool("Playback");
	};

	private _onSelectEventsTool = (): void => {
		this.props.onSelectDevtool("Events");
	};

	private _onSelectEntityListTool = (): void => {
		this.props.onSelectDevtool("EntityTree");
	};

	private _onSelectNiconicoTool = (): void => {
		this.props.onSelectDevtool("Niconico");
	};

	private _onSelectInternalTool = (): void => {
		this.props.onSelectDevtool("Internal");
	};
});

