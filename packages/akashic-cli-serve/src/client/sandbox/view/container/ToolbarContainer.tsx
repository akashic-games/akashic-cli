import type { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType";
import { observer } from "mobx-react";
import * as React from "react";
import type { LocalInstanceEntity } from "../../../store/LocalInstanceEntity";
import type { PlayEntity } from "../../../store/PlayEntity";
import type { ToolBarUiStore } from "../../../store/ToolBarUiStore";
import type { DisplayOptionControlPropsData } from "../../../view/molecule/DisplayOptionControl";
import type { PlayerControlPropsData } from "../../../view/molecule/PlayerControl";
import type { Operator } from "../../operator/Operator";
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
		const { operator, toolBarUiStore, targetService } = this.props;
		return <ToolBar
			makePlayerControlProps={this._makePlayerControlProps}
			makeDisplayOptionControlProps={this._makeDisplayOptionControlProps}
			showsDevtools={toolBarUiStore.showsDevtools}
			targetService={targetService}
			onClickDevTools={operator.ui.setShowDevtools}
		/>;
	}

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

