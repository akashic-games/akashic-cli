import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as readdirRecursive from "fs-readdir-recursive";
import { imageSize } from "image-size";
import { getAudioDuration } from "./getAudioDuration";

export type AssetFilter = (path: string) => boolean;

export function scriptAssetFilter(p: string): boolean {
	return /.*\.js$/i.test(p);
}

export function textAssetFilter(p: string): boolean {
	// NOTE: その他ファイルはすべてスクリプトアセットとして扱う
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
	_logger?: cmn.Logger,
	filter: AssetFilter = scriptAssetFilter
): Promise<cmn.AssetConfiguration[]> {
	const relativeFilePaths: string[] = readdirRecursive(path.join(baseDir, dir)).filter(filter);
	return relativeFilePaths
		.map(relativeFilePath => {
			return {
				type: "script",
				path: cmn.Util.makeUnixPath(path.join(dir, relativeFilePath)),
				global: true
			};
		})
		.filter(asset => asset != null);
}

export async function scanTextAssets(
	baseDir: string,
	dir: string,
	_logger?: cmn.Logger,
	filter: AssetFilter = textAssetFilter
): Promise<cmn.AssetConfiguration[]> {
	const relativeFilePaths: string[] = readdirRecursive(path.join(baseDir, dir)).filter(filter);
	return relativeFilePaths
		.map(relativeFilePath => {
			return {
				type: "text",
				path: cmn.Util.makeUnixPath(path.join(dir, relativeFilePath))
			};
		})
		.filter(asset => asset != null);
}

export async function scanImageAssets(
	baseDir: string,
	dir: string,
	logger?: cmn.Logger,
	filter: AssetFilter = imageAssetFilter
): Promise<cmn.AssetConfiguration[]> {
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
				path: cmn.Util.makeUnixPath(path.join(dir, relativeFilePath)),
				width: size.width,
				height: size.height
			};
		})
		.filter(asset => asset != null);
}

export async function scanAudioAssets(
	baseDir: string,
	dir: string,
	logger?: cmn.Logger,
	filter: AssetFilter = audioAssetFilter
): Promise<cmn.AssetConfiguration[]> {
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
			path: cmn.Util.makeUnixPath(nonExtRelativeFilePath)
		});
	}

	const durationRevMap = cmn.Util.invertMap(durationInfos as any, "path");
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

	const audioAssets: cmn.AssetConfiguration[] = [];
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
