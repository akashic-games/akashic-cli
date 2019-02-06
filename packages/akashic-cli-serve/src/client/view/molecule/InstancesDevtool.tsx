import * as React from "react";
import { observer } from "mobx-react";
import { ToolIconButton } from "../atom/ToolIconButton";
import { FlexScrollY } from "../atom/FlexScrollY";
import * as styles from "./InstancesDevtool.css";

export interface InstanceViewData {
	type: "active" | "passive";  // TODO isActive: boolean にする
	env?: string;
	playerId: string | null;
	name: string | null;
	isJoined: boolean;
}

export interface InstancesDevtoolProps {
	instances: InstanceViewData[];
	onClickAddInstance: () => void;
}

@observer
export class InstancesDevtool extends React.Component<InstancesDevtoolProps, {}> {
	render(): React.ReactNode {
		return <div className={styles["instances-devtool"]}>
			<div className={styles["instance-toolbar"]}>
				<ToolIconButton icon="group_add"
				                title="インスタンスを追加"
				                onClick={this.props.onClickAddInstance}>
					Add Instance
				</ToolIconButton>
			</div>
			<FlexScrollY>
				<table className={styles["instance-table"]}>
					<thead>
						<tr>
							<th>Type</th>
							<th>Player ID</th>
							<th>Name</th>
							<th>Joined</th>
							<th>Env</th>
						</tr>
					</thead>
					<tbody>
						{
							this.props.instances.map(i => (
								// TODO playerId をkeyにすると複数サーバインスタンスができない
								<tr key={i.playerId} >
									<td>{ i.type }</td>
									<td>{ (i.playerId != null) ? i.playerId : "(null)" }</td>
									<td>{ (i.name != null) ? i.name : "(null)" }</td>
									<td>{ i.isJoined ? "true" : "false" }</td>
									<td>{ i.env || "(N/A)" }</td>
								</tr>
							))
						}
					</tbody>
					<tfoot>
						<tr>
							<td></td>
							<td><a href="#" onClick={this._onClickAddInstanceLink}>Add an instance</a></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</tfoot>
				</table>
			</FlexScrollY>
		</div>;
	}

	private _onClickAddInstanceLink = (ev: React.MouseEvent<HTMLAnchorElement>): void => {
		ev.preventDefault();
		this.props.onClickAddInstance();
	}
}
