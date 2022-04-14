import { observer } from "mobx-react";
import * as React from "react";
import type { SandboxConfig } from "../../../common/types/SandboxConfig";
import type { GameViewManager } from "../../akashic/GameViewManager";
import type { Operator } from "../../operator/Operator";
import type { DevtoolUiStore } from "../../store/DevtoolUiStore";
import type { LocalInstanceEntity } from "../../store/LocalInstanceEntity";
import type { PlayerInfoResolverUiStore } from "../../store/PlayerInfoResolverUiStore";
import type { ProfilerStore } from "../../store/ProfilerStore";
import type { ToolBarUiStore } from "../../store/ToolBarUiStore";
import type { PlayerInfoResolverDialogProps } from "../molecule/PlayerInfoResolverDialog";
import type { ProfilerCanvasProps } from "../molecule/ProfilerCanvas";
import { GameScreen } from "../organism/GameScreen";

export interface GameScreenContainerProps {
	sandboxConfig: SandboxConfig;
	toolBarUiStore: ToolBarUiStore;
	devtoolUiStore: DevtoolUiStore;
	playerInfoResolverUiStore: PlayerInfoResolverUiStore;
	profilerStore: ProfilerStore;
	localInstance: LocalInstanceEntity;
	gameViewManager: GameViewManager;
	operator: Operator;
}

@observer
export class GameScreenContainer extends React.Component<GameScreenContainerProps, {}> {
	render(): React.ReactNode {
		const gameViewSize = this.props.localInstance.gameViewSize;
		let bgImage = this.props.sandboxConfig.backgroundImage;
		if (bgImage && !/^\/contents\//.test(bgImage)) {
			bgImage = `/contents/${this.props.localInstance.content.locator.contentId}/sandboxConfig/backgroundImage`;
		}
		return <GameScreen
			backgroundImage={bgImage}
			backgroundColor={this.props.sandboxConfig.backgroundColor}
			showsGrid={this.props.toolBarUiStore.showsGrid}
			showsBackgroundImage={this.props.toolBarUiStore.showsBackgroundImage}
			showsBackgroundColor={this.props.toolBarUiStore.showsBackgroundColor}
			showsDesignGuideline={this.props.toolBarUiStore.showsDesignGuideline}
			gameWidth={gameViewSize.width}
			gameHeight={gameViewSize.height}
			screenElement={this.props.gameViewManager.getRootElement()}
			playerInfoResolverDialogProps={this._makePlayerInfoResolverDialogProps()}
			profilerCanvasProps={this._makeProfilerCanvasProps()}
			shouldStopPropagationFunc={this._handleShouldStopPropgation}
			onMouseMoveCapture={this._handleMouseMoveCapture}
			onClickCapture={this._handleClickCapture}
		/>;
	}

	private _handleShouldStopPropgation = (): boolean => {
		return this.props.devtoolUiStore.isSelectingEntity;
	};

	private _handleMouseMoveCapture = (p: { x: number; y: number}): void => {
		if (!this.props.devtoolUiStore.isSelectingEntity)
			return;
		this.props.operator.devtool.selectEntityByPoint(p.x, p.y);
	};

	private _handleClickCapture = (p: { x: number; y: number}): void => {
		if (!this.props.devtoolUiStore.isSelectingEntity)
			return;
		this.props.operator.devtool.finishEntitySelection(p.x, p.y);
	};

	private _makePlayerInfoResolverDialogProps = (): PlayerInfoResolverDialogProps | undefined => {
		const resolverUiStore = this.props.playerInfoResolverUiStore;
		return resolverUiStore.isDisplayingResolver ? {
			remainingSeconds: resolverUiStore.remainingSeconds,
			name: resolverUiStore.name,
			guestName: resolverUiStore.guestName,
			onClick: resolverUiStore.finishDialog
		} : undefined;
	};

	private _makeProfilerCanvasProps = (): ProfilerCanvasProps | undefined => {
		return this.props.toolBarUiStore.showsProfiler ? {
			profilerDataArray: this.props.profilerStore.profilerDataArray,
			profilerStyleSetting: this.props.profilerStore.profilerStyleSetting,
			profilerWidth: this.props.profilerStore.profilerWidth,
			profilerHeight: this.props.profilerStore.profilerHeight
		} : undefined;
	};
}
