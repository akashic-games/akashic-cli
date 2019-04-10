import * as React from "react";
import { observer } from "mobx-react";
import { TopResizable } from "../atom/TopResizable";
import { DevtoolSelectorBar } from "../atom/DevtoolSelectorBar";
import { EventsDevtool, EventsDevtoolProps } from "../molecule/EventsDevtool";
import { InstancesDevtool, InstancesDevtoolProps } from "../molecule/InstancesDevtool";
import { ExternalPluginsDevtool, ExternalPluginsDevtoolProps } from "../molecule/ExternalPluginsDevtool";
import * as styles from "./Devtool.css";

// TODO 適切な箇所に定義を移す
export type DevtoolType =
	"Instances" |
	"Events" |
	"ExternalPlugins";

export interface DevtoolProps {
	height: number;
	minHeight: number;
	onResizeHeight: (height: number) => void;
	activeDevtool: DevtoolType;
	onSelectDevtool: (type: DevtoolType) => void;
	eventsDevtoolProps: EventsDevtoolProps;
	instancesDevtoolProps: InstancesDevtoolProps;
	externalPluginsDevtoolProps: ExternalPluginsDevtoolProps;
}

@observer
export class Devtool extends React.Component<DevtoolProps, {}> {
	private _onSelectToolTable: { [key: string]: () => void };

	constructor(props: DevtoolProps) {
		super(props);
		this._onSelectToolTable = {
			"Instances": this._onSelectInstancesTool,
			"Events": this._onSelectEventsTool,
			"ExternalPlugins": this._onSelectExternalPluginsTool
		};
	}

	render(): React.ReactNode {
		const props = this.props;
		const { activeDevtool } = props;
		return <TopResizable height={props.height} minHeight={props.minHeight} onResize={props.onResizeHeight}>
			<div className={styles["devtool"]}>
				<DevtoolSelectorBar items={
					["Instances", "Events", "ExternalPlugins"].map(t => ({
						name: t,
						active: (t === activeDevtool),
						onClick: this._onSelectToolTable[t]
					}))
				} />
				{ (activeDevtool === "Instances") && <InstancesDevtool {...props.instancesDevtoolProps} /> }
				{ (activeDevtool === "Events") && <EventsDevtool {...props.eventsDevtoolProps} /> }
				{ (activeDevtool === "ExternalPlugins") && <ExternalPluginsDevtool {...props.externalPluginsDevtoolProps} /> }
			</div>
		</TopResizable>;
	}

	private _onSelectInstancesTool = (): void => {
		this.props.onSelectDevtool("Instances");
	}

	private _onSelectEventsTool = (): void => {
		this.props.onSelectDevtool("Events");
	}

	private _onSelectExternalPluginsTool = (): void => {
		this.props.onSelectDevtool("ExternalPlugins");
	}
}
