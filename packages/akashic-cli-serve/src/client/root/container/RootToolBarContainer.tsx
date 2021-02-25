import * as React from "react";
import { observer } from "mobx-react";
import { ServiceType } from "@akashic/akashic-cli-commons";
import { PlayEntity } from "../../store/PlayEntity";
import { RootOperator } from "../operator/RootOperator";
import { PlayControlPropsData } from "../../view/molecule/PlayControl";
import { RootToolBar } from "../../view/organism/RootToolBar";
import { RootFrameStore } from "../../store/RootFrameStore";

export interface RootToolBarContainerProps {
	play: PlayEntity;
	operator: RootOperator;
	store: RootFrameStore;
	targetService: ServiceType;
}

@observer
export class RootToolBarContainer extends React.Component<RootToolBarContainerProps, {}> {
	render(): React.ReactNode {
		const { targetService } = this.props;
		return <RootToolBar
			makePlayControlProps={this._makePlayControlProps}
			targetService={targetService}
		/>;
	}

	private _makePlayControlProps = (): PlayControlPropsData => {
		const { play, store, operator } = this.props;
		return {
			playbackRate: play.activePlaybackRate,
			isActivePausing: play.isActivePausing,
			disablesFrameAdd: store.panes.length >= 4,
			onClickReset: operator.restartWithNewPlay,
			onClickActivePause: operator.play.togglePauseActive,
			onClickAddInstance: operator.play.openNewClientInstance,
			onClickAddFrame: operator.play.openNewClientFrame,
			onClickStep: operator.play.step
		};
	}
}
