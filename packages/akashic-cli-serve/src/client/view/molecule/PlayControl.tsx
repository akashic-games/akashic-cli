import { observer } from "mobx-react";
import * as React from "react";
import { ToolControlGroup } from "../atom/ToolControlGroup";
import { ToolIconButton } from "../atom/ToolIconButton";
import styles from "./PlayControl.module.css";

export interface PlayControlPropsData {
	playbackRate: number;
	isActivePausing: boolean;
	isActiveExists: boolean;
	onClickReset?: () => void;
	onClickActivePause?: (toPause: boolean) => void;
	onClickAddInstance?: () => void;
	onClickAddWindow?: () => void;
	onClickStep?: () => void;
}

export interface PlayControlProps {
	makeProps: () => PlayControlPropsData;
}

export const PlayControl = observer(class PlayControl extends React.Component<PlayControlProps, { isInstanceDropdownOpen: boolean }> {
	constructor(props: PlayControlProps) {
		super(props);
		this.state = {
			isInstanceDropdownOpen: false
		};
	}

	toggleInstanceDropdown = (): void => {
		this.setState((prevState) => ({
			isInstanceDropdownOpen: !prevState.isInstanceDropdownOpen,
		}));
	};

	handleAddInstance = (): void => {
		this.setState({ isInstanceDropdownOpen: false });
		const props = this.props.makeProps();
		if (props.onClickAddInstance) {
			props.onClickAddInstance();
		}
	};

	handleAddWindow = (): void => {
		this.setState({ isInstanceDropdownOpen: false });
		const props = this.props.makeProps();
		if (props.onClickAddWindow) {
			props.onClickAddWindow();
		}
	};

	render(): React.ReactNode {
		const props = this.props.makeProps();

		return <ToolControlGroup label="Play">
			<ToolIconButton
				className="external-ref_button_new-play"
				icon="power_settings_new"
				title={"新規プレイ\r\r新しいプレイを作成し、現在の全インスタンスから接続します。"}
				onClick={props.onClickReset} />
			<ToolIconButton
				className="external-ref_button_active-pause"
				icon="pause_circle_filled"
				disabled={!props.isActiveExists}
				title={`アクティブインスタンスをポーズ${props.isActivePausing ? "解除" : ""}\r\r`
					+ "ポーズ中は全インスタンスの進行が停止します。"}
				pushed={props.isActivePausing}
				pushedIcon="play_circle_filled"
				onClick={props.onClickActivePause} />
			<ToolIconButton
				className="external-ref_button_active-step"
				icon="skip_next"
				disabled={!props.isActivePausing || !props.isActiveExists}
				title={"アクティブインスタンスのポーズ中、プレイを1フレーム進めます。"}
				onClick={props.onClickStep} />
			<ToolIconButton
				className="external-ref_button_add-instance"
				icon="group_add"
				title={"インスタンスを追加\r\r新しいタブ・ウィンドウでこのプレイに接続するインスタンスを追加します。"}
				onClick={props.onClickAddInstance} />
			<div className={styles["dropdown-container"]}>
				<ToolIconButton
					className="external-ref_button_dropdown"
					icon="arrow_drop_down"
					title={"インスタンス追加オプション"}
					onClick={this.toggleInstanceDropdown}
				/>
				{this.state.isInstanceDropdownOpen && (
					<div className={styles["dropdown-menu"]}>
						<div className={styles["dropdown-item"]} onClick={this.handleAddInstance}>
							インスタンスを追加
						</div>
						<div className={styles["dropdown-item"]} onClick={this.handleAddWindow}>
							同一プレイヤーIDでウィンドウを追加
						</div>
					</div>
				)}
			</div>
			{/* // 未実装
			<ToolLabelButton title="Playback Rate (Active)" onClick={props.onClickActivePlaybackRate}>
				x{"" + props.playbackRate}
			</ToolLabelButton>
			*/}
		</ToolControlGroup>;
	}
});

