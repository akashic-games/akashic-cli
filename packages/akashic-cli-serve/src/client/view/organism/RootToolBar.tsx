import * as React from "react";
import { observer } from "mobx-react";
import { ServiceType } from "@akashic/akashic-cli-commons";
import { ToolLabel } from "../atom/ToolLabel";
import { PlayControl, PlayControlPropsData } from "../molecule/PlayControl";
import * as styles from "./ToolBar.css"; // TODO RootToolBar.css を作る

export interface RootToolBarProps {
	makePlayControlProps: () => PlayControlPropsData;
	// showsAppearance: boolean;
	targetService: ServiceType;
	// onToggleAppearance: (show: boolean) => void;
}

@observer
export class RootToolBar extends React.Component<RootToolBarProps, {}> {
	render(): React.ReactNode {
		const props = this.props;
		return <div className={styles["tool-bar"]}>
			<div className={styles["tool-bar-left"]}>
				<PlayControl makeProps={props.makePlayControlProps} />
				{/*<div className={styles["sep"]} />*/}
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
			</div>
		</div>;
	}
}