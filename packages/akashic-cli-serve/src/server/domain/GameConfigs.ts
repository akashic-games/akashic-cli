import * as fs from "fs";
import * as path from "path";
import * as chokidar from "chokidar";
import { getSystemLogger } from "@akashic/headless-driver";
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

export function watchContent(targetDir: string, cb: (err: any) => void): void {
	// akashic-cli-scanはwatchオプション指定時しか使われないので動的importする
	import("@akashic/akashic-cli-scan/lib/scan").then(scan => {
		const gameJsonPath = path.join(targetDir, "game.json");
		const watcher = chokidar.watch(targetDir, {
			persistent: true,
			ignoreInitial: true,
			ignored: "**/node_modules/**/*",
			awaitWriteFinish: true
		});
		const handler = (filePath: string) => {
			if (["assets", "audio", "image", "script", "text"].some(dir => filePath.indexOf(path.join(targetDir, dir)) !== -1)) {
				// scanAssetメソッドで行われるgame.jsonの更新に反応して2重で再起動しないようにするために、メソッドの実行が終わるまでgame.jsonを監視対象から外す
				watcher.unwatch(gameJsonPath);
				scan.scanAsset({ target: "all", cwd: targetDir }, (err) => {
					watcher.add(gameJsonPath);
					cb(err);
				});
			} else if (filePath === gameJsonPath) {
				console.log("Reflect changes of game.json");
				cb(null);
			}
		};
		// watch開始時にgame.jsonのasstesの内容と実際のアセットの内容に誤差が無いかの確認を兼ねてscanAsset関数を実行する
		watcher.on("ready", () => {
			scan.scanAsset({ target: "all", cwd: targetDir }, (err) => {
				watcher.add(gameJsonPath);
				if (err) {
					getSystemLogger().error(err.message);
				}
			});
			watcher.unwatch(gameJsonPath);
		});
		watcher.on("add", handler);
		watcher.on("unlink", handler);
		watcher.on("change", handler);
	});
}

function watchGameJson(gameJsonPath: string, callback: (gameJson: GameConfiguration) => void): GameConfiguration {
	let gameJson: any = JSON.parse(fs.readFileSync(gameJsonPath).toString());

	const changeEventListener = (event: string, path: string) => {
		if ( event === "change") {
			gameJson = JSON.parse(fs.readFileSync(path).toString());
			callback(gameJson);
		}
	};
	const watcher = chokidar.watch(gameJsonPath, { persistent: true });
	watcher.on("change", changeEventListener);

	return gameJson;
}
