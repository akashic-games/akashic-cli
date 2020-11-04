// TODO: プロファイラーの項目名のネーミング
export type ProfilerName = "fps" | "skipped" | "interval" | "frame" | "rendering";

export interface ProfilerSetting {
	width: number;
	height: number;
	margin: number;
	padding: number;
	align: "vertical" | "horizontal";
	bgColor: string;
	fontColor: string;
	fontSize: number;
	fontMaxColor: string;
	fontMinColor: string;
	fontMinMaxColor: string;
	graphColor: string;
	graphWidth: number;
	graphWidthMargin: number;
	graphPadding: number;
}

export interface ProfilerData {
	name: ProfilerName;
	data: number[];
	max: number;
	min: number;
	fixed: number;
}

export interface SimpleProfilerValue {
	/**
	 * ｀interval｀ の区間において、描画がスキップされたフレームの数。
	 */
	skippedFrameCount: SimpleProfilerValueResult;

	/**
	 * ｀interval｀ の区間における、フレーム描画間隔。
	 */
	rawFrameInterval: SimpleProfilerValueResult;

	/**
	 * ｀interval｀ の区間における、1秒あたりの描画回数 (FPS)。
	 */
	framePerSecond: SimpleProfilerValueResult;

	/**
	 * ｀interval｀ の区間において、フレームの実行に要した時間。
	 */
	frameTime: SimpleProfilerValueResult;

	/**
	 * ｀interval｀ の区間において、フレームの描画に要した時間。
	 */
	renderingTime: SimpleProfilerValueResult;
}

export interface SimpleProfilerValueResult {
	ave: number;
	max: number;
	min: number;
}
