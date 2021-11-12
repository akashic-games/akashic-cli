import * as fs from "fs";

export type WriteDataFormatter<T> = (content: T) => string;

export async function readJSON<T>(filepath: string): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		fs.readFile(filepath, "utf8", (err, data) => {
			if (err) {
				return void reject(err);
			}
			try {
				resolve(JSON.parse(data));
			} catch (e) {
				reject(e);
			}
		});
	});
}

export async function writeJSON<T>(filepath: string, content: T, formatter?: WriteDataFormatter<T>): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const text = formatter ? formatter(content) : JSON.stringify(content, null, "\t");
		fs.writeFile(filepath, text, { encoding: "utf8" }, err => {
			if (err) {
				return void reject(err);
			}
			resolve();
		});
	});
}
