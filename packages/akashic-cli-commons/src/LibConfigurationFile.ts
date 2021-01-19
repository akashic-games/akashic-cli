import * as fs from "fs";
import { LibConfiguration } from "./LibConfiguration";

/**
 * akashic-lib をファイルとして取り扱うモジュール。
 */
export module LibConfigurationFile {
	/**
	 * akashic-lib ファイルを読み込む。
	 * なければ例外を投げる。
	 *
	 * @param confPath akashic-lib.json があるディレクトリ。絶対パスであることを期待する。
	 */
	export function read(confPath: string): Promise<LibConfiguration> {
		return new Promise((resolve, reject) => {
			fs.readFile(confPath, "utf8", (err, data) => {
				if (err) {
					reject(err);
					return;
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
	 * akashic-lib.json をファイルに書き込む。
	 *
	 * @param content akashic-lib.json の object 値。
	 * @param confPath akashic-lib.json を保存するディレクトリ。絶対パスであることを期待する。
	 */
	export function write(content: LibConfiguration, confPath: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const text = JSON.stringify(content, null, "\t");
			fs.writeFile(confPath, text, { encoding: "utf8" }, err => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}
}
