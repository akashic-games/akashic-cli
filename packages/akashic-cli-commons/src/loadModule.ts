import { createRequire } from "node:module";
import { extname, resolve } from "node:path";

const require = createRequire(import.meta.url);

/**
 * 拡張子に応じてモジュールを読み込む。
 */
export async function loadModule(filePath: string): Promise<any> {
	let fullPath = resolve(filePath);
	const ext = extname(fullPath);
	if (process.platform === "win32") {
		// Windows の場合 "c:¥" 始まりになり、"c:" が URL の scheme と勘違いされエラーとなるので "file://" を接頭に付与
		fullPath = `file://${fullPath}`;
	}

	if (ext === ".mjs") {
		return (await import(fullPath)).default;
	} else if (ext === ".cjs") {
		return require(fullPath);
	} else if (ext === ".js") {
		try {
			return (await import(fullPath)).default;
		} catch (err) {
			if (err.name === "ReferenceError") {
				// ESM として読み込めない場合は CommonJS として読み込みを試みる
				return require(fullPath);
			}
			throw err;
		}
	}

	throw new Error(`Unsupported file extension: ${ext}`);
}
