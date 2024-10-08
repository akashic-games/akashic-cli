import { createRequire } from "module";
import type { CliConfiguration } from "./CliConfiguration.js";

const require = createRequire(import.meta.url);

/**
 * akashic.config.js をファイルとして取り扱うモジュール。
 */
export module CliConfigurationFile {
	/**
	 * akashic.config.js ファイルを読み込む。
	 *
	 * @param confPath akashic.config.js があるディレクトリ。絶対パスであることを期待する。
	 * @param callback コールバック。
	 */
	export function read(confPath: string, callback: (error: Error | undefined, conf: CliConfiguration | undefined) => void): void {
		let cliConfig: CliConfiguration = { commandOptions: {} };
		try {
			cliConfig = require(confPath);
			delete require.cache[require.resolve(confPath)];
			setImmediate(() => callback(undefined, cliConfig));
		} catch (error) {
			if (error.code === "MODULE_NOT_FOUND") {
				setImmediate(() => callback(undefined, cliConfig));
			} else {
				setImmediate(() => callback(error, undefined));
			}
		}
	}
}
