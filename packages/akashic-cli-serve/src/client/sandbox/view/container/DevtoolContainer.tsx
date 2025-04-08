import type { NormalizedSandboxConfiguration } from "@akashic/sandbox-configuration";
import { observer } from "mobx-react";
import * as React from "react";
import type { DevtoolUiStore } from "../../../store/DevtoolUiStore";
import type { LocalInstanceEntity } from "../../../store/LocalInstanceEntity";
import type { PlayEntity } from "../../../store/PlayEntity";
import type { ToolBarUiStore } from "../../../store/ToolBarUiStore";
import type { Operator } from "../../operator/Operator";
import { Devtool } from "../organism/Devtool";

export interface DevtoolContainerProps {
	play: PlayEntity;
	operator: Operator;
	localInstance: LocalInstanceEntity;
	toolBarUiStore: ToolBarUiStore; // プログレスバーの値を共有してしまっているのでそれの参照に利用
	devtoolUiStore: DevtoolUiStore;
	sandboxConfig: NormalizedSandboxConfiguration;
}

export const DevtoolContainer = observer(class DevtoolContainer extends React.Component<DevtoolContainerProps, {}> {
	render(): React.ReactNode {
		const { play, operator, localInstance, toolBarUiStore, devtoolUiStore, sandboxConfig } = this.props;
		return <Devtool
			height={devtoolUiStore.height}
			minHeight={200}
			onResizeHeight={operator.ui.setDevtoolHeight}
			activeDevtool={devtoolUiStore.activeDevtool}
			onSelectDevtool={operator.ui.setActiveDevtool}
			eventsDevtoolProps={{
				showsEventList: devtoolUiStore.showsEventList,
				eventListWidth: devtoolUiStore.eventListWidth,
				eventListMinWidth: 150,
				onEventListResize: operator.ui.setEventListWidth,
				onClickShowEventList: operator.ui.setShowEventList,
				eventNames: sandboxConfig.events ? Object.keys(sandboxConfig.events) : [],
				eventEditContent: devtoolUiStore.eventEditContent,
				onClickSendEvent: operator.play.sendRegisteredEvent,
				onClickCopyEvent: operator.ui.copyRegisteredEventToEditor,
				onClickSendEditingEvent: operator.play.sendEditorEvent,
				onEventEditContentChanged: operator.ui.setEventEditContent
			}}
			playbackDevtoolProps={{
				startPointHeaders: play.startPointHeaders,
				focusedStartPointHeaderIndex: devtoolUiStore.focusedStartPointHeaderIndex!,
				currentTime: (
					(localInstance.executionMode !== "replay") ? play.duration :
					(toolBarUiStore.isSeeking) ? toolBarUiStore.currentTimePreview : localInstance.targetTime
				),
				duration: play.duration,
				resetTime: localInstance.resetTime,
				isPaused: localInstance.isPaused,
				isProgressActive: toolBarUiStore.isSeeking,
				isReplay: (localInstance.executionMode === "replay"),
				isActiveExists: play.status === "running", // NOTE: 現実装に依存した実装。概念的には play.status とは独立な判定が必要
				isActivePaused: play.isActivePausing,
				isForceResetOnSeek: devtoolUiStore.isForceResetOnSeek,
				disableFastForward: !!play.disableFastForward, // FIXME: 将来的には続きからプレイに対応
				onClickPauseActive: operator.localInstance.togglePause,
				onClickSavePlaylog: operator.play.downloadPlaylog,
				onClickUploadPlaylog: operator.uploadPlaylog,
				onClickForceResetOnSeek: operator.devtool.toggleForceResetOnSeek,
				onProgressChange: operator.localInstance.previewSeekTo,
				onProgressCommit: operator.localInstance.seekTo,
				onClickPause: operator.localInstance.togglePause,
				onClickFastForward: operator.localInstance.switchToRealtime,
				onHoverStartPoint: operator.devtool.setHoveredStartPointIndex,
				onJumpWithStartPoint: operator.localInstance.jumpToStartPointOfIndex,
				onDumpStartPoint: operator.devtool.dumpStartPointOfIndex
			}}
			entityTreeDevtoolProps={{
				entityTrees: devtoolUiStore.entityTrees,
				entityTreeStateTable: devtoolUiStore.entityTreeStateTable,
				selectedEntityId: devtoolUiStore.selectedEntityId,
				isSelectingEntity: devtoolUiStore.isSelectingEntity,
				showsHidden: devtoolUiStore.showsHiddenEntity,
				onClickDump: operator.devtool.dumpSelectedEntity,
				onChangeShowsHidden: operator.devtool.toggleShowHiddenEntity,
				onClickSelectEntity: operator.devtool.startEntitySelection,
				onClickUpdateEntityTrees: operator.devtool.updateEntityTrees,
				onClickToggleOpenEntityChildren: operator.devtool.toggleOpenEntityTreeChildren,
				onClickEntityItem: operator.devtool.selectEntityByEDumpItem,
				onMouseOverEntityItem: operator.devtool.setHighlightedEntity,
				onMouseLeaveEntityItem: operator.devtool.clearHighlightedEntity
			}}
			niconicoDevtoolProps={{
				isAutoSendEvent: devtoolUiStore.isAutoSendEvent,
				emulatingShinichibaMode: devtoolUiStore.emulatingShinichibaMode,
				totalTimeLimitInputValue: devtoolUiStore.totalTimeLimitInputValue,
				totalTimeLimit: devtoolUiStore.totalTimeLimit!,
				playDuration: play.duration,
				usePreferredTimeLimit: devtoolUiStore.usePreferredTotalTimeLimit,
				stopsGameOnTimeout: devtoolUiStore.stopsGameOnTimeout,
				score: devtoolUiStore.score,
				playThreshold: devtoolUiStore.playThreshold,
				clearThreshold: devtoolUiStore.clearThreshold,
				preferredTotalTimeLimit: devtoolUiStore.preferredTotalTimeLimit,
				onAutoSendEventsChanged: operator.devtool.toggleAutoSendEvents,
				onModeSelectChanged: operator.devtool.setSupportedMode,
				onUsePreferredTotalTimeLimitChanged: operator.devtool.toggleUsePreferredTotalTimeLimit,
				onUseStopGameChanged: operator.devtool.toggleUseStopGame,
				onTotalTimeLimitInputValueChanged: operator.devtool.setTotalTimeLimitInputValue
			}}
		/>;
	}
});
