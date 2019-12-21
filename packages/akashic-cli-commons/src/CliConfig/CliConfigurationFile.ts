import * as fs from "fs";
import { Logger } from "../Logger";
import { CliConfiguration } from "./CliConfiguration";

/**
 * game.json をファイルとして取り扱うモジュール。
 */
export module ConfigurationFile {
	/**
	 * akashicConfig.json ファイルを読み込む。
	 *
	 * @param confPath akashicConfig.jsonがあるディレクトリ。絶対パスであることを期待する。
	 * @param logger ログ出力に用いるロガー。
	 */
	export function read(confPath: string, logger: Logger): Promise<CliConfiguration> {
		return new Promise<CliConfiguration>((resolve: (conf: CliConfiguration) => void, reject: (err: any) => void) => {
			fs.readFile(confPath, "utf8", (err: any, data: string) => {
				if (err) {
					if (err.code !== "ENOENT")
						return void reject(err);
					logger.info("No game.json found. Create a new one.");
					data = "{}";
				}
				try {
					resolve(JSON.parse(data));
				} catch (e) {
					reject(e);
				}
			});
		});
	}
}
