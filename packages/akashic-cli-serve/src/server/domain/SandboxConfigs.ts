import * as path from "path";
import * as chokidar from "chokidar";
import { SandboxConfig } from "../../common/types/SandboxConfig";
import { dynamicRequire } from "./dynamicRequire";
import { BadRequestError } from "../common/ApiError";

export class SandboxConfigs {
	private static _instance: SandboxConfigs;

	static getInstance(): SandboxConfigs {
		if (!this._instance) {
			this._instance = new SandboxConfigs();
		}
		return this._instance;
	}
	private _configs: { [key: string]: SandboxConfig } = {};

	/**
	 * sandbox.config.jsを読み込み、ファイルの監視を行う。
	 * 読み込んだ内容は、コンテンツIDで紐付け保持する。
	 *
	 * @param targetDir 対象ディレクトリ
	 * @param contentId コンテンツID
	 */
	loadSandboxConfigJs(targetDir: string, contentId: string): void {
		const configPath = path.resolve(targetDir, "sandbox.config.js");
		const watcher = chokidar.watch(configPath, { persistent: true });
		watcher.on("all", (event, path) => {
			// watch後、初回読み込みは add イベントで行われる。
			if (event === "add" || event === "change") {
				this._configs[contentId] = dynamicRequire<SandboxConfig>(configPath, true);
				this.validateConfig(this._configs[contentId]);
			} else if (event === "unlink") {
				this._configs[contentId] = {};
			} else {
				// do nothing.
			}
		});
	}

	/**
	 * コンテンツIDに紐づく、sandboxConfigを返す。
	 * @param contentId コンテンツID
	 */
	getConfig(contentId: string): SandboxConfig {
		return this._configs[contentId];
	}

	private validateConfig(config: SandboxConfig): void {
		const externalAssets = (config ? config.externalAssets : undefined) === undefined ? [] : config.externalAssets;
		if (externalAssets) {
			// sandbox.config.js の externalAssets に値がある場合は (string|regexp)[] でなければエラーとする
			if (!(externalAssets instanceof Array)) {
				throw new BadRequestError({ errorMessage: "Invalid externalAssets, Not Array" });
			}

			if (externalAssets.length > 0) {
				const found = externalAssets.find((url: any) => typeof url !== "string" && !(url instanceof RegExp));
				if (found) {
					throw new BadRequestError({errorMessage: `Invalid externalAssets, The value is neither a string or regexp. value:${ found }` });
				}
			}
		}
	}
}
