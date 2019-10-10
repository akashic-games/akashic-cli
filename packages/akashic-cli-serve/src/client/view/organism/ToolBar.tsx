import * as React from "react";
import { observer } from "mobx-react";
import { ServiceType } from "../../../common/types/ServiceType";
import { ToolIconButton } from "../atom/ToolIconButton";
import { ToolLabel } from "../atom/ToolLabel";
import { PlayControl, PlayControlPropsData } from "../molecule/PlayControl";
import { InstanceControl, InstanceControlPropsData } from "../molecule/InstanceControl";
import { PlayerControl, PlayerControlPropsData } from "../molecule/PlayerControl";
import { DisplayOptionControl, DisplayOptionControlPropsData } from "../molecule/DisplayOptionControl";
import * as styles from "./ToolBar.css";

export interface ToolBarProps {
	makePlayControlProps: () => PlayControlPropsData;
	makeInstanceControlProps: () => InstanceControlPropsData;
	makePlayerControlProps: () => PlayerControlPropsData;
	makeDisplayOptionControlProps: () => DisplayOptionControlPropsData;
	showsAppearance: boolean;
	showsDevtools: boolean;
	showsInstanceControl: boolean;
	targetService: ServiceType;
	onToggleAppearance: (show: boolean) => void;
	onToggleDevTools: (show: boolean) => void;
}

@observer
export class ToolBar extends React.Component<ToolBarProps, {}> {
	render(): React.ReactNode {
		const props = this.props;
		return <div className={styles["tool-bar"]}>
			<div className={styles["tool-bar-left"]}>
				<PlayControl makeProps={props.makePlayControlProps} />
				<div className={styles["sep"]} />
				<PlayerControl makeProps={props.makePlayerControlProps} />
				{
					props.showsInstanceControl ?
						<>
							<div className={styles["sep"]} />
							<InstanceControl makeProps={props.makeInstanceControlProps} />
						</> :
						null
				}
			</div>
			<div className={styles["tool-bar-right"]}>
				{/* // 未実装
				<ToolToggleLabel isPushed={props.showsAppearance} onToggle={props.onToggleAppearance}>
					<i className="material-icons">zoom_in</i>
				</ToolToggleLabel>
				*/}
				<ToolLabel>
					TargetService: <b>{props.targetService}</b>
				</ToolLabel>
				<DisplayOptionControl makeProps={props.makeDisplayOptionControlProps} />
				<ToolIconButton
					icon="menu"
					title={"Devtools"}
					pushed={props.showsDevtools}
					onClick={props.onToggleDevTools} />
			</div>
		</div>;
	}
}
