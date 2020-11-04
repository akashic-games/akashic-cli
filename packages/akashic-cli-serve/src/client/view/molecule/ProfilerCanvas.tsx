import * as React from "react";
import { observer } from "mobx-react";
import { ProfilerData, ProfilerSetting } from "../../common/types/Profiler";

export interface ProfilerCanvasProps {
	profilerDataArray: ProfilerData[];
	profilerSetting: ProfilerSetting;
	canvasWidth: number;
	canvasHeight: number;
}
@observer
export class ProfilerCanvas extends React.Component<ProfilerCanvasProps, {}> {
	private profilerCanvasContext: CanvasRenderingContext2D|null = null;

	componentDidMount(): void {
		if (!this.profilerCanvasContext) {
			return;
		}
		this.profilerCanvasContext.font = this.props.profilerSetting.fontSize + "px sans-serif";
	}

	componentDidUpdate(): void {
		if (!this.profilerCanvasContext) {
			return;
		}
		const setting = this.props.profilerSetting;
		const deltaX = setting.align === "vertical" ? 0 : setting.width + setting.margin;
		const deltaY = setting.align === "vertical" ? setting.height + setting.margin : 0;
		for (let index = 0; index < this.props.profilerDataArray.length; index++) {
			const profilerData = this.props.profilerDataArray[index];
			const x = index * deltaX;
			const y = index * deltaY;
			this.profilerCanvasContext.fillStyle = setting.bgColor;
			this.profilerCanvasContext.fillRect(x, y, setting.width, setting.height);
			this.profilerCanvasContext.fillStyle = setting.graphColor;
			const min = profilerData.min;
			const max = profilerData.max;
			const areaHeight = setting.height - setting.graphPadding * 2;
			const rate = max > areaHeight ? areaHeight / max : 1;
			for (let i = 0; i < profilerData.data.length; ++i) {
				const height = profilerData.data[i] * rate;
				this.profilerCanvasContext.fillRect(
					x + setting.width - i * (setting.graphWidth + setting.graphWidthMargin) - setting.graphWidth - setting.graphPadding,
					y + setting.height - height - setting.graphPadding,
					setting.graphWidth,
					height
				);
			}
			const valueOffsetX = setting.width * 0.6;
			const maxWidth = valueOffsetX - setting.padding;
			const maxValueWidth = (setting.width - valueOffsetX) - setting.padding;
			this.drawText(
				profilerData.name + ":",
				x + setting.padding,
				y + setting.padding + setting.fontSize,
				setting.fontColor,
				maxWidth
			);
			if (profilerData.data.length > 0) {
				this.drawText(
					profilerData.data[0].toFixed(profilerData.fixed),
					x + valueOffsetX,
					y + setting.padding + setting.fontSize,
					setting.fontColor,
					maxValueWidth
				);
			}
			this.drawText(
				max.toFixed(profilerData.fixed),
				x + valueOffsetX,
				y + setting.padding + setting.fontSize * 2,
				setting.fontMaxColor,
				maxValueWidth
			);
			this.drawText(
				min.toFixed(profilerData.fixed),
				x + valueOffsetX,
				y + setting.padding + setting.fontSize * 3,
				setting.fontMinColor,
				maxValueWidth
			);
			this.drawText(
				" " + profilerData.min.toFixed(0) + "-" + profilerData.max.toFixed(0),
				x + setting.padding,
				y + setting.padding + setting.fontSize * 2.5,
				setting.fontMinMaxColor,
				maxWidth
			);
		}
	}

	render(): React.ReactNode {
		return <div id="profiler-canvas">
				<canvas
					className="external-ref_profiler_canvas"
					width={ this.props.canvasWidth }
					height={ this.props.canvasHeight }
					style={{ width: this.props.canvasWidth, height: this.props.canvasHeight }}
					ref={ node => {
						if (node) this.profilerCanvasContext = node.getContext("2d");
					}}/>
		</div>;
	}

	private drawText = (text: string, x: number, y: number, color: string, maxWidth: number) => {
		if (!this.profilerCanvasContext) {
			return;
		}
		this.profilerCanvasContext.fillStyle = color;
		this.profilerCanvasContext.fillText(text, x, y, maxWidth);
	}
}
