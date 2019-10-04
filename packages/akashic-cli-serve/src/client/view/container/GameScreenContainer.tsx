import * as React from "react";
import { observer } from "mobx-react";
import { SandboxConfig } from "../../../common/types/SandboxConfig";
import { GameViewManager } from "../../akashic/GameViewManager";
import { LocalInstanceEntity } from "../../store/LocalInstanceEntity";
import { ToolBarUiStore } from "../../store/ToolBarUiStore";
import { GameScreen } from "../organism/GameScreen";

export interface GameScreenContainerProps {
	sandboxConfig: SandboxConfig;
	toolBarUiStore: ToolBarUiStore;
	localInstance: LocalInstanceEntity;
	gameViewManager: GameViewManager;
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
			gameViewManager={this.props.gameViewManager}
		/>;
	}
}
