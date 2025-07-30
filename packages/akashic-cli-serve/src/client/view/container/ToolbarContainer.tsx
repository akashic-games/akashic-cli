import type { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType";
import { observer } from "mobx-react";
import * as React from "react";
import type { Operator } from "../../operator/Operator";
import type { LocalInstanceEntity } from "../../store/LocalInstanceEntity";
import type { PlayEntity } from "../../store/PlayEntity";
import type { ToolBarUiStore } from "../../store/ToolBarUiStore";
import type { AudioOptionControlPropsData } from "../molecule/AudioOptionControl";
import type { DisplayOptionControlPropsData } from "../molecule/DisplayOptionControl";
import type { InstanceControlPropsData } from "../molecule/InstanceControl";
import type { PlayControlPropsData } from "../molecule/PlayControl";
import type { PlayerControlPropsData } from "../molecule/PlayerControl";
import { ToolBar } from "../organism/ToolBar";

export interface ToolBarContainerProps {
	play: PlayEntity;
	localInstance: LocalInstanceEntity;
	operator: Operator;
	toolBarUiStore: ToolBarUiStore;
	targetService: ServiceType;
}

export const ToolBarContainer = observer(class ToolBarContainer extends React.Component<ToolBarContainerProps, {}> {
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
			onClickAddWindow: operator.play.openSameClientInstance,
			onClickStep: operator.play.step
		};
	};

	private _makeInstanceControlProps = (): InstanceControlPropsData => {
		const { play, localInstance, operator, toolBarUiStore } = this.props;
		return {
			currentTime: (
				(localInstance.executionMode !== "replay") ? play.duration :
				(toolBarUiStore.isSeeking) ? toolBarUiStore.currentTimePreview : localInstance.targetTime
			),
			duration: play.duration,
			resetTime: localInstance.resetTime,
			isPaused: localInstance.isPaused,
			isProgressActive: toolBarUiStore.isSeeking,
			enableFastForward: (localInstance.executionMode === "replay"),
			onProgressChange: operator.localInstance.previewSeekTo,
			onProgressCommit: operator.localInstance.seekTo,
			onClickPause: operator.localInstance.togglePause,
			onClickFastForward: operator.localInstance.switchToRealtime
		};
	};

	private _makePlayerControlProps = (): PlayerControlPropsData => {
		const { localInstance, operator, targetService } = this.props;
		const joinEnabled = !/^nicolive.*/.test(targetService);
		return {
			selfId: localInstance.player.id,
			isJoined: localInstance.isJoined,
			isJoinEnabled: (localInstance.executionMode === "passive" && joinEnabled),
			onClickJoinLeave: operator.play.toggleJoinLeaveSelf
		};
	};

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
	};

	private _makeDisplayOptionControlProps = (): DisplayOptionControlPropsData => {
		const { operator, toolBarUiStore } = this.props;
		return {
			showsDisplayOptionPopover: toolBarUiStore.showsDisplayOptionPopover,
			fitsToScreen: toolBarUiStore.fitsToScreen,
			showsBackgroundImage: toolBarUiStore.showsBackgroundImage,
			showsBackgroundColor: toolBarUiStore.showsBackgroundColor,
			showsGrid: toolBarUiStore.showsGrid,
			showsProfiler: toolBarUiStore.showsProfiler,
			showsDesignGuideline: toolBarUiStore.showsDesignGuideline,
			onClickDisplayOptionPopover: operator.ui.setShowDisplayOptionPopover,
			onChangeFitsToScreen: operator.ui.setFitsToScreen,
			onChangeShowBackgroundImage: operator.ui.setShowBackgroundImage,
			onChangeShowBackgroundColor: operator.ui.setShowBackgroundColor,
			onChangeShowGrid: operator.ui.setShowGrid,
			onChangeShowProfiler: operator.ui.setShowsProfiler,
			onChangeShowDesignGuideline: operator.ui.setShowDesignGuideline,
			onClickScreenshot: operator.localInstance.saveScreenshot
		};
	};
});

