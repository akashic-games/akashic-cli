import { observer } from "mobx-react";
import * as React from "react";
import type { PlayerInfoResolverDialogProps } from "../molecule/PlayerInfoResolverDialog";
import { PlayerInfoResolverDialog } from "../molecule/PlayerInfoResolverDialog";
import type { ProfilerCanvasProps } from "../molecule/ProfilerCanvas";
import { ProfilerCanvas } from "../molecule/ProfilerCanvas";
import styles from "./GameScreen.module.css";

export interface GameScreenProps {
	showsBackgroundImage: boolean;
	showsBackgroundColor: boolean;
	showsGrid: boolean;
	showsDesignGuideline: boolean;
	backgroundImage: string | null;
	backgroundColor: string | null;
	gameWidth: number;
	gameHeight: number;
	screenElement: HTMLElement;
	playerInfoResolverDialogProps?: PlayerInfoResolverDialogProps;
	profilerCanvasProps?: ProfilerCanvasProps;
	shouldStopPropagationFunc: () => boolean;
	onMouseMoveCapture?: (p: { x: number; y: number }) => void;
	onClickCapture?: (p: { x: number; y: number }) => void;
}

export const GameScreen = observer(class GameScreen extends React.Component<GameScreenProps, {}> {
	render(): React.ReactNode {
		const {
			showsBackgroundImage: showsBgImage,
			backgroundImage: bgImage,
			showsBackgroundColor: showsBgColor,
			backgroundColor: bgColor,
			showsGrid,
			showsDesignGuideline,
			gameWidth,
			gameHeight,
			playerInfoResolverDialogProps,
			profilerCanvasProps
		} = this.props;
		const bgImageStyle = (showsBgImage && !bgImage) ?  (" " + styles["pseudo-transparent-bg"]) : "";
		return <div className={styles["game-screen"]} style={{ width: gameWidth, height: gameHeight }}>
			{
				// TODO: .bg-image の恐らく不要な z-index をなくせば背景色の描画に .game-screen の backgroundColor を利用でき、この div は削除できる
				(showsBgColor) ?
					<div
						className={styles["bg-image"]}
						style={{
							width: gameWidth,
							height: gameHeight,
							backgroundColor: bgColor ?? undefined
						}}
					/> :
					null
			}
			{
				(showsBgImage && bgImage) ?
					<img src={bgImage} className={styles["bg-image"] + " external-ref_img_background"}/> :
					null
			}
			<div className={styles["game-content"] + bgImageStyle + " external-ref_div_game-content"} ref={this._onRef} />
			{
				showsGrid ?
					<canvas
						className={styles["grid-canvas"] + " external-ref_canvas_grid"}
						style={{ width: gameWidth, height: gameHeight }}
						ref={this._createGridCanvas}/> :
					null
			}
			{
				playerInfoResolverDialogProps ?
					<div className={styles["dialog-wrapper"] + " external-ref_div_player-info-dialog"}>
						<PlayerInfoResolverDialog {...playerInfoResolverDialogProps} />
					</div> :
					null
			}
			{
				showsDesignGuideline ?
					<img src={"/public/img/design-guideline.png"}
						className={styles["design-guideline"] + " external-ref_div_design-guideline"}
						style={this._getDesignGuideLineStyle()}/> :
					null
			}
			{
				// TODO: プロファイラーの位置を調整する。横長のままセンターラインをゲーム画面と合わせるか、縦長にしてゲーム画面の右側に置く。
				profilerCanvasProps ?
					<div className={"external-ref_div_profiler-canvas"}>
						<ProfilerCanvas {...profilerCanvasProps} />
					</div> :
					null
			}
		</div>;
	}

	private _stopPropagationIfNeeded = (ev: MouseEvent): void => {
		if (this.props.shouldStopPropagationFunc())
			ev.stopPropagation();
	};

	private _onMouseMoveCapture = (ev: MouseEvent): void => {
		this._stopPropagationIfNeeded(ev);
		this.props.onMouseMoveCapture?.({ x: ev.offsetX, y: ev.offsetY });
	};

	private _onClickCapture = (ev: MouseEvent): void => {
		this._stopPropagationIfNeeded(ev);
		this.props.onClickCapture?.({ x: ev.offsetX, y: ev.offsetY });
	};

	private _onRef = (elem: HTMLDivElement): void => {
		if (elem) {
			elem.appendChild(this.props.screenElement);

			// NOTE: 意図して mousedown などを使い、React の onMouseDownCapture を使っていないことに注意。
			// AGV 内の mousedown と相性が悪いらしく、祖先要素に onMouseDownCapture をつけても
			// capture できないことへの暫定回避。
			elem.addEventListener("mousedown", this._stopPropagationIfNeeded, true);
			elem.addEventListener("mousemove", this._onMouseMoveCapture, true);
			elem.addEventListener("mouseup", this._stopPropagationIfNeeded, true);
			elem.addEventListener("click", this._onClickCapture, true);
		}
	};

	private _createGridCanvas = (gridCanvas: HTMLCanvasElement): void => {
		if (!gridCanvas)
			return;

		gridCanvas.width = this.props.gameWidth;
		gridCanvas.height = this.props.gameHeight;
		const context = gridCanvas.getContext("2d")!;
		context.save();
		context.strokeStyle = "#CCC";
		context.setLineDash([3, 3]);
		this._drawGridLine(context, 20, 20);
		context.strokeStyle = "#AAA";
		context.setLineDash([]);
		this._drawGridLine(context, 100, 100);
		context.restore();
	};

	private _drawGridLine = (context: CanvasRenderingContext2D, gridWidth: number, gridHeight: number): void => {
		context.beginPath();
		for (let x = 0.5; x <= this.props.gameWidth; x += gridWidth) {
			context.moveTo(x, 0);
			context.lineTo(x, this.props.gameHeight);
		}
		for (let y = 0.5; y <= this.props.gameHeight; y += gridHeight) {
			context.moveTo(0, y);
			context.lineTo(this.props.gameWidth, y);
		}
		context.stroke();
	};

	private _getDesignGuideLineStyle = (): { width: number; height: number; top: number; left: number } => {
		const aspectRatioForHeight = 9 / 16;
		const isHorizontal = aspectRatioForHeight * this.props.gameWidth >= this.props.gameHeight;
		const size = isHorizontal ? this.props.gameWidth : this.props.gameHeight;
		if (isHorizontal) {
			const height = aspectRatioForHeight * size;
			return {
				width: size,
				height: height,
				top: (this.props.gameHeight - height) / 2,
				left: 0
			};
		} else {
			const width = (1 / aspectRatioForHeight) * size;
			return {
				width: width,
				height: size,
				top: 0,
				left: (this.props.gameWidth - width) / 2
			};
		}
	};
});

