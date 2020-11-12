import { action, computed, observable } from "mobx";
import { ProfilerData, ProfilerName, ProfilerStyleSetting, ProfilerValueResult } from "../common/types/Profiler";

const PROFILER_DATA_LIMIT = 100;

export class ProfilerStore {
	@observable profilerDataMap: {[key: string]: ProfilerData};
	@observable profilerStyleSetting: ProfilerStyleSetting;

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
	}

	@computed
	get profilerDataArray(): ProfilerData[] {
		return Object.keys(this.profilerDataMap).map(key => this.profilerDataMap[key]);
	}

	@action
	updateProfilerData (
		name: ProfilerName,
		profileValueResult: ProfilerValueResult
	) {
		const copiedProfilerDataMap = {...this.profilerDataMap};
		const profilerData = copiedProfilerDataMap[name];
		const currentValue = profileValueResult.ave;
		profilerData.data.unshift(currentValue);
		if (profilerData.data.length > PROFILER_DATA_LIMIT) {
			profilerData.data.pop();
		}
		if (currentValue < profilerData.min) {
			profilerData.min = currentValue;
		}
		if (profilerData.max < currentValue) {
			profilerData.max = currentValue;
		}
		this.profilerDataMap = copiedProfilerDataMap;
	}
}
