import * as fs from "fs";
import * as path from "path";

export type WriteDataFormatter<T> = (content: T) => string;

/**
 * ファイルを読み込む。
 * @param path 読み込むファイルパス
 * @param options オプション。詳細は Node.js の fs.readFile() を参照
 */
export function readFile(path: string, options: undefined | null): Promise<Buffer>;
export function readFile(path: string, options: BufferEncoding): Promise<string>;
export function readFile(path: string, options: BufferEncoding | undefined | null): Promise<string | Buffer>;
export function readFile(path: string): Promise<Buffer>;
export function readFile(filepath: string, options: BufferEncoding | undefined | null = null): Promise<string | Buffer> {
	return new Promise<string | Buffer>((resolve, reject) => {
		fs.readFile(filepath, options, (err, data) => {
			return void (err ? reject(err) : resolve(data));
		});
	});
}

/**
 * 指定されたファイルを読み込んで、JSON.parse()した値を返す。
 *
 * @param filepath 読み込むファイルパス
 */
export async function readJSON<T>(filepath: string): Promise<T> {
	return JSON.parse(await readFile(filepath, "utf8"));
}

/**
 * 指定されたファイルを読み込んで、JSON.parse()した値を返す。
 * ファイルがない場合はで指定されたデフォルト値を返す。
 *
 * @param filepath 読み込むファイルパス
 * @param defaultValue ファイルが存在しない場合に返す値
 */
export async function readJSONWithDefault<T>(filepath: string, defaultValue: T): Promise<T> {
	try {
		return await readJSON(filepath);
	} catch (e) {
		if (e.code === "ENOENT")
			return defaultValue;
		throw e;
	}
}

/**
 * 指定されたファイルに書き込む。
 * @param filepath 書き込むファイルパス
 * @param content 内容
 */
export function writeFile(filepath: string, content: string | Buffer): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.writeFile(filepath, content, ((typeof content === "string") ? { encoding: "utf8" } : null), err => {
			return void (err ? reject(err) : resolve());
		});
	});
}

/**
 * 指定されたファイルに JSON を書き込む。
 * @param filepath 書き込むファイルパス
 * @param content 内容
 * @param formatter フォーマッタ。与えられた場合、`content` を与えて呼び出した結果が書き込まれる。省略した場合、 `
 */
export function writeJSON<T>(filepath: string, content: T, formatter?: WriteDataFormatter<T>): Promise<void> {
	const text = formatter ? formatter(content) : JSON.stringify(content, null, "\t");
	return writeFile(filepath, text);
}

/**
 * 指定されたディレクトリのファイル名・ディレクトリ名の一覧を返す。
 * @param dir ディレクトリパス
 * @returns ファイル名・ディレクトリ名の配列
 */
export function readdir(dir: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			return void (err ? reject(err) : resolve(files));
		});
	});
}

/**
 * 指定されたファイル・ディレクトリを削除する。
 * @param filepath 削除対象
 */
export function unlink(filepath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.unlink(filepath, err => {
			return void (err ? reject(err) : resolve());
		});
	});
}

/**
 * 指定されたファイル・ディレクトリが存在するかどうかを返す。
 * @param filepath 削除対象
 */
export function exists(filepath: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		fs.stat(path.resolve(filepath), (err: any, _stat: any) => {
			if (err) {
				return void (err.code === "ENOENT" ? resolve(false) : reject(err));
			}
			resolve(true);
		});
	});
}

/**
 * 与えられたディレクトリパスの直下のユニークな(使われていない)ディレクトリ名を探して返す。
 *
 * @param baseDir ディレクトリのパス。
 * @param prefix 接頭辞。この文字列で始まる名前を探す
 * @returns 見つかったユニークな名前。 `baseDir` 部分は含まれない
 */
export async function findUniqueDir(baseDir: string, prefix: string): Promise<string> {
	if (!await exists(path.join(baseDir, prefix)))
		return prefix;
	let postfix = 0;
	while (await exists(path.join(baseDir, `${prefix}${postfix}`)))
		++postfix;
	return `${prefix}${postfix}`;
}
