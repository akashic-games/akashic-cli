import * as fs from "fs";
import * as path from "path";
import type { AudioAssetConfigurationBase } from "@akashic/game-configuration";
import { extractAssetPaths } from "@akashic/game-configuration/lib/utils/extractAssetPaths";
import * as glob from "glob";

/**
 * 指定したコンテンツで使われているファイルを別ディレクトリにコピーします
 * @param src コピー元のコンテンツのディレクトリ
 * @param dest コピー先のディレクトリ
 */
export function copyContentFiles(src: string, dest: string): void {
	if (!fs.existsSync(dest)) fs.mkdirSync(dest);
	const gameJsonPath = path.resolve(src, "game.json");

	fs.copyFileSync(gameJsonPath, path.resolve(dest, "game.json"));

	/* eslint-disable @typescript-eslint/no-var-requires */
	const gameConfiguration = require(gameJsonPath);
	const audioExtensionResolver = (asset: AudioAssetConfigurationBase): string[] => {
		if (asset.hint?.extensions) {
			return asset.hint.extensions;
		} else {
			// 後方互換性のために実在するファイルの拡張子を全て取得
			// globはwindows環境のdelimiterに対応できないので、windows環境のdelimiterがあればlinux環境のものに変換する必要がある。
			return glob.sync(path.resolve(src, asset.path + ".*").replace(/\\/g, "/")).map((f: string) => path.extname(f).replace(".", ""));
		}
	};
	extractAssetPaths({ gameConfiguration, audioExtensionResolver }).forEach(p => {
		const dir = path.resolve(dest, path.dirname(p));
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		fs.copyFileSync(path.resolve(src, p), path.resolve(dest, p));
	});
}
