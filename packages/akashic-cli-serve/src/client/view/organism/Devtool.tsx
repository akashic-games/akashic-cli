import * as React from "react";
import { observer } from "mobx-react";
import { TopResizable } from "../atom/TopResizable";
import { DevtoolSelectorBar } from "../atom/DevtoolSelectorBar";
import { EventsDevtool, EventsDevtoolProps } from "../molecule/EventsDevtool";
import { InstancesDevtool, InstancesDevtoolProps } from "../molecule/InstancesDevtool";
import { EntityTreeDevtool, EntityTreeDevtoolProps } from "../molecule/EntityTreeDevtool";
import { AtsumaruDevtool, AtsumaruDevtoolProps } from "../molecule/AtsumaruDevtool";
import { NiconicoDevtool, NiconicoDevtoolProps } from "../molecule/NiconicoDevtool";
import { MiscDevtool, MiscDevtoolProps } from "../molecule/MiscDevtool";
import { SnapshotDevtool, SnapshotDevtoolProps } from "../molecule/SnapshotDevtool";
import * as styles from "./Devtool.css";

// TODO 適切な箇所に定義を移す
export type DevtoolType =
	"Instances" |
	"Events" |
	"EntityTree" |
	"Atsumaru" |
	"Niconico" |
	"Misc" |
	"Snapshot";

export interface DevtoolProps {
	height: number;
	minHeight: number;
	onResizeHeight: (height: number) => void;
	activeDevtool: DevtoolType;
	onSelectDevtool: (type: DevtoolType) => void;
	eventsDevtoolProps: EventsDevtoolProps;
	instancesDevtoolProps: InstancesDevtoolProps;
	entityTreeDevtoolProps: EntityTreeDevtoolProps;
	atsumaruDevtoolProps: AtsumaruDevtoolProps;
	niconicoDevtoolProps: NiconicoDevtoolProps;
	miscDevtoolProps: MiscDevtoolProps;
	snapshotDevtoolProps: SnapshotDevtoolProps;
}

@observer
export class Devtool extends React.Component<DevtoolProps, {}> {
	private _onSelectToolTable: { [key: string]: () => void };

	constructor(props: DevtoolProps) {
		super(props);
		this._onSelectToolTable = {
			"Instances": this._onSelectInstancesTool,
			"Events": this._onSelectEventsTool,
			"EntityTree": this._onSelectEntityListTool,
			"Atsumaru": this._onSelectAtsumaruTool,
			"Niconico": this._onSelectNiconicoTool,
			"Misc": this._onSelectMiscTool,
			"Snapshot": this._onSnapshotTool
		};
	}

	render(): React.ReactNode {
		const props = this.props;
		const { activeDevtool } = props;
		return <TopResizable height={props.height} minHeight={props.minHeight} onResize={props.onResizeHeight}>
			<div className={styles["devtool"]}>
				<DevtoolSelectorBar items={
					["Instances", "Events", "EntityTree", "Atsumaru", "Niconico", "Misc", "Snapshot"].map(t => ({
						name: t,
						active: (t === activeDevtool),
						onClick: this._onSelectToolTable[t]
					}))
				} />
				{ (activeDevtool === "Instances") && <InstancesDevtool {...props.instancesDevtoolProps} /> }
				{ (activeDevtool === "Events") && <EventsDevtool {...props.eventsDevtoolProps} /> }
				{ (activeDevtool === "EntityTree") && <EntityTreeDevtool {...props.entityTreeDevtoolProps} /> }
				{ (activeDevtool === "Atsumaru") && <AtsumaruDevtool {...props.atsumaruDevtoolProps} /> }
				{ (activeDevtool === "Niconico") && <NiconicoDevtool {...props.niconicoDevtoolProps} /> }
				{ (activeDevtool === "Misc") && <MiscDevtool {...props.miscDevtoolProps} /> }
				{ (activeDevtool === "Snapshot") && <SnapshotDevtool {...props.snapshotDevtoolProps} /> }
			</div>
		</TopResizable>;
	}

	private _onSelectInstancesTool = (): void => {
		this.props.onSelectDevtool("Instances");
	}

	private _onSelectEventsTool = (): void => {
		this.props.onSelectDevtool("Events");
	}

	private _onSelectEntityListTool = (): void => {
		this.props.onSelectDevtool("EntityTree");
	}

	private _onSelectAtsumaruTool = (): void => {
		this.props.onSelectDevtool("Atsumaru");
	}

	private _onSelectNiconicoTool = (): void => {
		this.props.onSelectDevtool("Niconico");
	}

	private _onSelectMiscTool = (): void => {
		this.props.onSelectDevtool("Misc");
	}

	private _onSnapshotTool = (): void => {
		this.props.onSelectDevtool("Snapshot");
	}
}
