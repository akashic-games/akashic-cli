import * as path from "path";
import * as chokidar from "chokidar";
import { SandboxConfig } from "../../common/types/SandboxConfig";
import { dynamicRequire } from "./dynamicRequire";
import { BadRequestError } from "../common/ApiError";

const configs: { [key: string]: SandboxConfig } = {};

/**
 * sandbox.config.jsを読み込み内容を返す。
 * 読み込んだ内容はコンテンツIDで紐付け保持する。
 * 初回読み込み後はファイル監視を行い、監視イベントにて保持内容を更新する。
 *
 * @param contentId コンテンツID
 * @param targetDir 対象ディレクトリ
 */
export function loadSandboxConfigJs(contentId: string, targetDir?: string): SandboxConfig {
	if (!configs[contentId] && targetDir) {
		const configPath = path.resolve(targetDir, "sandbox.config.js");
		configs[contentId] = dynamicRequire<SandboxConfig>(configPath, true) || {};
		validateConfig(configs[contentId]);

		const watcher = chokidar.watch(configPath, { persistent: true });
		watcher.on("all", (event, path) => {
			if ((event === "add" && !Object.keys(configs[contentId]).length) || event === "change") {
				configs[contentId] = dynamicRequire<SandboxConfig>(path, true);
				validateConfig(configs[contentId]);
			} else if (event === "unlink") {
				configs[contentId] = {};
			}
		});
	}
	return configs[contentId];
}

function validateConfig(config: SandboxConfig): void {
	const externalAssets = (config ? config.externalAssets : undefined) === undefined ? [] : config.externalAssets;
	if (externalAssets) {
		// sandbox.config.js の externalAssets に値がある場合は (string|regexp)[] でなければエラーとする
		if (!(externalAssets instanceof Array)) {
			throw new BadRequestError({ errorMessage: "Invalid externalAssets, Not Array" });
		}

		if (externalAssets.length > 0) {
			const found = externalAssets.find((url: any) => typeof url !== "string" && !(url instanceof RegExp));
			if (found) {
				throw new BadRequestError({ errorMessage: `Invalid externalAssets, The value is neither a string or regexp. value:${found}` });
			}
		}
	}
}
