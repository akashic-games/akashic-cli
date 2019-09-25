import * as React from "react";
import { observer } from "mobx-react";
import { GameViewManager } from "../../akashic/GameViewManager";
import * as styles from "./GameScreen.css";

export interface GameScreenProps {
	showsBgImage: boolean;
	showsGridCanvas: boolean;
	backgroundImage: string;
	gameWidth: number;
	gameHeight: number;
	gameViewManager: GameViewManager;
}

@observer
export class GameScreen extends React.Component<GameScreenProps, {}> {
	render(): React.ReactNode {
		return <div>
			{
				this.props.showsBgImage ?
					<img src={this.props.backgroundImage} className={styles["bg-image"]}/> :
					null
			}
			{
				this.props.showsGridCanvas ?
					<canvas
						id="gridCanvas"
						className={styles["grid-canvas"]}
						style={{
							width: this.props.gameWidth + "px",
							height: this.props.gameHeight + "px"
						}}
						ref={this._createGridCanvas}/> :
					null
			}
			<div ref={this._onRef} />
		</div>;
	}

	private _onRef = (elem: HTMLDivElement): void => {
		if (elem) {
			elem.appendChild(this.props.gameViewManager.getRootElement());
		}
	}

	private _createGridCanvas = (gridCanvas: HTMLCanvasElement): void => {
		if (gridCanvas) {
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
