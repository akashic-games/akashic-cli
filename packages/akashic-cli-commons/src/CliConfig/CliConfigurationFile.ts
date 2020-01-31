import * as fs from "fs";
import { Logger } from "../Logger";
import { CliConfiguration } from "./CliConfiguration";

/**
 * game.json をファイルとして取り扱うモジュール。
 */
export module CliConfigurationFile {
	/**
	 * akashicConfig.json ファイルを読み込む。
	 *
	 * @param confPath akashicConfig.jsonがあるディレクトリ。絶対パスであることを期待する。
	 * @param logger ログ出力に用いるロガー。
	 */
	export function read(confPath: string, callback: (conf: CliConfiguration) => void): void {
			fs.readFile(confPath, "utf8", (err: any, data: string) => {
				if (err) {
					if (err.code === "ENOENT") {
						return callback({commandOptions: {}});
					} else {
						throw err;
					}
				}
				try {
					callback(JSON.parse(data));
				} catch (e) {
					throw e;
				}
			});
	}
}
