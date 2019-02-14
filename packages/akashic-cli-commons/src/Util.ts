import * as fs from "fs";
import * as path from "path";

export function invertMap(obj: {[key: string]: string}): {[key: string]: string[]};
export function invertMap(obj: {[key: string]: Object}, prop: string): {[key: string]: string[]};
export function invertMap(obj: {[key: string]: any}, prop?: string): {[key: string]: string[]} {
	var ret: {[key: string]: string[]} = {};
	Object.keys(obj).forEach((key: string) => {
		var v: string = prop ? obj[key][prop] : obj[key];
		(ret[v] || (ret[v] = [])).push(key);
	});
	return ret;
}

export function filterMap<S, D>(xs: S[], f: (v: S) => D): D[] {
	var result: D[] = [];
	xs.forEach((x) => {
		var mapped = f(x);
		if (mapped !== undefined)
			result.push(mapped);
	});
	return result;
}

export function makeModuleNameNoVer(name: string): string {
	var atPos = name.indexOf("@", 1); // 1 は scoped module の prefix 避け
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
	var cwd = process.cwd();
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
			var stat: any;
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
