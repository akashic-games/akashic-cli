import * as React from "react";
import { observer } from "mobx-react";
import { GameViewManager } from "../../akashic/GameViewManager";
import * as styles from "./GameScreen.css";

export interface GameScreenProps {
	showsBackgroundImage: boolean;
	showsGrid: boolean;
	backgroundImage: string;
	gameWidth: number;
	gameHeight: number;
	gameViewManager: GameViewManager;
}

@observer
export class GameScreen extends React.Component<GameScreenProps, {}> {
	render(): React.ReactNode {
		const { showsBackgroundImage: showsBgImage, backgroundImage: bgImage, showsGrid, gameWidth, gameHeight } = this.props;
		const bgImageStyle = (showsBgImage && !bgImage) ?  (" " + styles["pseudo-transparent-bg"]) : "";
		return <div className={styles["game-screen"]}>
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
		</div>;
	}

	private _onRef = (elem: HTMLDivElement): void => {
		if (elem) {
			elem.appendChild(this.props.gameViewManager.getRootElement());
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
