import * as fs from "fs";
import * as path from "path";
import * as chokidar from "chokidar";
import { GameConfiguration } from "../../common/types/GameConfiguration";

const configs: { [key: string]: GameConfiguration } = {};

/**
 * コンテンツの game.json  ファイルの読み込み/監視を登録。
 *
 * @param contentId コンテンツID
 * @param targetDir game.json が存在するディレクトリパス
 */
export function register(contentId: string, targetDir: string): void {
	const gameJsonPath = path.join(targetDir, "game.json");
	if (configs[contentId]) return;
	configs[contentId] = watchGameJson(gameJsonPath, config => configs[contentId] = config);
}

/**
 * コンテンツIDに紐づく game.json の取得
 *
 * @param contentId コンテンツID
 */
export function get(contentId: string): GameConfiguration {
	return configs[contentId];
}

function watchGameJson(gameJsonPath: string, callback: (content: GameConfiguration) => void): GameConfiguration {
	let gameJson: any = JSON.parse(fs.readFileSync(gameJsonPath).toString());

	const changeEventListener = (event: string, path: string) => {
		if ( event === "change") {
			gameJson = JSON.parse(fs.readFileSync(path).toString());
		}
	};
	const watcher = chokidar.watch(gameJsonPath, { persistent: true });
	watcher.on("change", changeEventListener);

	return gameJson;
}
