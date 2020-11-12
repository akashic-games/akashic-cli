import * as React from "react";
import { observer } from "mobx-react";
import { ProfilerData, ProfilerStyleSetting } from "../../common/types/Profiler";

export interface ProfilerCanvasProps {
	profilerDataArray: ProfilerData[];
	profilerStyleSetting: ProfilerStyleSetting;
}

@observer
export class ProfilerCanvas extends React.Component<ProfilerCanvasProps, {}> {
	private profilerCanvasContext: CanvasRenderingContext2D|null = null;

	componentDidMount(): void {
		this.updateProfiler();
	}

	componentDidUpdate(): void {
		this.updateProfiler();
	}

	render(): React.ReactNode {
		const setting = this.props.profilerStyleSetting;
		const profilerHeight = this.getProfilerHeight();
		const profilersCount = Object.keys(this.props.profilerDataArray).length;
		const profilerCanvasWidth =
			setting.align === "vertical" ? setting.width : (setting.width + setting.margin) * profilersCount - setting.margin;
		const profilerCanvasHeight =
			setting.align === "vertical" ? (profilerHeight + setting.margin) * profilersCount - setting.margin : profilerHeight;
		return <div id="profiler-canvas">
			<canvas
				className="external-ref_profiler_canvas"
				width={ profilerCanvasWidth }
				height={ profilerCanvasHeight }
				style={{ width: profilerCanvasWidth, height: profilerCanvasHeight }}
				ref={ node => {
					if (node) this.profilerCanvasContext = node.getContext("2d");
				}}
			/>
		</div>;
	}

	private updateProfiler = (): void => {
		if (!this.profilerCanvasContext) {
			return;
		}
		const setting = this.props.profilerStyleSetting;
		const profilerHeight = this.getProfilerHeight();
		this.profilerCanvasContext.font = setting.fontSize + "px sans-serif";
		const deltaX = setting.align === "vertical" ? 0 : setting.width + setting.margin;
		const deltaY = setting.align === "vertical" ? profilerHeight + setting.margin : 0;
		for (let index = 0; index < this.props.profilerDataArray.length; index++) {
			const profilerData = this.props.profilerDataArray[index];
			const x = index * deltaX;
			const y = index * deltaY;
			this.profilerCanvasContext.fillStyle = setting.bgColor;
			this.profilerCanvasContext.fillRect(x, y, setting.width, profilerHeight);
			this.profilerCanvasContext.fillStyle = setting.graphColor;
			// 表示するプロファイラデータの個数とmax/minを算出
			let min = Number.MAX_VALUE;
			let max = 0;
			let showedDataCount = profilerData.data.length;
			for (let i = 0; i < profilerData.data.length; ++i) {
				const data = profilerData.data[i];
				if (data < min) {
					min = data;
				}
				if (data > max) {
					max = data;
				}
				const offsetX =
					setting.width - i * (setting.graphWidth + setting.graphWidthMargin) - setting.graphWidth - setting.graphPadding;
				if (offsetX < setting.graphWidth + setting.graphPadding / 2) {
					showedDataCount = i;
					break;
				}
			}
			const areaHeight = profilerHeight - setting.graphPadding * 2;
			const rate = max > areaHeight ? areaHeight / max : 1;
			for (let i = 0; i < showedDataCount; ++i) {
				const height = profilerData.data[i] * rate;
				this.profilerCanvasContext.fillRect(
					x + setting.width - i * (setting.graphWidth + setting.graphWidthMargin) - setting.graphWidth - setting.graphPadding,
					y + profilerHeight - height - setting.graphPadding,
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

	private getProfilerHeight = () => {
		const setting = this.props.profilerStyleSetting;
		return setting.fontSize * 3 +  setting.padding * 2;
	}

	private drawText = (text: string, x: number, y: number, color: string, maxWidth: number): void => {
		if (!this.profilerCanvasContext) {
			return;
		}
		this.profilerCanvasContext.fillStyle = color;
		this.profilerCanvasContext.fillText(text, x, y, maxWidth);
	}
}
