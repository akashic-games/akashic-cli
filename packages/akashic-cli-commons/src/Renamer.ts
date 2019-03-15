import * as path from "path";
import * as fs from "fs";
import * as fsx from "fs-extra";
import { sha256 } from "js-sha256";
import { GameConfiguration } from "./GameConfiguration";

export const ERROR_FILENAME_CONFLICT = "ERROR_FILENAME_CONFLICT";
export const ERROR_PATH_INCLUDE_ANCESTOR = "ERROR_PATH_INCLUDE_ANCESTOR";

/**
 * 与えられたファイルパスのファイル名部分を、ファイルパスから計算したハッシュ値で置き換え、 files/ 以下のファイルパスにして返す
 * @param filepath 変換するファイルパス
 * @param nameLength ファイル名の文字数の最大値
 */
export function hashFilepath(filepath: string, nameLength: number): string {
	const hashedFilename = sha256(filepath).slice(0, nameLength);
	const extname = path.extname(filepath);
	return path.posix.join("files", hashedFilename + extname);
}

/**
 * アセット・ globalScripts のファイル名をファイルパスに基づいてハッシュ化し、アセットファイル名をリネームする
 * @param content 読み込む game.json
 * @param basedir 読み込む gamejson が置かれているパス
 * @param maxHashLength ハッシュ化後のファイル名の文字数の最大値。省略された場合、20文字
 */
export function renameAssetFilenames(content: GameConfiguration, basedir: string, maxHashLength: number = 20): void {
	const processedAssetPaths: Set<string> = new Set();
	_renameAssets(content, basedir, maxHashLength, processedAssetPaths);
	_renameGlobalScripts(content, processedAssetPaths, basedir, maxHashLength);
}

/**
 * 指定されたファイルをリネームする
 * @param basedir リネームするファイルが置かれているパス
 * @param filePath リネームするファイルのパス
 * @param newFilePath リネームされたファイルのパス
 */
function _renameFilename(basedir: string, filePath: string, newFilePath: string, processedAssetPaths: Set<string>): void {
	try {
		fs.accessSync(path.resolve(basedir, newFilePath));
	} catch (error) {
		if (error.code === "ENOENT") {
			fsx.mkdirsSync(path.dirname(path.resolve(basedir, newFilePath)));
			fs.renameSync(path.resolve(basedir, filePath), path.resolve(basedir, newFilePath));
			return;
		}
		throw error;
	}
	throw new Error(ERROR_FILENAME_CONFLICT);
}

function _renameAudioFilename(basedir: string, filePath: string, newFilePath: string, processedAssetPaths: Set<string>): void {
	const extTypes = [".ogg", ".aac", ".mp4"];
	extTypes.forEach((ext) => {
		try {
			fs.accessSync(path.resolve(basedir, filePath + ext));
			_renameFilename(basedir, filePath + ext, newFilePath + ext, processedAssetPaths);
		} catch (error) {
			if (error.code === "ENOENT") return; // 全てのオーディオ拡張子が揃っているとは限らない
			throw error;
		}
	});
}

function _renameAssets(content: GameConfiguration, basedir: string, maxHashLength: number, processedAssetPaths: Set<string>): void {
	const assetNames = Object.keys(content.assets);
	const dirpaths: string[] = [];
	assetNames.forEach((name) => {
		const filePath = content.assets[name].path;
		dirpaths.push(path.dirname(filePath));
		const hashedFilePath = hashFilepath(filePath, maxHashLength);
		const isRenamedAsset = processedAssetPaths.has(hashedFilePath);

		content.assets[name].path = hashedFilePath;
		content.assets[name].virtualPath = filePath;
		processedAssetPaths.add(hashedFilePath);
		if (isRenamedAsset) return; // 同じパスのアセットを既にハッシュ化済みの場合、ファイルはリネーム済み
		if (content.assets[name].type !== "audio") {
			_renameFilename(basedir, filePath, hashedFilePath, processedAssetPaths);
		} else {
			_renameAudioFilename(basedir, filePath, hashedFilePath, processedAssetPaths);
		}
	});
	const assetAncestorDirs = _listAncestorDirNames(dirpaths);
	_removeDirectoryIfEmpty(assetAncestorDirs, basedir);
}

function _renameGlobalScripts(content: GameConfiguration, processedAssetPaths: Set<string>, basedir: string, maxHashLength: number): void {
	if (content.globalScripts) {
		content.globalScripts.forEach((name: string, idx: number) => {
			const assetname = "a_e_z_" + idx;
			const hashedFilePath = hashFilepath(name, maxHashLength);
			const isRenamedAsset = processedAssetPaths.has(hashedFilePath);

			content.assets[assetname] = {
				type: /\.json$/i.test(name) ? "text" : "script",
				virtualPath: name,
				path: hashedFilePath,
				global: true
			};
			processedAssetPaths.add(hashedFilePath);
			if (isRenamedAsset) return; // 同じパスのアセットを既にハッシュ化済みの場合、ファイルはリネーム済み
			_renameFilename(basedir, name, hashedFilePath, processedAssetPaths);
		});

		const assetDirs = _listAncestorDirNames(content.globalScripts.map((filepath) => path.dirname(filepath)));
		_removeDirectoryIfEmpty(assetDirs, basedir);
	}
	content.globalScripts = [];
}

export function _removeDirectoryIfEmpty(dirpaths: string[], basedir: string): void {
	// パス文字列長でソートすることで、空ディレクトリしかないツリーでも末端から削除できるようにする
	dirpaths.sort((a, b) => (b.length - a.length));
	dirpaths.forEach((dirpath) => {
		const dirFullPath = path.resolve(basedir, dirpath);
		if (/^\.\./.test(path.relative(basedir, dirFullPath))) throw new Error(ERROR_PATH_INCLUDE_ANCESTOR);
		try {
			fs.accessSync(dirFullPath);
			fs.rmdirSync(dirFullPath);
		} catch (error) {
			if (["ENOENT", "EEXIST", "ENOTEMPTY"].indexOf(error.code) !== -1) return;
			throw error;
		}
	});
}

/**
 * ディレクトリの相対パスを受け取り、そのパス内で表現されているもっとも祖先にあたるディレクトリまでの各祖先ディレクトリをリストで返す
 */
export function _listAncestorDirNames(dirpaths: string[]): string[] {
	const result: Set<string> = new Set();
	dirpaths.forEach((dirpath) => {
		let currentDir = path.normalize(dirpath);
		while (currentDir.indexOf(path.sep) !== -1) {
			result.add(currentDir);
			currentDir = path.dirname(currentDir);
		}
		// path.normalizeによって `./` が消えるためwhile中で拾えないrootパスをaddする
		if (currentDir !== "..") result.add(currentDir);
	});
	return  Array.from(new Set(result));
}
