import * as fs from "fs";
import { createRequire } from "module";
import * as path from "path";
import { extractAssetPaths } from "@akashic/game-configuration/lib/utils/extractAssetPaths.js";
import * as glob from "glob";

const require = createRequire(import.meta.url);

/**
 * 指定したコンテンツで使われているファイルを別ディレクトリにコピーします
 * @param src コピー元のコンテンツのディレクトリ
 * @param dest コピー先のディレクトリ
 */
export function copyContentFiles(src: string, dest: string): void {
	if (!fs.existsSync(dest)) fs.mkdirSync(dest);
	const gameJsonPath = path.resolve(src, "game.json");

	fs.copyFileSync(gameJsonPath, path.resolve(dest, "game.json"));

	const gameConfiguration = require(gameJsonPath);
	const assetPaths = extractAssetPaths({
		gameConfiguration,
		audioExtensionResolver: (asset) => {
			if (asset.hint?.extensions)
				return asset.hint.extensions;
			const pattern = path.resolve(src, asset.path + ".*").replace(/\\/g, "/"); // glob が "/" 前提なので "\\" は置換
			return glob.sync(pattern).map(f => path.extname(f));
		}
	});
	assetPaths.forEach(p => {
		const dir = path.resolve(dest, path.dirname(p));
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		fs.copyFileSync(path.resolve(src, p), path.resolve(dest, p));
	});
}
