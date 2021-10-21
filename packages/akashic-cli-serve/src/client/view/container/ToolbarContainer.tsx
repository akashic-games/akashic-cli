import * as React from "react";
import { observer } from "mobx-react";
import { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType";
import { DevtoolUiStore } from "../../store/DevtoolUiStore";
import { PlayEntity } from "../../store/PlayEntity";
import { LocalInstanceEntity } from "../../store/LocalInstanceEntity";
import { ToolBarUiStore } from "../../store/ToolBarUiStore";
import { Operator } from "../../operator/Operator";
import { AudioOptionControlPropsData } from "../molecule/AudioOptionControl";
import { PlayControlPropsData } from "../molecule/PlayControl";
import { InstanceControlPropsData } from "../molecule/InstanceControl";
import { PlayerControlPropsData } from "../molecule/PlayerControl";
import { DisplayOptionControlPropsData } from "../molecule/DisplayOptionControl";
import { ToolBar } from "../organism/ToolBar";

export interface ToolBarContainerProps {
	play: PlayEntity;
	localInstance: LocalInstanceEntity;
	operator: Operator;
	toolBarUiStore: ToolBarUiStore;
	devtoolUiStore: DevtoolUiStore; // シークバーの値を devtool と共有しているためその参照にのみ利用
	targetService: ServiceType;
}

@observer
export class ToolBarContainer extends React.Component<ToolBarContainerProps, {}> {
	render(): React.ReactNode {
		const { operator, localInstance, toolBarUiStore, targetService } = this.props;
		return <ToolBar
			makePlayControlProps={this._makePlayControlProps}
			makeInstanceControlProps={this._makeInstanceControlProps}
			makePlayerControlProps={this._makePlayerControlProps}
			makeAudioOptionControlProps={this._makeAudioOptionControlProps}
			makeDisplayOptionControlProps={this._makeDisplayOptionControlProps}
			showsAppearance={toolBarUiStore.showsAppearanceMenu}
			showsDevtools={toolBarUiStore.showsDevtools}
			showsInstanceControl={(localInstance.executionMode === "replay") || toolBarUiStore.showsDevtools}
			targetService={targetService}
			onToggleAppearance={operator.ui.setShowAppearance}
			onClickDevTools={operator.ui.setShowDevtools}
		/>;
	}

	private _makePlayControlProps = (): PlayControlPropsData => {
		const { play, operator } = this.props;
		return {
			playbackRate: play.activePlaybackRate,
			isActivePausing: play.isActivePausing,
			isActiveExists: play.status === "running", // NOTE: アクティブインスタンスの存在を PlayStatus から判定するのは現実装で一致しているだけであり、厳密には異なるケースがある
			onClickReset: operator.restartWithNewPlay,
			onClickActivePause: operator.play.togglePauseActive,
			onClickAddInstance: operator.play.openNewClientInstance,
			onClickStep: operator.play.step
		};
	}

	private _makeInstanceControlProps = (): InstanceControlPropsData => {
		const { play, localInstance, operator, devtoolUiStore } = this.props;
		return {
			currentTime: (
				(localInstance.executionMode !== "replay") ? play.duration :
				(devtoolUiStore.isSeeking) ? devtoolUiStore.currentTimePreview : localInstance.targetTime
			),
			duration: play.duration,
			resetTime: localInstance.resetTime,
			isPaused: localInstance.isPaused,
			isProgressActive: devtoolUiStore.isSeeking,
			enableFastForward: (localInstance.executionMode === "replay"),
			onProgressChange: operator.localInstance.previewSeekTo,
			onProgressCommit: operator.localInstance.seekTo,
			onClickPause: operator.localInstance.togglePause,
			onClickFastForward: operator.localInstance.switchToRealtime
		};
	}

	private _makePlayerControlProps = (): PlayerControlPropsData => {
		const { localInstance, operator, targetService } = this.props;
		const joinEnabled = !/^nicolive.*/.test(targetService) && targetService !== "atsumaru:multi";
		return {
			selfId: localInstance.player.id,
			isJoined: localInstance.isJoined,
			isJoinEnabled: (localInstance.executionMode === "passive" && joinEnabled),
			onClickJoinLeave: operator.play.toggleJoinLeaveSelf
		};
	}

	private _makeAudioOptionControlProps = (): AudioOptionControlPropsData => {
		const { operator, localInstance, toolBarUiStore } = this.props;
		return {
			showsAudioOptionPopover: toolBarUiStore.showsAudioOptionPopover,
			audioStateSummary: localInstance.playAudioStateSummary,
			onClickAudioOptionPopover: operator.ui.setShowAudioOptionPopover,
			onClickMuteAll: operator.play.muteAll,
			onClickSolo: operator.play.muteOthers,
			onClickMuteNone: operator.play.unmuteAll,
		};
	}

	private _makeDisplayOptionControlProps = (): DisplayOptionControlPropsData => {
		const { operator, toolBarUiStore } = this.props;
		return {
			showsDisplayOptionPopover: toolBarUiStore.showsDisplayOptionPopover,
			showsBackgroundImage: toolBarUiStore.showsBackgroundImage,
			showsGrid: toolBarUiStore.showsGrid,
			showsProfiler: toolBarUiStore.showsProfiler,
			showsDesignGuideline: toolBarUiStore.showsDesignGuideline,
			onClickDisplayOptionPopover: operator.ui.setShowDisplayOptionPopover,
			onChangeShowBackgroundImage: operator.ui.setShowBackgroundImage,
			onChangeShowGrid: operator.ui.setShowGrid,
			onChangeShowProfiler: operator.ui.setShowsProfiler,
			onChangeShowDesignGuideline: operator.ui.setShowDesignGuideline
		};
	}
}
