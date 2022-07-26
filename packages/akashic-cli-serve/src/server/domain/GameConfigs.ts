import * as fs from "fs";
import * as path from "path";
import * as chokidar from "chokidar";
import type { GameConfiguration } from "../../common/types/GameConfiguration";

const configs: { [key: string]: GameConfiguration } = {};

/**
 * コンテンツの game.json  ファイルの読み込み/監視を登録。
 *
 * @param contentId コンテンツID
 * @param targetDir game.json が存在するディレクトリパス
 */
export function register(contentId: string, targetDir: string): void {
	if (configs[contentId]) return;

	const gameJsonPath = path.join(targetDir, "game.json");
	if (!fs.existsSync(gameJsonPath)) {
		throw new Error(`Not found :${gameJsonPath}`);
	}

	watch(gameJsonPath, config => {
		configs[contentId] = JSON.parse(config);
	});
}

/**
 * コンテンツIDに紐づく game.json の取得
 *
 * @param contentId コンテンツID
 */
export function get(contentId: string): GameConfiguration {
	return configs[contentId];
}

function watch(gameJsonPath: string, callback: (content: string) => void): void {
	callback(fs.readFileSync(gameJsonPath).toString()); // 同期的な初期化のため一度だけ直接呼ぶ。chokidar のオプション次第で不要？

	const changeEventListener = (event: string, path: string): void => {
		if ( event === "change") {
			callback(fs.readFileSync(path).toString());
		}
	};
	const watcher = chokidar.watch(gameJsonPath, { persistent: true });
	watcher.on("change", changeEventListener);
}
