import * as fs from "fs";
import * as path from "path";
import resolve from "resolve";

export function invertMap(obj: {[key: string]: string}): {[key: string]: string[]};
export function invertMap(obj: {[key: string]: Object}, prop: string): {[key: string]: string[]};
export function invertMap(obj: {[key: string]: any}, prop?: string): {[key: string]: string[]} {
	const ret: {[key: string]: string[]} = {};
	Object.keys(obj).forEach((key: string) => {
		const v: string = prop ? obj[key][prop] : obj[key];
		(ret[v] || (ret[v] = [])).push(key);
	});
	return ret;
}

export function filterMap<S, D>(xs: S[], f: (v: S) => D): D[] {
	const result: D[] = [];
	xs.forEach((x) => {
		const mapped = f(x);
		if (mapped !== undefined)
			result.push(mapped);
	});
	return result;
}

export function makeModuleNameNoVer(name: string): string {
	const atPos = name.indexOf("@", 1); // 1 は scoped module の prefix 避け
	return (atPos !== -1) ? name.substr(0, atPos) : name;
}

/**
 * パス文字列の \ を全て / に変換する。
 */
// akashic-cli が扱う game.json 内ではパスはすべて / 区切りなので、
// 環境依存を暗黙に吸収して \ と / を使い分ける path.resolve() が使えない。
export function makeUnixPath(path: string): string {
	return path.replace(/\\/g, "/");
}

/**
 * カレントディレクトリを変更し、戻すための関数を返す。
 * @param dirpath 設定するカレントディレクトリ
 */
export function chdir(dirpath: string): (err?: any) => Promise<void> {
	const cwd = process.cwd();
	process.chdir(dirpath);
	return function (err?: any): Promise<void> {
		process.chdir(cwd);
		return err ? Promise.reject(err) : Promise.resolve();
	};
}

export function mkdirpSync(p: string): void {
	p = path.resolve(p);
	try {
		fs.mkdirSync(p);
	} catch (e) {
		if (e.code === "ENOENT") {
			mkdirpSync(path.dirname(p));
			mkdirpSync(p);
		} else {
			let stat: any;
			try {
				stat = fs.statSync(p);
			} catch (e1) {
				throw e;
			}
			if (!stat.isDirectory())
				throw e;
		}
	}
}

/**
 * 指定ディレクトリ以下のすべてのファイルを合計したサイズをバイトで返す。
 * @param directoryPath 指定のディレクトリ
 */
export async function getTotalFileSize(directoryPath: string): Promise<number> {
	let totalSize = 0;

	const traverseDirectory = async function (currentPath: string): Promise<void> {
		const stat = await fs.promises.stat(currentPath);

		if (stat.isDirectory()) {
			const files = await fs.promises.readdir(currentPath);

			for (const file of files) {
				const filePath = path.join(currentPath, file);
				await traverseDirectory(filePath); // サブディレクトリの場合、再帰的に処理を行う
			}
		} else if (stat.isFile()) {
			totalSize += stat.size;
		}
	};

	await traverseDirectory(directoryPath);

	return totalSize;
}

/**
 * 指定ディレクトリ以下のすべてのファイルを再帰的に取得する
 * @param dir パス
 * @param baseDir ベース
 * @returns
 */
export function readdirRecursive(dir: string, baseDir: string = dir): string[] {
	let files: string[] = [];
	if (!fs.existsSync(dir)) return files;
	const items = fs.readdirSync(dir, { withFileTypes: true });
	for (const item of items) {
		const fullPath = path.join(dir, item.name);
		const relativePath = path.relative(baseDir, fullPath);
		if (item.isDirectory()) {
			files = files.concat(readdirRecursive(fullPath, baseDir));
		} else {
			files.push(relativePath);
		}
	}
	return files;
};

// require.resolve() がモックできないので関数をモックするため require.resolve() するだけの関数を切り出している
export function requireResolve(id: string, opts?: { paths?: string[] | undefined; basedir?: string }): string {
	return resolve.sync(id, { ...opts, preserveSymlinks: true });
}

/**
 * フォントファイルの拡張子からフォント形式を取得する。
 * @param filePath パス
 */
export function getFontFormat(filePath: string): string | null {
	const extension = path.extname(filePath);
	switch (extension) {
		case ".ttf":
			return "truetype";
		case ".otf":
			return "opentype";
		case ".woff":
			return "woff";
		case ".woff2":
			return "woff2";
	}

	return null;
};
