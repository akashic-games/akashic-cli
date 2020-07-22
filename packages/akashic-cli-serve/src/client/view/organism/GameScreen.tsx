import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./GameScreen.css";
import {
	PlayerInfoResolverDialog,
	PlayerInfoResolverDialogProps
} from "../molecule/PlayerInfoResolverDialog";

export interface GameScreenProps {
	showsBackgroundImage: boolean;
	showsGrid: boolean;
	backgroundImage: string | null;
	gameWidth: number;
	gameHeight: number;
	screenElement: HTMLElement;
	playerInfoResolverDialogProps?: PlayerInfoResolverDialogProps;
	shouldStopPropagationFunc: () => boolean;
	onMouseMoveCapture?: (p: { x: number, y: number }) => void;
	onClickCapture?: (p: { x: number, y: number }) => void;
}

@observer
export class GameScreen extends React.Component<GameScreenProps, {}> {
	render(): React.ReactNode {
		const {
			showsBackgroundImage: showsBgImage,
			backgroundImage: bgImage,
			showsGrid,
			gameWidth,
			gameHeight,
			playerInfoResolverDialogProps
		 } = this.props;
		const bgImageStyle = (showsBgImage && !bgImage) ?  (" " + styles["pseudo-transparent-bg"]) : "";
		return <div className={styles["game-screen"]} style={{ width: gameWidth, height: gameHeight }}>
			{
				(showsBgImage && bgImage) ?
					<img id="bgImage" src={bgImage} className={styles["bg-image"]}/> :
					null
			}
			<div id="gameContent" className={styles["game-content"] + bgImageStyle} ref={this._onRef} />
			{
				showsGrid ?
					<canvas
						id="gridCanvas"
						className={styles["grid-canvas"]}
						style={{ width: gameWidth, height: gameHeight }}
						ref={this._createGridCanvas}/> :
					null
			}
			{
				playerInfoResolverDialogProps ?
					<div id="dialogWrapper" className={styles["dialog-wrapper"]}>
						<PlayerInfoResolverDialog {...playerInfoResolverDialogProps} />
					</div> :
					null
			}
		</div>;
	}

	private _stopPropagationIfNeeded = (ev: MouseEvent): void => {
		if (this.props.shouldStopPropagationFunc())
			ev.stopPropagation();
	}

	private _onMouseMoveCapture = (ev: MouseEvent): void => {
		this._stopPropagationIfNeeded(ev);
		this.props.onMouseMoveCapture({ x: ev.offsetX, y: ev.offsetY });
	}

	private _onClickCapture = (ev: MouseEvent): void => {
		this._stopPropagationIfNeeded(ev);
		this.props.onClickCapture({ x: ev.offsetX, y: ev.offsetY });
	}

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
	}

	private _createGridCanvas = (gridCanvas: HTMLCanvasElement): void => {
		if (!gridCanvas)
			return;

		gridCanvas.width = this.props.gameWidth;
		gridCanvas.height = this.props.gameHeight;
		const context = gridCanvas.getContext("2d");
		context.save();
		context.strokeStyle = "#CCC";
		context.setLineDash([3, 3]);
		this._drawGridLine(context, 20, 20);
		context.strokeStyle = "#AAA";
		context.setLineDash([]);
		this._drawGridLine(context, 100, 100);
		context.restore();
	}

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
	}
}
