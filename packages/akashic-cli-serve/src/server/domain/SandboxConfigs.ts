import * as path from "path";
import * as chokidar from "chokidar";
import { SandboxConfig } from "../../common/types/SandboxConfig";
import { BadRequestError } from "../common/ApiError";
import { dynamicRequire } from "./dynamicRequire";

const configs: { [key: string]: SandboxConfig } = {};

/**
 * コンテンツの sandbox.config.js  ファイルの読み込み/監視を登録。
 *
 * @param contentId コンテンツID
 * @param targetDir sandbox.config.jsが存在するディレクトリパス
 */
export function register(contentId: string, targetDir: string): void {
	const configPath = path.resolve(targetDir, "sandbox.config.js");
	if (configs[contentId]) return;
	configs[contentId] = watchRequire(configPath, config => configs[contentId] = config);
}

/**
 * コンテンツIDに紐づく SandboxConfig の取得
 *
 * @param contentId コンテンツID
 */
export function get(contentId: string): SandboxConfig {
	return configs[contentId];
}

function watchRequire(configPath: string, callback: (content: SandboxConfig) => void): SandboxConfig {
	let config = dynamicRequire<SandboxConfig>(configPath, true);

	const eventListener = (event: string, path: string) => {
		if ((event === "add" && !Object.keys(config).length) || event === "change") {
			config = dynamicRequire<SandboxConfig>(path, true);
			validateConfig(config);
		} else if (event === "unlink") {
			config = {};
		} else {
			return;
		}
		callback(config);
	};
	const watcher = chokidar.watch(configPath, { persistent: true });
	watcher.on("all", eventListener);

	return config;
}

function validateConfig(config: SandboxConfig): void {
	const externalAssets = (config ? config.externalAssets : undefined) === undefined ? [] : config.externalAssets;
	if (externalAssets) {
		// sandbox.config.js の externalAssets に値がある場合は (string|regexp)[] でなければエラーとする
		if (!(externalAssets instanceof Array)) {
			throw new BadRequestError({ errorMessage: "Invalid externalAssets, Not Array" });
		}

		if ( externalAssets.length > 0) {
			const found = externalAssets.find((url: any) => typeof url !== "string" && !(url instanceof RegExp));
			if (found) {
				throw new BadRequestError({errorMessage: `Invalid externalAssets, The value is neither a string or regexp. value:${ found }` });
			}
		}
	}
}
