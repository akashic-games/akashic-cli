import * as fs from "fs";
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
			if (fs.existsSync(confPath)) {
				// TODO: これはあくまでテストを通すためだけの一旦の暫定的な対応。これは絶対に採用しない方法なので代替方法を即用意すること。
				/* tslint:disable:no-eval */
				cliConfig = eval(fs.readFileSync(confPath, "utf-8"));
			}
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
