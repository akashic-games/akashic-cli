import * as fs from "fs";
import * as path from "path";
import type { GameConfiguration } from "@akashic/game-configuration";
import * as chokidar from "chokidar";

const configs: { [key: string]: GameConfiguration } = {};

export const enum ModTargetFlags {
	None = 0x0,
	GameJson = 0x1,
	Assets = 0x2
}

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

export async function watchContent(
	targetDir: string,
	cb: (err: any, modTargetFlag: ModTargetFlags) => void,
	watcher?: chokidar.FSWatcher
): Promise<void> {
	watcher ??= chokidar.watch(targetDir, {
		persistent: true,
		ignoreInitial: true,
		ignored: "**/node_modules/**/*"
	});

	// akashic-cli-scanはwatchオプション指定時しか使われないので動的importする
	const scan = await import('@akashic/akashic-cli-scan/lib/scanAsset.js');

	targetDir = path.resolve(targetDir); // 相対パスで監視すると chokidar の通知してくるパスがおかしい場合があるようなのですべて絶対パスで扱う
	const assetDirs = ["assets", "audio", "image", "script", "text"].map(d => path.join(targetDir, d) + path.sep);
	const gameJsonPath = path.join(targetDir, "game.json");

	let suppressedGameJson = false;
	let suppressedScan = false;
	const watcherHandler = async (filePath: string): Promise<void> => {
		filePath = path.resolve(filePath);

		if (!suppressedScan && assetDirs.some(assetDir => filePath.startsWith(assetDir))) {
			// scanAsset() によって起こる game.json の変更を通知すると二重になってしまうので、500ms だけ無視するように。時間は仮。
			// (game.json の変更は scanAsset() 中に完了するが、それを chokidar が検出するタイミングには保証がない。
			// すなわち suppressedGameJson は suppressedScan では代用できない点に注意)
			suppressedGameJson = true;
			setTimeout(() => {
				suppressedGameJson = false;
			}, 500);

			try {
				suppressedScan = true; // scanAsset() 中に再帰的に scan しないよう抑制。
				await scan.scanAsset({ target: "all", cwd: targetDir });
			} finally {
				suppressedScan = false;
			}
			cb(null, ModTargetFlags.Assets);
			return;
		}

		if (!suppressedGameJson && filePath === gameJsonPath) {
			cb(null, ModTargetFlags.GameJson);
			return;
		}
	};

	watcher.on("add", watcherHandler);
	watcher.on("unlink", watcherHandler);
	watcher.on("change", watcherHandler);
}

function watchGameJson(gameJsonPath: string, callback: (gameJson: GameConfiguration) => void): GameConfiguration {
	let gameJson: any = JSON.parse(fs.readFileSync(gameJsonPath).toString());

	const changeEventListener = (event: string, path: string): void => {
		if ( event === "change") {
			gameJson = JSON.parse(fs.readFileSync(path).toString());
			callback(gameJson);
		}
	};
	const watcher = chokidar.watch(gameJsonPath, { persistent: true });
	watcher.on("change", changeEventListener);

	return gameJson;
}
