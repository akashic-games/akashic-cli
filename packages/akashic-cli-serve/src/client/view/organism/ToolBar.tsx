import type { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType.js";
import { observer } from "mobx-react";
import * as React from "react";
import { ToolIconButton } from "../atom/ToolIconButton.js";
import { ToolLabel } from "../atom/ToolLabel.js";
import type { AudioOptionControlPropsData } from "../molecule/AudioOptionControl.js";
import { AudioOptionControl } from "../molecule/AudioOptionControl.js";
import type { DisplayOptionControlPropsData } from "../molecule/DisplayOptionControl.js";
import { DisplayOptionControl } from "../molecule/DisplayOptionControl.js";
import type { InstanceControlPropsData } from "../molecule/InstanceControl.js";
import { InstanceControl } from "../molecule/InstanceControl.js";
import type { PlayControlPropsData } from "../molecule/PlayControl.js";
import { PlayControl } from "../molecule/PlayControl.js";
import type { PlayerControlPropsData } from "../molecule/PlayerControl.js";
import { PlayerControl } from "../molecule/PlayerControl.js";
import styles from "./ToolBar.module.css";

export interface ToolBarProps {
	makePlayControlProps: () => PlayControlPropsData;
	makeInstanceControlProps: () => InstanceControlPropsData;
	makePlayerControlProps: () => PlayerControlPropsData;
	makeAudioOptionControlProps: () => AudioOptionControlPropsData;
	makeDisplayOptionControlProps: () => DisplayOptionControlPropsData;
	showsAppearance: boolean;
	showsDevtools: boolean;
	showsInstanceControl: boolean;
	targetService: ServiceType;
	onToggleAppearance: (show: boolean) => void;
	onClickDevTools: (show: boolean) => void;
}

export const ToolBar = observer(class ToolBar extends React.Component<ToolBarProps, {}> {
	render(): React.ReactNode {
		const props = this.props;
		return <div className={styles["tool-bar"]}>
			<div className={styles["tool-bar-left"]}>
				<PlayControl makeProps={props.makePlayControlProps} />
				<div className={styles.sep} />
				<PlayerControl makeProps={props.makePlayerControlProps} />
				{
					props.showsInstanceControl ?
						<>
							<div className={styles.sep} />
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
					service: <b>{props.targetService}</b>
				</ToolLabel>
				<AudioOptionControl makeProps={props.makeAudioOptionControlProps} />
				<DisplayOptionControl makeProps={props.makeDisplayOptionControlProps} />
				<ToolIconButton
					className="external-ref_button_dev-tools"
					icon="menu"
					title={"Devtools"}
					pushed={props.showsDevtools}
					onClick={props.onClickDevTools} />
			</div>
		</div>;
	}
});

