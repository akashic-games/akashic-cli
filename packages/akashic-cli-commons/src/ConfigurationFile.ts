import * as fs from "fs";
import { Logger } from "./Logger";
import { GameConfiguration } from "./GameConfiguration";

/**
 * game.json をファイルとして取り扱うモジュール。
 */
export module ConfigurationFile {
	/**
	 * game.json ファイルを読み込む。
	 * なければ作成する。
	 *
	 * @param confPath game.jsonがある、または作成するディレクトリ。絶対パスであることを期待する。
	 * @param logger ログ出力に用いるロガー。
	 */
	export function read(confPath: string, logger: Logger): Promise<GameConfiguration> {
		return new Promise<GameConfiguration>((resolve: (conf: GameConfiguration) => void, reject: (err: any) => void) => {
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

	/**
	 * game.json をファイルに書き込む。
	 *
	 * @param confPath game.jsonを保存するディレクトリ。絶対パスであることを期待する。
	 * @param logger ログ出力に用いるロガー。
	 */
	export function write(content: GameConfiguration, confPath: string, logger: Logger): Promise<void> {
		return new Promise<void>((resolve: () => void, reject: (err: any) => void) => {
			var text = JSON.stringify(content, null, "\t");
			fs.writeFile(confPath, text, {encoding: "utf8"}, (err: any) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}
