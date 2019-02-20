import * as fs from "fs";
import * as path from "path";
import { Logger, GameConfiguration } from "@akashic/akashic-cli-commons";

enum FileType {
	Ogg,
	Mp4,
	Aac
}

class SizeResult {
	imageSize: number;
	textSize: number;
	oggAudioSize: number;
	mp4AudioSize: number;
	aacAudioSize: number;
	scriptSize: number;
	otherSize: number;
	otherDetail: {[key: string]: number};

	constructor() {
		this.imageSize = 0;
		this.textSize = 0;
		this.oggAudioSize = 0;
		this.mp4AudioSize = 0;
		this.aacAudioSize = 0;
		this.scriptSize = 0;
		this.otherSize = 0;
		this.otherDetail = { };
	}

	totalSizeOgg(): number {
		return this.imageSize + this.textSize +
			this.oggAudioSize + this.scriptSize + this.otherSize;
	}

	totalSizeAac(): number {
		return this.imageSize + this.textSize +
			this.aacAudioSize + this.scriptSize + this.otherSize;
	}

	totalSizeMp4(): number {
		return this.imageSize + this.textSize +
			this.mp4AudioSize + this.scriptSize + this.otherSize;
	}

	sumOfTable(): number {
		let sum = 0;
		Object.keys(this.otherDetail).forEach(key =>
			sum += this.otherDetail[key]
		);
		return sum;
	}
}

export interface StatSizeParameterObject {
	logger: Logger;
	basepath: string;
	game: GameConfiguration;
	limit?: string;
	raw: boolean;
}

export function size(param: StatSizeParameterObject): Promise<void> {
	const sizeResult = new SizeResult();
	return Promise.resolve()
		.then(() => sizeOfGame(param, sizeResult))
		.then(() => showSize(param, sizeResult))
		.then(() => checkLimit(param, sizeResult));
}

/**
 * サイズの計測結果を表示する
 */
function showSize(param: StatSizeParameterObject, sizeResult: SizeResult): void {
	let largestFileType: FileType;
	let totalSize: number;
	if (sizeResult.oggAudioSize > sizeResult.aacAudioSize && sizeResult.oggAudioSize > sizeResult.mp4AudioSize) {
		largestFileType = FileType.Ogg;
		totalSize = sizeResult.totalSizeOgg();
	} else if (sizeResult.mp4AudioSize > sizeResult.aacAudioSize) {
		largestFileType = FileType.Mp4;
		totalSize = sizeResult.totalSizeMp4();
	} else {
		largestFileType = FileType.Aac;
		totalSize = sizeResult.totalSizeAac();
	}

	if (!param.raw) {
		const persent = (value: number) => (value / totalSize * 100).toFixed(0);
		const formatSize = (name: string, size: number) => `${name}: ${sizeToString(size)} (${persent(size)}%)`;
		param.logger.print(formatSize("image", sizeResult.imageSize));
		param.logger.print(formatSize("text", sizeResult.textSize));

		switch (largestFileType) {
			case FileType.Ogg:
				param.logger.print(formatSize("ogg audio", sizeResult.oggAudioSize));
				param.logger.print(`mp4 audio: ${sizeToString(sizeResult.mp4AudioSize)}`);
				if (sizeResult.aacAudioSize > 0) param.logger.print(`aac audio: ${sizeToString(sizeResult.aacAudioSize)}`);
				break;
			case FileType.Mp4:
				param.logger.print(`ogg audio: ${sizeToString(sizeResult.oggAudioSize)}`);
				param.logger.print(formatSize("mp4 audio", sizeResult.mp4AudioSize));
				if (sizeResult.aacAudioSize > 0) param.logger.print(`aac audio: ${sizeToString(sizeResult.aacAudioSize)}`);
				break;
			case FileType.Aac:
				param.logger.print(`ogg audio: ${sizeToString(sizeResult.oggAudioSize)}`);
				param.logger.print(`mp4 audio: ${sizeToString(sizeResult.mp4AudioSize)}`);
				if (sizeResult.aacAudioSize > 0) param.logger.print(formatSize("aac audio", sizeResult.aacAudioSize));
				break;
			default:
				throw new Error("Audio file size retrieve failed.");
		}

		param.logger.print(formatSize("script", sizeResult.scriptSize));
		param.logger.print(formatSize("other", sizeResult.otherSize));

		Object.keys(sizeResult.otherDetail).forEach(key =>
			param.logger.print(`  ${key}: ${sizeToString(sizeResult.otherDetail[key])}`)
		);
		const mark = (enabled: boolean) => enabled ? "[*]" : "[ ]";
		param.logger.print(
			`${mark(largestFileType === FileType.Ogg)} TOTAL SIZE (using ogg): ` +
			sizeToString(sizeResult.totalSizeOgg()) +
			` (${sizeResult.totalSizeOgg()}B)`
		);
		param.logger.print(
			`${mark(largestFileType === FileType.Mp4)} TOTAL SIZE (using mp4): ` +
			sizeToString(sizeResult.totalSizeMp4()) +
			` (${sizeResult.totalSizeMp4()}B)`
		);
		if (sizeResult.aacAudioSize > 0) {
			param.logger.print(
				`${mark(largestFileType === FileType.Aac)} TOTAL SIZE (using aac): ` +
				sizeToString(sizeResult.totalSizeAac()) +
				` (${sizeResult.totalSizeAac()}B)`
			);
			param.logger.warn("AAC (.aac) is deprecated. Use MP4(AAC) (.mp4) instead.");
		}
	} else {
		param.logger.print(totalSize.toString());
	}
}

/**
 * サイズの制限を超えていないことを確認する
 */
function checkLimit(param: StatSizeParameterObject, sizeResult: SizeResult): Promise<void> {
	if (param.limit == null) {
		return Promise.resolve();
	}
	const limitSize = parseSize(param.limit);
	if (limitSize == null) {
		return Promise.reject("cannot parse limit size value");
	}

	const actualSize = Math.max(sizeResult.totalSizeOgg(), sizeResult.totalSizeMp4(), sizeResult.totalSizeAac());
	if (actualSize > limitSize) {
		return Promise.reject(`file size limit exceeded (${sizeToString(actualSize - limitSize)})`);
	}
	return Promise.resolve();
}

/**
 * ゲーム全体のサイズを調べる
 */
function sizeOfGame(param: StatSizeParameterObject, sizeResult: SizeResult): Promise<void> {
	return sizeOfGameJson(param, sizeResult)
		.then(() => sequencePromise(sizeOfAssets(param, sizeResult)))
		.then(() => sequencePromise(sizeOfGlobalScripts(param, sizeResult)));
}

/**
 * game.json のサイズを調べる
 */
function sizeOfGameJson(param: StatSizeParameterObject, sizeResult: SizeResult): Promise<void> {
	return fileSize(path.join(param.basepath, "game.json"))
		.then(size => {
			sizeResult.otherSize += size;
			sizeResult.otherDetail["game.json"] = size;
		});
}

/**
 * asset のサイズを調べる
 */
function sizeOfAssets(param: StatSizeParameterObject, sizeResult: SizeResult): Promise<void>[] {
	if (param.game.assets == null) return [];
	return Object.keys(param.game.assets).map(key => {
		const asset = param.game.assets[key];
		switch (asset.type) {
			case "image":
				return fileSize(path.join(param.basepath, asset.path))
					.then(size => { sizeResult.imageSize += size; });
			case "text":
				return fileSize(path.join(param.basepath, asset.path))
					.then(size => { sizeResult.textSize += size; });
			case "script":
				return fileSize(path.join(param.basepath, asset.path))
					.then(size => { sizeResult.scriptSize += size; });
			case "audio":
				return fileSize(path.join(param.basepath, asset.path + ".ogg"))
					.then(
						size => { sizeResult.oggAudioSize += size; },
						() => { if (!param.raw) param.logger.warn(asset.path + ".ogg, No such file."); })

					.then(() => fileSize(path.join(param.basepath, asset.path + ".mp4")))
					.then(
						size => { sizeResult.mp4AudioSize += size; },
						() => {if (!param.raw) param.logger.warn(asset.path + ".mp4, No such file."); })

					.then(() => fileSize(path.join(param.basepath, asset.path + ".aac")))
					.then(
						size => { sizeResult.aacAudioSize += size; },
						() => {/* .aacファイルは存在すれば対応するが、deprecatedなのでファイルが存在しない場合でも警告を表示しない */});
			default:
				throw new Error(`${asset.type} is not a valid asset type name`);
		}
	});
}

/**
 * globalScript のサイズを調べる
 */
function sizeOfGlobalScripts(param: StatSizeParameterObject, sizeResult: SizeResult): Promise<void>[] {
	if (param.game.globalScripts == null) return [];
	return param.game.globalScripts.map((filePath: string) =>
		fileSize(path.join(param.basepath, filePath))
			.then(size => {
				sizeResult.otherSize += size;
				const key = getModuleName(filePath);
				const oldValue = sizeResult.otherDetail[key] || 0;
				sizeResult.otherDetail[key] = oldValue + size;
			})
	);
}

/**
 * ファイルのパスから表示用のモジュール名を取り出す
 */
function getModuleName(filePath: string): string {
	const result = /^node_modules\/((@(\w|-)+\/)?(\w|-)+)\//.exec(filePath);
	if (result && typeof result[1] === "string") {
		return result[1];
	} else {
		return filePath;
	}
}

/**
 * プロミスを直列化する
 */
function sequencePromise(promises: Promise<void>[]): Promise<void> {
	return promises.reduce((p0, p) => p0.then(() => p), Promise.resolve());
}

/**
 * ファイルのサイズを返す
 */
function fileSize(fullPath: string): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		fs.stat(fullPath, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result.size);
			}
		});
	});
}

/**
 * サイズを表す文字列をバイト数に変換
 * 例: "100KB" -> 102400
 */
function parseSize(str: string): number {
	const result = /^(\d+)([KMG]?)B?$/i.exec(str);
	if (result == null) {
		return null;
	}
	if (result[2]) {
		return parseInt(result[1], 10) * siUnitPrefix(result[2]);
	} else {
		return parseInt(result[1], 10);
	}
}

/**
 * バイト数を人間が分かりやすい文字列に変換
 */
function sizeToString(size: number): string {
	const list = ["G", "M", "K"];
	for (let i = 0; i < list.length; ++i) {
		const value = siUnitPrefix(list[i]);
		if (size >= value) {
			return (size / value).toFixed(2) + list[i] + "B";
		}
	}
	return size + "B";
}

/**
 * SI接頭辞の乗数
 */
function siUnitPrefix(prefix: string): number {
	const map: {[key: string]: number} = {
		k: 1024,
		m: 1024 * 1024,
		g: 1024 * 1024 * 1024
	};
	const value = map[prefix.toLowerCase()];
	if (value == null) {
		throw new Error("unknown si unit prefix");
	}
	return value;
}
