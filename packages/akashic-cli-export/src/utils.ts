import { existsSync, readdirSync } from "fs";
import * as path from "path";
import type * as cmn from "@akashic/akashic-cli-commons";
import type { AssetConfiguration } from "@akashic/game-configuration";

/**
 * audio アセットの拡張子をチェックし .ogg, .m4a/.aac が存在しない場合にログ出力する
 */
export function warnLackOfAudioFile(asset: AssetConfiguration): void {
	if (asset.type !== "audio") return;

	if (asset.hint && asset.hint.extensions) {
		let isOggExist = false;
		let isM4aOrAacExist = false;
		asset.hint.extensions.forEach(v => {
			if (v === ".ogg") isOggExist = true;
			if (v === ".m4a" || v === ".aac") isM4aOrAacExist = true;
		});

		if (!isOggExist)
			console.warn(`No .ogg file found for ${asset.path}. This asset may not be played on some environments (e.g. Android)`);

		if (!isM4aOrAacExist)
			// eslint-disable-next-line max-len
			console.warn(`Neither .m4a nor .aac file found for ${asset.path}. This asset may not be played on some environments (e.g. iOS)`);
	}
}

export function validateGameJson(gamejson: cmn.GameConfiguration): void {
	if (gamejson.moduleMainScripts?.["@akashic/akashic-engine"]) {
		throw new Error("Module \"@akashic/akashic-engine\" is detected."
		+ "You don't need to install this module explicitly in the content."
		+ "Remove it by `akashic uninstall @akashic/akashic-engine` before export.");
	}
}

// FIXME: akashic-cli-commons が ES Module に移行したタイミングで移すべき
export function readdirRecursive(dir: string, baseDir: string = dir): string[] {
	let files: string[] = [];
	if (!existsSync(dir)) return files;
	const items = readdirSync(dir, { withFileTypes: true });
	for (const item of items) {
		const fullPath = path.join(dir, item.name);
		const relativePath = path.relative(baseDir, fullPath);
		if (item.isDirectory()) {
			files = files.concat(readdirRecursive(fullPath, baseDir));
		} else {
			files.push(relativePath);
		}
	}
	return files;
};
