import * as path from "path";
import { AssetConfiguration } from "@akashic/akashic-cli-commons/lib/GameConfiguration";
import { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import { invertMap, makeUnixPath } from "@akashic/akashic-cli-commons/lib/Util";
import * as readdirRecursive from "fs-readdir-recursive";
import { imageSize } from "image-size";
import { getAudioDuration } from "./getAudioDuration";

export type AssetFilter = (path: string) => boolean;

export function scriptAssetFilter(p: string): boolean {
	return /.*\.js$/i.test(p);
}

export function textAssetFilter(p: string): boolean {
	// NOTE: その他ファイルはすべてテキストアセットとして扱う
	return !(
		scriptAssetFilter(p) ||
		imageAssetFilter(p) ||
		audioAssetFilter(p)
	);
}

export function imageAssetFilter(p: string): boolean {
	return /.*\.(png|gif|jp(?:e)?g)$/i.test(p);
}

export function audioAssetFilter(p: string): boolean {
	return /.*\.(ogg|aac|mp4)$/i.test(p);
}

export interface AudioDurationInfo {
	basename: string;
	ext: string;
	duration: number;
	path: string;
}

export type AudioDurationInfoMap = { [path: string]: AudioDurationInfo };

export async function scanScriptAssets(
	baseDir: string,
	dir: string,
	_logger?: Logger,
	filter: AssetFilter = scriptAssetFilter
): Promise<AssetConfiguration[]> {
	const relativeFilePaths: string[] = readdirRecursive(path.join(baseDir, dir)).filter(filter);
	return relativeFilePaths
		.map(relativeFilePath => {
			return {
				type: "script",
				path: makeUnixPath(path.join(dir, relativeFilePath)),
				global: true
			};
		})
		.filter(asset => asset != null);
}

export async function scanTextAssets(
	baseDir: string,
	dir: string,
	_logger?: Logger,
	filter: AssetFilter = textAssetFilter
): Promise<AssetConfiguration[]> {
	const relativeFilePaths: string[] = readdirRecursive(path.join(baseDir, dir)).filter(filter);
	return relativeFilePaths
		.map(relativeFilePath => {
			return {
				type: "text",
				path: makeUnixPath(path.join(dir, relativeFilePath))
			};
		})
		.filter(asset => asset != null);
}

export async function scanImageAssets(
	baseDir: string,
	dir: string,
	logger?: Logger,
	filter: AssetFilter = imageAssetFilter
): Promise<AssetConfiguration[]> {
	const relativeFilePaths: string[] = readdirRecursive(path.join(baseDir, dir)).filter(filter);
	return relativeFilePaths
		.map(relativeFilePath => {
			const absolutePath = path.join(baseDir, dir, relativeFilePath);
			const size = imageSize(absolutePath);
			if (!size) {
				logger?.warn(`Failed to get image size. Please check ${absolutePath}`);
				return null;
			}
			return {
				type: "image",
				path: makeUnixPath(path.join(dir, relativeFilePath)),
				width: size.width,
				height: size.height
			};
		})
		.filter(asset => asset != null);
}

export async function scanAudioAssets(
	baseDir: string,
	dir: string,
	logger?: Logger,
	filter: AssetFilter = audioAssetFilter
): Promise<AssetConfiguration[]> {
	const relativeFilePaths: string[] = readdirRecursive(path.join(baseDir, dir)).filter(filter);

	const durationInfos: AudioDurationInfo[] = [];
	for (const relativeFilePath of relativeFilePaths) {
		const absolutePath = path.join(baseDir, dir, relativeFilePath);
		const ext = path.extname(absolutePath);
		const basename = path.basename(absolutePath, ext);
		const nonExtRelativeFilePath = path.join(dir, path.dirname(relativeFilePath), basename);
		const duration = await getAudioDuration(absolutePath, logger);
		durationInfos.push({
			basename,
			ext: ext,
			duration: Math.ceil(duration * 1000),
			path: makeUnixPath(nonExtRelativeFilePath)
		});
	}

	const durationRevMap = invertMap(durationInfos as any, "path");
	for (const nonExtFilePath in durationRevMap) {
		// お節介機能: 拡張子が違うだけの音声ファイル間で、500ms以上長さが違ったら警告しておく。
		// (別のファイルがまぎれているかもしれない) お節介なので数値に深い意味はない。
		if (!durationRevMap.hasOwnProperty(nonExtFilePath)) continue;
		const keys = durationRevMap[nonExtFilePath];
		const durations = keys.map(k => durationInfos[Number(k)].duration);
		const durationDiff = Math.max(...durations) - Math.min(...durations);
		if (500 < durationDiff) {
			logger?.warn(`Detected different durations between files prefixed with ${nonExtFilePath}.`);
		}
	}

	const durationMap: AudioDurationInfoMap = {};
	for (const durationInfo of durationInfos) {
		if (durationInfo.ext === ".ogg" || !durationMap[durationInfo.basename]) {
			durationMap[durationInfo.path] = durationInfo;
		}
	}

	const audioAssets: AssetConfiguration[] = [];
	for (const filePath in durationMap) {
		if (!durationMap.hasOwnProperty(filePath)) continue;
		audioAssets.push({
			type: "audio",
			path: filePath,
			systemId: "sound",
			duration: durationMap[filePath].duration
		});
	}

	return audioAssets;
}
