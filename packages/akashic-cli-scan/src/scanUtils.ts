import * as path from "path";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger.js";
import { invertMap, makeUnixPath, readdirRecursive } from "@akashic/akashic-cli-commons/lib/Util.js";
import type { AssetConfiguration, AudioAssetConfigurationBase } from "@akashic/game-configuration";
import { getAudioDuration } from "./getAudioDuration.js";
import { getImageSize } from "./getImageSize.js";

export type AssetFilter = (path: string) => boolean;

export function scriptAssetFilter(p: string): boolean {
	return /.*\.js$/i.test(p);
}

export function knownExtensionAssetFilter(p: string): boolean {
	return scriptAssetFilter(p) ||
		imageAssetFilter(p) ||
		vectorImageAssetFilter(p) ||
		audioAssetFilter(p) ||
		ignoreFileFilter(p);
}

export function imageAssetFilter(p: string): boolean {
	return /.*\.(png|gif|jp(?:e)?g)$/i.test(p);
}

export function vectorImageAssetFilter(p: string): boolean {
	return /.*\.svg$/i.test(p);
}

export function audioAssetFilter(p: string): boolean {
	return /.*\.(ogg|aac|mp4|m4a)$/i.test(p);
}

export function defaultTextAssetFilter(p: string): boolean {
	return /.*\.(txt|json|asapj|asabn|asask|asaan)$/.test(p);
}

export function defaultBinaryAssetFilter (_: string): boolean {
	return false;
}

export function ignoreFileFilter(p: string): boolean {
	return /\.gitkeep$/.test(p);
}

export interface AudioDurationInfo {
	basename: string;
	ext: string;
	duration: number | undefined;
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
	return relativeFilePaths.map<AssetConfiguration>(relativeFilePath => {
		return {
			type: "script",
			path: makeUnixPath(path.join(dir, relativeFilePath)),
			global: true
		};
	});
}

export async function scanBinaryAssets(
	baseDir: string,
	dir: string,
	_logger?: Logger,
	filter: AssetFilter = defaultBinaryAssetFilter
): Promise<AssetConfiguration[]> {
	const relativeFilePaths: string[] = readdirRecursive(path.join(baseDir, dir)).filter(filter);
	return relativeFilePaths.map<AssetConfiguration>(relativeFilePath => {
		return {
			type: "binary",
			path: makeUnixPath(path.join(dir, relativeFilePath))
		};
	});
}

export async function scanTextAssets(
	baseDir: string,
	dir: string,
	_logger?: Logger,
	filter: AssetFilter = defaultTextAssetFilter
): Promise<AssetConfiguration[]> {
	const relativeFilePaths: string[] = readdirRecursive(path.join(baseDir, dir)).filter(filter);
	return relativeFilePaths.map<AssetConfiguration>(relativeFilePath => {
		return {
			type: "text",
			path: makeUnixPath(path.join(dir, relativeFilePath))
		};
	});
}

export async function scanImageAssets(
	baseDir: string,
	dir: string,
	logger?: Logger,
	filter: AssetFilter = imageAssetFilter
): Promise<AssetConfiguration[]> {
	const relativeFilePaths: string[] = readdirRecursive(path.join(baseDir, dir)).filter(filter);
	return relativeFilePaths.map(relativeFilePath => {
		const absolutePath = path.join(baseDir, dir, relativeFilePath);
		const size = getImageSize(absolutePath);
		if (!size) {
			logger?.warn(`Failed to get image size. Please check ${absolutePath}`);
			return null;
		}
		return {
			type: "image",
			path: makeUnixPath(path.join(dir, relativeFilePath)),
			width: size.width,
			height: size.height
		} as AssetConfiguration;
	})
		.filter((asset): asset is NonNullable<typeof asset> => asset != null);
}

export async function scanVectorImageAssets(
	baseDir: string,
	dir: string,
	logger?: Logger,
	filter: AssetFilter = vectorImageAssetFilter
): Promise<AssetConfiguration[]> {
	const relativeFilePaths: string[] = readdirRecursive(path.join(baseDir, dir)).filter(filter);
	return relativeFilePaths.map(relativeFilePath => {
		const absolutePath = path.join(baseDir, dir, relativeFilePath);
		const size = getImageSize(absolutePath);
		if (!size) {
			logger?.warn(
				`Failed to get vector-image size. Please check ${absolutePath}. ` +
				"Akashic Engine requires 'width' and 'height' attributes (denoted with 'px' or without units) in 'svg' element."
			);
			return null;
		}
		return {
			type: "vector-image",
			path: makeUnixPath(path.join(dir, relativeFilePath)),
			width: size.width,
			height: size.height
		} as AssetConfiguration;
	})
		.filter((asset): asset is NonNullable<typeof asset> => asset != null);
}

export async function scanAudioAssets(
	baseDir: string,
	dir: string,
	logger?: Logger,
	filter: AssetFilter = audioAssetFilter
): Promise<AssetConfiguration[]> {
	const relativeFilePaths: string[] = readdirRecursive(path.join(baseDir, dir)).filter(filter);

	const durationInfos: AudioDurationInfo[] = [];
	const extMap: {[key: string]: Set<string>} = {};
	for (const relativeFilePath of relativeFilePaths) {
		const absolutePath = path.join(baseDir, dir, relativeFilePath);
		const ext = path.extname(absolutePath);
		const basename = path.basename(absolutePath, ext);
		const nonExtRelativeFilePath = path.join(dir, path.dirname(relativeFilePath), basename);
		const duration = await getAudioDuration(absolutePath, logger);
		if (duration == null)
			console.warn(`Failed to get duration of ${relativeFilePath}`);
		const unixPath = makeUnixPath(nonExtRelativeFilePath);
		durationInfos.push({
			basename,
			ext: ext,
			duration: duration != null ? Math.ceil(duration * 1000) : undefined,
			path: unixPath
		});
		if (!extMap[unixPath]) extMap[unixPath] = new Set<string>();
		extMap[unixPath].add(ext);
	}

	const durationRevMap = invertMap(durationInfos as any, "path");
	for (const nonExtFilePath in durationRevMap) {
		// お節介機能: 拡張子が違うだけの音声ファイル間で、500ms以上長さが違ったら警告しておく。
		// (別のファイルがまぎれているかもしれない) お節介なので数値に深い意味はない。
		if (!durationRevMap.hasOwnProperty(nonExtFilePath)) continue;
		const keys = durationRevMap[nonExtFilePath];
		const durations = keys.map(k => durationInfos[Number(k)].duration).filter((v): v is number => v != null);
		const durationDiff = Math.max(...durations) - Math.min(...durations);
		if (500 < durationDiff) {
			logger?.warn(`Detected different durations between files prefixed with ${nonExtFilePath}.`);
		}
	}

	const durationMap: AudioDurationInfoMap = {};
	for (const durationInfo of durationInfos) {
		if ((durationInfo.ext === ".ogg" && durationInfo.duration != null) || !durationMap[durationInfo.basename]) {
			durationMap[durationInfo.path] = durationInfo;
		}
	}

	const audioAssets: AssetConfiguration[] = [];
	for (const filePath in durationMap) {
		if (!durationMap.hasOwnProperty(filePath)) continue;
		const duration = durationMap[filePath].duration;
		const asset: AudioAssetConfigurationBase = {
			type: "audio",
			path: filePath,
			systemId: "sound",
			duration: duration != null ? duration : null! // 歴史的に duration が必須となっているため duration が取得できない場合は明示的に null! を代入。
		};
		if (extMap[filePath].size > 0) asset.hint = { extensions: Array.from(extMap[filePath]) };
		audioAssets.push(asset);
	}

	return audioAssets;
}
