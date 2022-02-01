import * as fs from "fs";

export type WriteDataFormatter<T> = (content: T) => string;

export function readFile(path: string, options: { encoding?: null | undefined } | undefined | null): Promise<Buffer>;
export function readFile(path: string, options: { encoding: BufferEncoding } | BufferEncoding): Promise<string>;
export function readFile(path: string, options: fs.BaseEncodingOptions | BufferEncoding | undefined | null): Promise<string | Buffer>;
export function readFile(path: string): Promise<Buffer>;
export async function readFile(
	filepath: string,
	options: fs.BaseEncodingOptions | BufferEncoding | undefined | null = null
): Promise<string | Buffer> {
	return new Promise<string | Buffer>((resolve, reject) => {
		fs.readFile(filepath, options, (err, data) => {
			return void (err ? reject(err) : resolve(data));
		});
	});
}

export async function readJSON<T>(filepath: string): Promise<T> {
	return JSON.parse(await readFile(filepath, "utf8"));
}

export async function writeFile(filepath: string, content: string | Buffer): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.writeFile(filepath, content, ((typeof content === "string") ? { encoding: "utf8" } : null), err => {
			return void (err ? reject(err) : resolve());
		});
	});
}

export async function writeJSON<T>(filepath: string, content: T, formatter?: WriteDataFormatter<T>): Promise<void> {
	const text = formatter ? formatter(content) : JSON.stringify(content, null, "\t");
	return writeFile(filepath, text);
}

export async function readdir(dir: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			if (err) return reject(err);
			resolve(files);
		});
	});
}
