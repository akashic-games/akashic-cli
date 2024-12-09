import * as fs from "fs";
import * as editorconfig from "editorconfig";
import { createRequire } from "module";
import { Util } from "./index.js";

const require = createRequire(import.meta.url);

export type WriteDataFormatter<T> = (content: T) => string;

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

export async function readJSON<T>(filepath: string): Promise<T> {
	return JSON.parse(await readFile(filepath, "utf8"));
}

export function writeFile(filepath: string, content: string | Buffer): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.writeFile(filepath, content, ((typeof content === "string") ? { encoding: "utf8" } : null), err => {
			return void (err ? reject(err) : resolve());
		});
	});
}

export async function writeJSON<T>(filepath: string, content: T, formatter?: WriteDataFormatter<T>): Promise<void> {
	let text: string;
	if (formatter) {
		text = formatter(content);
	} else {
		const parsed = await editorconfig.parse(filepath);
		const indentSize: number = typeof parsed.indent_size === "number" ? parsed.indent_size : 4;
		const indentStyle: string = parsed.indent_style === "space" ? " ".repeat(indentSize) : "\t";
		text = JSON.stringify(content, null, indentStyle);
		if (parsed.insert_final_newline === true) {
			text += "\n";
		}
	}
	return writeFile(filepath, text);
}

export function readdir(dir: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			return void (err ? reject(err) : resolve(files));
		});
	});
}

export function unlink(filepath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.unlink(filepath, err => {
			return void (err ? reject(err) : resolve());
		});
	});
}

export function readJS(path: string): Promise<unknown> {
	return new Promise<string | Buffer>((resolve, reject) => {
		try {
			const js = require(path);
			delete require.cache[Util.requireResolve(path)];
			resolve(js);
		} catch(err) { 
			reject(err);
		}
	});
}

export async function readJSWithDefault<T>(path: string, defaultValue: T): Promise<T> {
	return new Promise<T>(async (resolve, reject) => {
		try { 
			const js = await readJS(path);
			resolve(js as T);

		} catch (err) {
			if (err.code !== "MODULE_NOT_FOUND") {
				return reject(err);
			}
			resolve(defaultValue);
		}
	});
}
