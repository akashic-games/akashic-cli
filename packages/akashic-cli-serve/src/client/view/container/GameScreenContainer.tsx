import type { NormalizedSandboxConfiguration } from "@akashic/sandbox-configuration";
import { observer } from "mobx-react";
import * as React from "react";
import type { GameViewManager } from "../../akashic/GameViewManager.js";
import type { Operator } from "../../operator/Operator.js";
import type { LocalInstanceEntity } from "../../store/LocalInstanceEntity.js";
import type { Store } from "../../store/Store.js";
import type { PlayerInfoResolverDialogProps } from "../molecule/PlayerInfoResolverDialog.js";
import type { ProfilerCanvasProps } from "../molecule/ProfilerCanvas.js";
import { GameScreen } from "../organism/GameScreen.js";

export interface GameScreenContainerProps {
	sandboxConfig: NormalizedSandboxConfiguration;
	store: Store;
	localInstance: LocalInstanceEntity;
	gameViewManager: GameViewManager;
	operator: Operator;
}

export const GameScreenContainer = observer(class GameScreenContainer extends React.Component<GameScreenContainerProps, {}> {
	render(): React.ReactNode {
		const { toolBarUiStore } = this.props.store;
		return <GameScreen
			backgroundImage={this.props.sandboxConfig.displayOptions.backgroundImage ?? null}
			backgroundColor={this.props.sandboxConfig.displayOptions.backgroundColor ?? null}
			showsGrid={toolBarUiStore.showsGrid}
			showsBackgroundImage={toolBarUiStore.showsBackgroundImage}
			showsBackgroundColor={toolBarUiStore.showsBackgroundColor}
			showsDesignGuideline={toolBarUiStore.showsDesignGuideline}
			gameWidth={this.props.store.gameViewSize.width}
			gameHeight={this.props.store.gameViewSize.height}
			screenElement={this.props.gameViewManager.getRootElement()}
			playerInfoResolverDialogProps={this._makePlayerInfoResolverDialogProps()}
			profilerCanvasProps={this._makeProfilerCanvasProps()}
			shouldStopPropagationFunc={this._handleShouldStopPropgation}
			onMouseMoveCapture={this._handleMouseMoveCapture}
			onClickCapture={this._handleClickCapture}
		/>;
	}

	private _handleShouldStopPropgation = (): boolean => {
		return this.props.store.devtoolUiStore.isSelectingEntity;
	};

	private _handleMouseMoveCapture = (p: { x: number; y: number}): void => {
		if (!this.props.store.devtoolUiStore.isSelectingEntity)
			return;
		this.props.operator.devtool.selectEntityByPoint(p.x, p.y);
	};

	private _handleClickCapture = (p: { x: number; y: number}): void => {
		if (!this.props.store.devtoolUiStore.isSelectingEntity)
			return;
		this.props.operator.devtool.finishEntitySelection(p.x, p.y);
	};

	private _makePlayerInfoResolverDialogProps = (): PlayerInfoResolverDialogProps | undefined => {
		const resolverUiStore = this.props.store.playerInfoResolverUiStore;
		return resolverUiStore.isDisplayingResolver ? {
			remainingSeconds: resolverUiStore.remainingSeconds,
			name: resolverUiStore.name,
			guestName: resolverUiStore.guestName,
			onClick: resolverUiStore.finishDialog
		} : undefined;
	};

	private _makeProfilerCanvasProps = (): ProfilerCanvasProps | undefined => {
		const { toolBarUiStore, profilerStore } = this.props.store;
		return toolBarUiStore.showsProfiler ? {
			profilerDataArray: profilerStore.profilerDataArray,
			profilerStyleSetting: profilerStore.profilerStyleSetting,
			profilerWidth: profilerStore.profilerWidth,
			profilerHeight: profilerStore.profilerHeight
		} : undefined;
	};
});

