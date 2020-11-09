import { action, observable } from "mobx";
import { ProfilerData, ProfilerName, ProfilerSettingStyle, ProfilerValueResult } from "../common/types/Profiler";

export class GameScreenUiStore {
	@observable profilerDataArray: ProfilerData[];
	@observable profilerSetting: ProfilerSettingStyle;
	@observable profilerWidth: number;
	@observable profilerHeight: number;

	constructor() {
		this.profilerDataArray = [
			{
				name: "fps",
				data: [],
				max: 0,
				min: Number.MAX_VALUE,
				fixed: 2
			},
			{
				name: "skipped",
				data: [],
				max: 0,
				min: Number.MAX_VALUE,
				fixed: 1
			},
			{
				name: "interval",
				data: [],
				max: 0,
				min: Number.MAX_VALUE,
				fixed: 1
			},
			{
				name: "frame",
				data: [],
				max: 0,
				min: Number.MAX_VALUE,
				fixed: 1
			},
			{
				name: "rendering",
				data: [],
				max: 0,
				min: Number.MAX_VALUE,
				fixed: 1
			}
		];
		// TODO: プロファイラーのサイズ・色等の設定値をserveに適したものにする
		this.profilerSetting = {
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
		const setting = this.profilerSetting;
		setting.height =   setting.fontSize * 3 +  setting.padding * 2;
		if ( setting.align === "vertical") {
			this.profilerWidth =  setting.width;
			this.profilerHeight = (setting.height + setting.margin) * this.profilerDataArray.length - setting.margin;
		} else {
			this.profilerWidth = (setting.width + setting.margin) * this.profilerDataArray.length - setting.margin;
			this.profilerHeight = setting.height;
		}
	}

	@action
	updateProfilerData (
		name: ProfilerName,
		profileValueResult: ProfilerValueResult
	) {
		const copiedProfilerDataArray = this.profilerDataArray.slice();
		// 本来であればArray#find()を使うべきだが、ES5にない関数なので代わりにfilterを使用する
		const targetProfilers = copiedProfilerDataArray.filter(profiler => profiler.name === name);
		if (targetProfilers.length === 0) {
			return;
		}
		const profilerData = targetProfilers[0];
		profilerData.data.unshift(profileValueResult.ave);
		const setting = this.profilerSetting;
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
		this.profilerDataArray = copiedProfilerDataArray;
	}
}
