import * as React from "react";
import { observer } from "mobx-react";
import { PlayEntity } from "../../store/PlayEntity";
import { LocalInstanceEntity } from "../../store/LocalInstanceEntity";
import { ToolBarUiStore } from "../../store/ToolBarUiStore";
import { Operator } from "../../operator/Operator";
import { PlayControlPropsData } from "../molecule/PlayControl";
import { InstanceControlPropsData } from "../molecule/InstanceControl";
import { PlayerControlPropsData } from "../molecule/PlayerControl";
import { ToolBar } from "../organism/ToolBar";

export interface ToolBarContainerProps {
	play: PlayEntity;
	localInstance: LocalInstanceEntity;
	operator: Operator;
	toolBarUiStore: ToolBarUiStore;
}

@observer
export class ToolBarContainer extends React.Component<ToolBarContainerProps, {}> {
	render(): React.ReactNode {
		const { operator, localInstance, toolBarUiStore } = this.props;
		return <ToolBar
			makePlayControlProps={this._makePlayControlProps}
			makeInstanceControlProps={this._makeInstanceControlProps}
			makePlayerControlProps={this._makePlayerControlProps}
			showsAppearance={toolBarUiStore.showsAppearanceMenu}
			showsDevtools={toolBarUiStore.showsDevtools}
			showsInstanceControl={(localInstance.executionMode === "replay") || toolBarUiStore.showsDevtools}
			onToggleAppearance={operator.ui.toggleShowAppearance}
			onToggleDevTools={operator.ui.toggleShowDevtools}
		/>;
	}

	private _makePlayControlProps = (): PlayControlPropsData => {
		const { play, operator } = this.props;
		return {
			playbackRate: play.activePlaybackRate,
			isActivePausing: play.isActivePausing,
			onClickReset: operator.restartWithNewPlay,
			onClickActivePause: operator.play.togglePauseActive,
			onClickAddInstance: operator.play.openNewClientInstance
		};
	}

	private _makeInstanceControlProps = (): InstanceControlPropsData => {
		const { play, localInstance, operator, toolBarUiStore } = this.props;
		return {
			currentTime: (
				(localInstance.executionMode !== "replay") ? play.duration :
				(toolBarUiStore.isSeeking) ? toolBarUiStore.currentTimePreview : localInstance.targetTime
			),
			duration: play.duration,
			isPaused: localInstance.isPaused,
			isProgressActive: toolBarUiStore.isSeeking,
			enableFastForward: (localInstance.executionMode === "replay"),
			onProgressChange: operator.localInstance.previewSeekTo,
			onProgressCommit: operator.localInstance.seekTo,
			onClickPause: operator.localInstance.togglePause,
			onClickFastForward: operator.localInstance.switchToRealtime
		};
	}

	private _makePlayerControlProps = (): PlayerControlPropsData => {
		const { localInstance, operator } = this.props;
		return {
			selfId: localInstance.player.id,
			isJoined: localInstance.isJoined,
			isJoinEnabled: (localInstance.executionMode === "passive"),
			onClickJoinLeave: operator.play.toggleJoinLeaveSelf
		};
	}
}
