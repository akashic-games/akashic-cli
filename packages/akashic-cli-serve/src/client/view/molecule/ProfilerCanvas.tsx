import { autorun } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import type { ProfilerData, ProfilerStyleSetting } from "../../common/types/Profiler";

export interface ProfilerCanvasProps {
	profilerDataArray: ProfilerData[];
	profilerStyleSetting: ProfilerStyleSetting;
	profilerWidth: number; // プロファイラ１つ分の横幅
	profilerHeight: number; // プロファイラ１つ分の縦幅
}

export const ProfilerCanvas = observer(class ProfilerCanvas extends React.Component<ProfilerCanvasProps, {}> {
	private profilerCanvasContext: CanvasRenderingContext2D|null = null;
	private disposeAutoRun: (() => void) | null = null;

	// TODO: Canvas ではなく DOM で描画するようにして autorun() を利用しないようにする
	render(): React.ReactNode {
		const setting = this.props.profilerStyleSetting;
		const profilerWidth = this.props.profilerWidth;
		const profilerHeight = this.props.profilerHeight;
		const profilersCount = Object.keys(this.props.profilerDataArray).length;
		// Canvas領域のサイズは外部から指定されるプロファイラ1つ分のサイズによって決まる
		// TODO: プロファイラ１つ分のサイズではなくCanvas領域のサイズを外部から指定できるようにする
		const profilerCanvasWidth =
			setting.align === "vertical" ? profilerWidth : (profilerWidth + setting.margin) * profilersCount - setting.margin;
		const profilerCanvasHeight =
			setting.align === "vertical" ? (profilerHeight + setting.margin) * profilersCount - setting.margin : profilerHeight;
		return <div id="profiler-canvas">
			<canvas
				className="external-ref_profiler_canvas"
				width={ profilerCanvasWidth }
				height={ profilerCanvasHeight }
				style={{ width: profilerCanvasWidth, height: profilerCanvasHeight }}
				ref={ node => {
					if (node) {
						this.profilerCanvasContext = node.getContext("2d");
						this.disposeAutoRun = autorun(() => {
							this.renderProfiler();
						});
					} else {
						this.profilerCanvasContext = null;
						if (this.disposeAutoRun) {
							this.disposeAutoRun();
							this.disposeAutoRun = null;
						}
					}
				}}
			/>
		</div>;
	}

	private renderProfiler = (): void => {
		if (!this.profilerCanvasContext) {
			return;
		}
		const setting = this.props.profilerStyleSetting;
		const profilerWidth = this.props.profilerWidth;
		const profilerHeight = this.props.profilerHeight;
		this.profilerCanvasContext.font = setting.fontSize + "px sans-serif";
		const deltaX = setting.align === "vertical" ? 0 : profilerWidth + setting.margin;
		const deltaY = setting.align === "vertical" ? profilerHeight + setting.margin : 0;
		for (let index = 0; index < this.props.profilerDataArray.length; index++) {
			const profilerData = this.props.profilerDataArray[index];
			const x = index * deltaX;
			const y = index * deltaY;
			this.profilerCanvasContext.fillStyle = setting.bgColor;
			this.profilerCanvasContext.fillRect(x, y, profilerWidth, profilerHeight);
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
					profilerWidth - i * (setting.graphWidth + setting.graphWidthMargin) - setting.graphWidth - setting.graphPadding;
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
					x + profilerWidth - i * (setting.graphWidth + setting.graphWidthMargin) - setting.graphWidth - setting.graphPadding,
					y + profilerHeight - height - setting.graphPadding,
					setting.graphWidth,
					height
				);
			}
			const valueOffsetX = profilerWidth * 0.6;
			const maxWidth = valueOffsetX - setting.padding;
			const maxValueWidth = (profilerWidth - valueOffsetX) - setting.padding;
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
	};

	private drawText = (text: string, x: number, y: number, color: string, maxWidth: number): void => {
		if (!this.profilerCanvasContext) {
			return;
		}
		this.profilerCanvasContext.fillStyle = color;
		this.profilerCanvasContext.fillText(text, x, y, maxWidth);
	};
});

