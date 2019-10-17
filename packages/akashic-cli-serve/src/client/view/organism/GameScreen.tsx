import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./GameScreen.css";

export interface GameScreenProps {
	showsBackgroundImage: boolean;
	showsGrid: boolean;
	backgroundImage: string | null;
	gameWidth: number;
	gameHeight: number;
	screenElement: HTMLElement;
	shouldStopPropagationFunc?: () => boolean;
	onMouseMoveCapture?: (p: { x: number, y: number }) => void;
	onClickCapture?: (p: { x: number, y: number }) => void;
}

@observer
export class GameScreen extends React.Component<GameScreenProps, {}> {
	render(): React.ReactNode {
		const { showsBackgroundImage: showsBgImage, backgroundImage: bgImage, showsGrid, gameWidth, gameHeight } = this.props;
		const bgImageStyle = (showsBgImage && !bgImage) ?  (" " + styles["pseudo-transparent-bg"]) : "";
		return (
			<div
				className={styles["game-screen"]}
				style={{ width: gameWidth, height: gameHeight }}
				onMouseMoveCapture={this._onMouseMoveCapture}
				onMouseDownCapture={this._onMouseDownCapture}
				onMouseUpCapture={this._onMouseUpCapture}
				onClickCapture={this._onClickCapture}
			>
				{
					(showsBgImage && bgImage) ?
						<img src={bgImage} className={styles["bg-image"]}/> :
						null
				}
				<div className={styles["game-content"] + bgImageStyle} ref={this._onRef} />
				{
					showsGrid ?
						<canvas
							id="gridCanvas"
							className={styles["grid-canvas"]}
							style={{ width: gameWidth, height: gameHeight }}
							ref={this._createGridCanvas}/> :
						null
				}
			</div>
		);
	}

	private _stopPropagationIfNeeded = (ev: React.MouseEvent<HTMLDivElement>): void => {
		const shouldStopFunc = this.props.shouldStopPropagationFunc;
		if (shouldStopFunc && shouldStopFunc()) {
			ev.stopPropagation();
		}
	}

	private _onMouseDownCapture = (ev: React.MouseEvent<HTMLDivElement>): void => {
		// TODO なぜかここには到達しない＝エンティティ選択のクリックがコンテンツに通知されてしまっている……
		this._stopPropagationIfNeeded(ev);
	}

	private _onMouseUpCapture = (ev: React.MouseEvent<HTMLDivElement>): void => {
		this._stopPropagationIfNeeded(ev);
	}

	private _onMouseMoveCapture = (ev: React.MouseEvent<HTMLDivElement>): void => {
		this._stopPropagationIfNeeded(ev);
		this.props.onMouseMoveCapture({ x: ev.nativeEvent.offsetX, y: ev.nativeEvent.offsetY });
	}

	private _onClickCapture = (ev: React.MouseEvent<HTMLDivElement>): void => {
		this._stopPropagationIfNeeded(ev);
		this.props.onClickCapture({ x: ev.nativeEvent.offsetX, y: ev.nativeEvent.offsetY });
	}

	private _onRef = (elem: HTMLDivElement): void => {
		if (elem) {
			elem.appendChild(this.props.screenElement);
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
