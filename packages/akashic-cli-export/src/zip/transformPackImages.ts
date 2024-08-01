import * as fs from "fs";
import * as path from "path";
import { writeFile, unlink } from "@akashic/akashic-cli-commons/lib/FileSystem";
import type { GameConfiguration } from "@akashic/akashic-cli-commons/lib/GameConfiguration";
import { mkdirpSync } from "@akashic/akashic-cli-commons/lib/Util";
import type { AssetConfiguration, ImageAssetConfigurationBase } from "@akashic/game-configuration";
import type { PNG } from "pngjs";
import { makeUniqueAssetPath } from "./GameConfigurationUtil";
import type { PackResult, PackTarget } from "./packRects";
import { packSmallRects } from "./packRects";

/**
 * コンテンツ内の小さい画像 (PNG ファイル) を、一定サイズに収まる限りでパッキングして一つにまとめる。
 *
 * よりファイル数を削減しやすいよう小さい画像を優先的にまとめるが、
 * (パッキング処理の) 効率のため、必ずしも完全に画像のサイズ順に対象が決まるわけではない。
 * 不可逆圧縮である JPEG ファイルは対象にしない。
 *
 * @param gamejson PNG のパッキングを行うコンテンツの game.json 。破壊的に変更される。
 * @param basepath コンテンツのルートディレクトリのパス。このパス以下のファイルは破壊的に変更される。
 */
export async function transformPackSmallImages(gamejson: GameConfiguration, basepath: string): Promise<void> {
	return flushPackSideEffect(await transformPackSmallImagesImpl(gamejson, basepath));
}

export interface PackingFileOutput {
	path: string;
	width: number;
	height: number;
	content: Buffer | string;
}

/**
 * パッキングによるファイルへの副作用。
 */
export interface PackingFileSideEffect {
	/**
	 * パッキングによって生成された (保存されるべき) 画像データ。
	 */
	outputs: PackingFileOutput[];

	/**
	 * パッキングの結果不要になった (削除されるべき) ファイルのパス。
	 */
	discardables: string[];
}

/**
 * パッキング結果のファイル副作用を実際のファイルに反映する。
 */
export async function flushPackSideEffect(sideEffect: PackingFileSideEffect): Promise<void> {
	for (const output of sideEffect.outputs) {
		mkdirpSync(path.dirname(output.path)); // TODO ほかの利用箇所と合わせて非同期版を作って移行する
		await writeFile(output.path, output.content);
	}
	for (const discardable of sideEffect.discardables) {
		await unlink(discardable);
	}
}

interface ImageAssetPackData {
	path: string;
	assetIds: string[];
}

/**
 * transformPackSmallImages() の実処理。
 * 引数 gamejson を破壊するが、ファイルへの変更は行わずを戻り値で副作用の情報として返す。
 */
export async function transformPackSmallImagesImpl(gamejson: GameConfiguration, basepath: string): Promise<PackingFileSideEffect> {
	// このサイズにおさまる限りで画像を詰め込む。値は「余計に読み込んでも許容できる程度のサイズ」であればよく、調整の余地がある。
	const binWidth = 1024;
	const binHeight = 1024;

	// Akashic Engine が slice 指定をサポートしていないバージョンのコンテンツなら何もしない。
	const sandboxRuntimeVer = gamejson.environment["sandbox-runtime"] ?? "1";
	if (/^[12]$/.test(sandboxRuntimeVer)) return { outputs: [], discardables: [] };

	const rects = extractPackTargets(gamejson, binWidth, binHeight);
	const packResult = await packSmallRects(rects, binWidth, binHeight);
	if (!packResult)
		return { outputs: [], discardables: [] };
	return applyPackResults([packResult], gamejson, basepath);
}

export function extractPackTargets(
	gamejson: GameConfiguration,
	widthLimit: number,
	heightLimit: number
): PackTarget<ImageAssetPackData>[] {
	// NOTE 単純化のため、この関数は元から slice 指定のある画像アセットを無視する。
	// slice をサポートする場合、パスだけでは同じ内容の画像アセットを識別できなくなるため、
	// ImageAssetPackData の定義や applyPackResults() の実装まで含めて見直す必要がある。
	const pathToIdsTable = Object.keys(gamejson.assets).reduce((acc, aid) => {
		const decl = gamejson.assets[aid];
		if (isPackableImage(decl, widthLimit, heightLimit) && !decl.hasOwnProperty("slice")) // 既に slice があるものは単純化のため除外
			(acc[decl.path] ?? (acc[decl.path] = [])).push(aid);
		return acc;
	}, Object.create(null) as { [path: string]: string[] });

	return Object.keys(pathToIdsTable).map(p => {
		const assetIds = pathToIdsTable[p]!;
		const decl = gamejson.assets[assetIds[0]!]! as ImageAssetConfigurationBase;
		return {
			name: decl.path,
			width: decl.width!,
			height: decl.height!,
			data: { assetIds, path: decl.path }
		};
	});
}

function isPackableImage(decl: AssetConfiguration, widthThreshold: number, heightThreshold: number): boolean {
	return (
		decl.type === "image" &&
		decl.path.endsWith(".png") &&
		decl.width < widthThreshold &&
		decl.height < heightThreshold
	);
}

/**
 * パッキング結果をコンテンツに適用する。
 *
 * 引数の gamejson を破壊する。
 * ただしファイルへの変更は行わず、 `PackingFileSideEffect` として戻り値で返す。
 */
export async function applyPackResults(
	packResults: PackResult<ImageAssetPackData>[],
	gamejson: GameConfiguration,
	basepath: string
): Promise<PackingFileSideEffect> {
	const outputs: PackingFileOutput[] = [];
	const discardables: string[] = [];
	for (let i = 0; i < packResults.length; ++i) {
		const packResult = packResults[i];
		const packedPath = makeUniqueAssetPath(gamejson, `assets/aez_packed_image${i}.png`);
		const { width, height, rects } = packResult;

		const absPackedPath = path.join(basepath, packedPath);
		const rendered = await renderPNG(packResult, basepath);
		outputs.push({ path: absPackedPath, width, height, content: rendered });

		rects.forEach(rect => {
			discardables.push(path.join(basepath, rect.data.path));
			rect.data.assetIds.forEach(aid => {
				const orig = gamejson.assets[aid];
				gamejson.assets[aid] = {
					...orig,
					path: packedPath,
					width,
					height,
					virtualPath: orig.virtualPath ?? orig.path,
					slice: [rect.x, rect.y, rect.width, rect.height]
				} as ImageAssetConfigurationBase;
			});
		});
	}
	return { outputs, discardables };
}

async function readPNG(input: string): Promise<PNG> {
	const { PNG } = await import("pngjs");
	return new Promise((resolve, reject) => {
		const stream = fs.createReadStream(input).pipe(new PNG());
		stream.on("parsed", () => void resolve(stream));
		stream.on("error", err => reject(err));
	});
}

async function renderPNG(packResult: PackResult<ImageAssetPackData>, basepath: string): Promise<Buffer> {
	const { PNG } = await import("pngjs");
	const { width, height, rects } = packResult;
	const png = new PNG({ width, height });
	for (let i = 0; i < rects.length; i++) {
		const rect = rects[i];
		const src = await readPNG(path.join(basepath, rect.data.path));
		src.bitblt(png, 0, 0, src.width, src.height, rect.x, rect.y);
	}
	return PNG.sync.write(png);
}
