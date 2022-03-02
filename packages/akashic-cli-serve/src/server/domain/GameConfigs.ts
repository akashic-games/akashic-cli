import * as fs from "fs";
import * as path from "path";
import * as chokidar from "chokidar";
import type { GameConfiguration } from "../../common/types/GameConfiguration";

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
	// akashic-cli-scanはwatchオプション指定時しか使われないので動的importする
	const scan = await import("@akashic/akashic-cli-scan/lib/scan");
	if (!watcher) {
		watcher = chokidar.watch(targetDir, {
			persistent: true,
			ignoreInitial: true,
			ignored: "**/node_modules/**/*"
		});
	}
	let timer: NodeJS.Timer = null;
	let mods: ModTargetFlags = ModTargetFlags.None;
	const watcherHandler = (filePath: string): void => {
		const handler = (): void => {
			const lastMods = mods;
			mods = ModTargetFlags.None;
			if (lastMods & ModTargetFlags.Assets) {
				scan.scanAsset({ target: "all", cwd: targetDir }, (err) => {
					// scanAssets の過程でGameJsonのフラグが立ってしまい、落とさないとcb()が二重で呼ばれてしまうのでここで落としておく。
					mods &= ~ModTargetFlags.GameJson;
					try {
						cb(err ?? null, ModTargetFlags.Assets);
					} finally {
						if (mods === ModTargetFlags.None) {
							clearInterval(timer);
							timer = null;
						}
					}
				});
			} else if (lastMods & ModTargetFlags.GameJson) {
				try {
					cb(null, ModTargetFlags.GameJson);
				} finally {
					if (mods === ModTargetFlags.None) {
						clearInterval(timer);
						timer = null;
					}
				}
			}
		};

		if (["assets", "audio", "image", "script", "text"].some(dir => filePath.indexOf(path.join(targetDir, dir)) !== -1)) {
			mods |= ModTargetFlags.Assets;
		} else if (filePath === path.join(targetDir, "game.json")) {
			mods |= ModTargetFlags.GameJson;
		}

		if (!timer) {
			timer = setInterval(handler, 1000);
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
