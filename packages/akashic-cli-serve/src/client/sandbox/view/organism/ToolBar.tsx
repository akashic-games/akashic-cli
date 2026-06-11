import type { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType.js";
import { observer } from "mobx-react";
import * as React from "react";

import { ToolIconButton } from "../../../view/atom/ToolIconButton.js";
import type { AudioOptionControlPropsData } from "../../../view/molecule/AudioOptionControl.js";
import { AudioOptionControl } from "../../../view/molecule/AudioOptionControl.js";
import type { DisplayOptionControlPropsData } from "../../../view/molecule/DisplayOptionControl.js";
import { DisplayOptionControl } from "../../../view/molecule/DisplayOptionControl.js";
import type { PlayerControlPropsData } from "../../../view/molecule/PlayerControl.js";
import { PlayerControl } from "../../../view/molecule/PlayerControl.js";
import styles from "./ToolBar.module.css";

export interface ToolBarProps {
	makePlayerControlProps: () => PlayerControlPropsData;
	makeDisplayOptionControlProps: () => DisplayOptionControlPropsData;
	makeAudioOptionControlProps: () => AudioOptionControlPropsData;
	showsDevtools: boolean;
	targetService: ServiceType;
	onClickDevTools: (show: boolean) => void;
}

export const ToolBar = observer(class ToolBar extends React.Component<ToolBarProps, {}> {
	render(): React.ReactNode {
		const props = this.props;
		return <div className={styles["tool-bar"]}>
			<div className={styles["tool-bar-left"]}>
				<PlayerControl makeProps={props.makePlayerControlProps} />
			</div>
			<div className={styles["tool-bar-right"]}>
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
