import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ContentDisplayOption.css";

export interface ContentDisplayOptionProps {
	showsBgImage: boolean;
	showsGridCanvas: boolean;
	backgroundImage: string;
	gameWidth: number;
	gameHeight: number;
}

@observer
export class ContentDisplayOption extends React.Component<ContentDisplayOptionProps, {}> {
	render(): React.ReactNode {
		const gridDisplay = this.props.showsGridCanvas ? "block" : "none";
		return <div>
			{
				this.props.showsBgImage ?
					<img src={this.props.backgroundImage} className={styles["bg-image"]}/> :
					null
			}
			{/* 重ねて表示するためにcanvasDOMを常にコンテンツDOMの前に置いておく必要があるので表示非表示切り替えはstyle属性で行う */}
			<canvas
				id="gridCanvas"
				className={styles["grid-canvas"]}
				style={{ width: this.props.gameWidth + "px", height: this.props.gameHeight + "px", display: gridDisplay}}
				ref={this._createGridCanvas} />
		</div>;
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

	private _drawGridLine(context: CanvasRenderingContext2D, gridWidth: number, gridHeight: number) {
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
