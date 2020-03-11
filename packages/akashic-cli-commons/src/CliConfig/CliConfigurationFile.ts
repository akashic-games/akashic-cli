import { CliConfiguration } from "./CliConfiguration";

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
	export function read(confPath: string, callback: (error: Error, conf: CliConfiguration) => void): void {
		let cliConfig: CliConfiguration = { commandOptions: {} };
		try {
			cliConfig = require(confPath);
			delete require.cache[require.resolve(confPath)];
			setImmediate(() => callback(undefined, cliConfig));
		} catch (error) {
			if (error.code === "ENOENT") {
				setImmediate(() => callback(undefined, cliConfig));
			} else {
				callback(error, undefined);
			}
		}
	}
}
