import { action, computed, observable } from "mobx";
import { ProfilerData, ProfilerName, ProfilerStyleSetting, ProfilerValueResult } from "../common/types/Profiler";

export class GameScreenUiStore {
	@observable profilerDataMap: {[key: string]: ProfilerData};
	@observable profilerStyleSetting: ProfilerStyleSetting;
	@observable profilerCanvasWidth: number;
	@observable profilerCanvasHeight: number;

	constructor() {
		this.profilerDataMap = {
			fps: {
				name: "fps",
				data: [],
				max: 0,
				min: Number.MAX_VALUE,
				fixed: 2
			},
			skipped: {
				name: "skipped",
				data: [],
				max: 0,
				min: Number.MAX_VALUE,
				fixed: 1
			},
			interval: {
				name: "interval",
				data: [],
				max: 0,
				min: Number.MAX_VALUE,
				fixed: 1
			},
			frame: {
				name: "frame",
				data: [],
				max: 0,
				min: Number.MAX_VALUE,
				fixed: 1
			},
			rendering: {
				name: "rendering",
				data: [],
				max: 0,
				min: Number.MAX_VALUE,
				fixed: 1
			}
		};
		// TODO: プロファイラーのサイズ・色等の設定値をserveに適したものにする
		this.profilerStyleSetting = {
			width: 150,
			height: 0,
			margin: 5,
			padding: 5,
			align: "horizontal",
			bgColor: "gray",
			fontColor: "white",
			fontSize: 17,
			fontMaxColor: "deeppink",
			fontMinColor: "dodgerblue",
			fontMinMaxColor: "black",
			graphColor: "lavender",
			graphWidth: 3,
			graphWidthMargin: 1,
			graphPadding: 5
		};
		const setting = this.profilerStyleSetting;
		const profilersCount = Object.keys(this.profilerDataMap).length;
		setting.height =   setting.fontSize * 3 +  setting.padding * 2;
		if ( setting.align === "vertical") {
			this.profilerCanvasWidth =  setting.width;
			this.profilerCanvasHeight = (setting.height + setting.margin) * profilersCount - setting.margin;
		} else {
			this.profilerCanvasWidth = (setting.width + setting.margin) * profilersCount - setting.margin;
			this.profilerCanvasHeight = setting.height;
		}
	}

	@computed
	get profilerDataArray(): ProfilerData[] {
		return Object.values(this.profilerDataMap);
	}

	@action
	updateProfilerData (
		name: ProfilerName,
		profileValueResult: ProfilerValueResult
	) {
		const copiedProfilerDataMap = {...this.profilerDataMap};
		const profilerData = copiedProfilerDataMap[name];
		profilerData.data.unshift(profileValueResult.ave);
		const setting = this.profilerStyleSetting;
		let min = Number.MAX_VALUE;
		let max = 0;
		for (let i = 0; i < profilerData.data.length; ++i) {
			const offsetX = setting.width - i * (setting.graphWidth + setting.graphWidthMargin) - setting.graphWidth - setting.graphPadding;
			const data = profilerData.data[i];
			if (data < min) {
				min = data;
			}
			if (data > max) {
				max = data;
			}
			if (offsetX < setting.graphWidth + setting.graphPadding / 2) {
				profilerData.data.pop();
				break;
			}
		}
		if (min < profilerData.min) profilerData.min = min;
		if (profilerData.max < max) profilerData.max = max;
		this.profilerDataMap = copiedProfilerDataMap;
	}
}
