import * as fs from "fs";
import * as readdirRecursiveImpl from "fs-readdir-recursive";

export function readFile(filepath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, "utf8", (err, data) => {
			if (err) return void reject(err);
			resolve(data);
		});
	});
}

export function writeFile(filepath: string, data: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.writeFile(filepath, data, { encoding: "utf8" }, (err) => {
			if (err) return void reject(err);
			resolve();
		});
	});
}

export async function readJSON<T>(filepath: string): Promise<T> {
	return JSON.parse(await readFile(filepath));
}

export async function readJSONWithDefault<T>(filepath: string, defaultValue: T): Promise<T> {
	try {
		return await readJSON(filepath);
	} catch (e) {
		if (e.code === "ENOENT")
			return defaultValue;
		throw e;
	}
}

export type WriteDataFormatter<T> = (content: T) => string;

export function writeJSON<T>(filepath: string, content: T, formatter?: WriteDataFormatter<T>): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const text = formatter ? formatter(content) : JSON.stringify(content, null, "\t");
		fs.writeFile(filepath, text, { encoding: "utf8" }, err => {
			if (err) return void reject(err);
			resolve();
		});
	});
}

export function rename(src: string, dest: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.rename(src, dest, err => {
			if (err) return reject(err);
			resolve();
		});
	});
}

// TODO scan で作られてるよりリッチな rm を持ってくる
export function rm(filepath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.rm(filepath, err => {
			if (err) return reject(err);
			resolve();
		});
	});
}

export function readdir(dir: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			if (err) return reject(err);
			resolve(files);
		});
	});
}

export async function readdirRecursice(dir: string): Promise<string[]> {
	// そのまま呼ぶだけだが将来の非同期化を見据えて async にしておく。
	return readdirRecursiveImpl(dir);
}
