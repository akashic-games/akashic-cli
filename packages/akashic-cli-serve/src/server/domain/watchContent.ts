import { promisify } from "util";
import * as path from "path";
import * as minimatch from "minimatch";
import { getSystemLogger } from "@akashic/headless-driver";
import * as chokidar from "chokidar";
import { SandboxConfig } from "../../common/types/SandboxConfig";
import { exec as execRaw } from "child_process";
import { dynamicRequire } from "./dynamicRequire";

const exec = promisify(execRaw);

export const enum ModTargetFlags {
	None = 0x0,
	GameJson = 0x1,
	Assets = 0x2
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

	const DELAY = 500;  // 複数ファイルの変更 (TS のコンパイルなど) を個別に scan や通知しないよう、処理を遅延する時間
	const assetsDirRe = new RegExp(`^(?:assets|audio|image|script|text)${path.sep}`);

	let foundAssetsChange = false;
	let foundGameJsonChange = false;
	let modFlags: ModTargetFlags = ModTargetFlags.None;

	const fireCallback = makeDelayedCall(DELAY, () => {
		// チェック時点で未スキャンのアセット変更があれば問答無用で scan する
		if (foundAssetsChange) {
			foundAssetsChange = false;
			modFlags |= ModTargetFlags.Assets;

			getSystemLogger().info("Scanning assets changes...");
			scan.scanAsset({ target: "all", cwd: targetDir }, (err) => {
				if (err) {
					cb(err, ModTargetFlags.None);
					return;
				}

				// アセットのみ更新された場合、scan 後に game.json の更新通知がくるので cb() はそこで呼ぶ。
				// (環境依存で通知順が前後する可能性などを警戒して) 念のためここで、時間内に通知がなくても一回 cb() を返すことは保証する。
				setTimeout(fireCallback, 0);
			});
			return;
		}

		if (foundGameJsonChange) {
			foundAssetsChange = false;
			modFlags |= ModTargetFlags.GameJson;
		}

		cb(null, modFlags);
		modFlags = ModTargetFlags.None;
	});

	// TODO SandboxConfigs との共存？
	// TODO sandbox.config.js の watch フィールドが変化したら再起動要求警告
	const sandboxConfig: SandboxConfig = dynamicRequire(path.resolve(targetDir, "sandbox.config.js")) ?? {};

	function watcherHandler(filePath: string): void {
		// 簡易除外。
		// TODO 通知条件を「game.json か、game.json から参照されているファイルが変化した時」に限定する。
		// (ただしそれをしたとしてもこの判定は有用 (.DS_Store 変化時に scan するのはほぼ間違いなく不毛なので))
		const basename = path.basename(filePath);
		if (basename === "Thumbs.db" || basename === ".DS_Store") {
			return;
		}

		const relPath = path.relative(targetDir, filePath);
		if (assetsDirRe.test(relPath)) {
			foundAssetsChange = true;
			fireCallback();
		} else if (relPath === "game.json") {
			foundGameJsonChange = true;
			fireCallback();
		}

		const promises = Object.keys(sandboxConfig.watch ?? {}).map(key => {
			const entry = sandboxConfig.watch[key]!;
			const entryTarget = path.join(targetDir, entry.target);
			if (minimatch(filePath, entryTarget)) {
				getSystemLogger().info(`Running '${entry.command}' caused by ${filePath}`);
				return exec(entry.command).then(res => {
					console.log(res.stdout);
					console.error(res.stderr);
				});
			}
			return Promise.resolve();
		});
		Promise.race(promises).catch(e => {
			getSystemLogger().error(`Error in watch command execution ignored: ${e}`);
		});
	}

	watcher.on("add", watcherHandler);
	watcher.on("unlink", watcherHandler);
	watcher.on("change", watcherHandler);

}

/**
 * 与えられた関数を一定時間遅延してから呼び出す関数を生成する。
 *
 * 戻り値の関数は、一定時間内に何回呼び出されても、「最後の呼び出しから一定時間の経過後」に一度だけ fun を呼び出す。
 *
 * @param delay 遅延時間。ミリ秒。戻り値の関数が最後に呼び出されてから、この時間分経過した後に fun を呼び出す
 * @param fun 遅延時間経過後に呼び出されるべき関数
 */
function makeDelayedCall(delay: number, fun: () => void): () => void {
	let resetTime = 0;
	let timer: NodeJS.Timer | null = null;

	function handleTimeout(): void {
		const now = Date.now();
		const remain = (resetTime + delay) - now;
		if (remain > 0) {
			timer = setTimeout(handleTimeout, remain);
			return;
		}

		timer = null;
		fun();
	}

	return () => {
		resetTime = Date.now();
		if (timer) return;
		timer = setTimeout(handleTimeout, delay);
	};
}
