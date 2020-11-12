export type ProfilerName = "fps" | "skipped" | "interval" | "frame" | "rendering";

export interface ProfilerStyleSetting {
	width: number; // heightは後から算出されるためwidthしか定義していない
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

export interface ProfilerValue {
	/**
	 * ｀interval｀ の区間において、描画がスキップされたフレームの数。
	 */
	skippedFrameCount: ProfilerValueResult;

	/**
	 * ｀interval｀ の区間における、フレーム描画間隔。
	 */
	rawFrameInterval: ProfilerValueResult;

	/**
	 * ｀interval｀ の区間における、1秒あたりの描画回数 (FPS)。
	 */
	framePerSecond: ProfilerValueResult;

	/**
	 * ｀interval｀ の区間において、フレームの実行に要した時間。
	 */
	frameTime: ProfilerValueResult;

	/**
	 * ｀interval｀ の区間において、フレームの描画に要した時間。
	 */
	renderingTime: ProfilerValueResult;
}

export interface ProfilerValueResult {
	ave: number;
	max: number;
	min: number;
}
