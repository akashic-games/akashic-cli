import * as React from "react";
import { observer } from "mobx-react";
import { ToolIconButton } from "../atom/ToolIconButton";
import { PlayControl, PlayControlPropsData } from "../molecule/PlayControl";
import { InstanceControl, InstanceControlPropsData } from "../molecule/InstanceControl";
import { PlayerControl, PlayerControlPropsData } from "../molecule/PlayerControl";
import * as styles from "./ToolBar.css";

export interface ToolBarProps {
	makePlayControlProps: () => PlayControlPropsData;
	makeInstanceControlProps: () => InstanceControlPropsData;
	makePlayerControlProps: () => PlayerControlPropsData;
	showsAppearance: boolean;
	showsDevtools: boolean;
	showsInstanceControl: boolean;
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
				<ToolIconButton
					icon="menu"
					title={"Devtoolsの表示切り替え"}
					pushed={props.showsDevtools}
					onClick={props.onToggleDevTools} />
			</div>
		</div>;
	}
}
