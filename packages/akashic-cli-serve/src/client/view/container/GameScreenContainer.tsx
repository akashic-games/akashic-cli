import * as React from "react";
import { observer } from "mobx-react";
import { SandboxConfig } from "../../../common/types/SandboxConfig";
import { GameViewManager } from "../../akashic/GameViewManager";
import { LocalInstanceEntity } from "../../store/LocalInstanceEntity";
import { ToolBarUiStore } from "../../store/ToolBarUiStore";
import { DevtoolUiStore } from "../../store/DevtoolUiStore";
import { Operator } from "../../operator/Operator";
import { GameScreen } from "../organism/GameScreen";

export interface GameScreenContainerProps {
	sandboxConfig: SandboxConfig;
	toolBarUiStore: ToolBarUiStore;
	devtoolUiStore: DevtoolUiStore;
	localInstance: LocalInstanceEntity;
	gameViewManager: GameViewManager;
	operator: Operator;
}

@observer
export class GameScreenContainer extends React.Component<GameScreenContainerProps, {}> {
	render(): React.ReactNode {
		const gameViewSize = this.props.localInstance.gameViewSize;
		return <GameScreen
			backgroundImage={this.props.sandboxConfig.backgroundImage}
			showsGrid={this.props.toolBarUiStore.showsGrid}
			showsBackgroundImage={this.props.toolBarUiStore.showsBackgroundImage}
			gameWidth={gameViewSize.width}
			gameHeight={gameViewSize.height}
			screenElement={this.props.gameViewManager.getRootElement()}
			isDisplayingResolver={this.props.localInstance.coeLimitdPlugin.isDisplayingResolver}
			remainingTimeForResolver={this.props.localInstance.coeLimitdPlugin.remainingSeconds}
			shouldStopPropagationFunc={this._handleShouldStopPropgation}
			onMouseMoveCapture={this._handleMouseMoveCapture}
			onClickCapture={this._handleClickCapture}
			onClickResolver={this.props.localInstance.coeLimitdPlugin.sendName}
		/>;
	}

	private _handleShouldStopPropgation = (): boolean => {
		return this.props.devtoolUiStore.isSelectingEntity;
	}

	private _handleMouseMoveCapture = (p: { x: number, y: number}): void => {
		if (!this.props.devtoolUiStore.isSelectingEntity)
			return;
		this.props.operator.devtool.selectEntityByPoint(p.x, p.y);
	}

	private _handleClickCapture = (p: { x: number, y: number}): void => {
		if (!this.props.devtoolUiStore.isSelectingEntity)
			return;
		this.props.operator.devtool.finishEntitySelection(p.x, p.y);
	}
}
