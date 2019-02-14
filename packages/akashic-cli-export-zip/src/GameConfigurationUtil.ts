import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";

export function removeScriptFromFilePaths(gamejson: cmn.GameConfiguration, filePaths: string[]): void {
	let table: { [key: string]: boolean } = {};
	filePaths.forEach(p => table[p] = true);

	let assets: { [key: string]: cmn.AssetConfiguration } = {};
	Object.keys(gamejson.assets).forEach(aid => {
		const a = gamejson.assets[aid];
		if (a.type === "script" && table.hasOwnProperty(a.path))
			return;
		assets[aid] = gamejson.assets[aid];
	});
	gamejson.assets = assets;

	if (gamejson.globalScripts)
		gamejson.globalScripts = gamejson.globalScripts.filter(p => !table.hasOwnProperty(p));
}

export function makeScriptAssetPath(filename: string): string {
	return "script/" + filename + ".js";
}

export function findUniqueScriptAssetName(gamejson: cmn.GameConfiguration, prefix: string): string {
	let idTable: { [keys: string]: boolean } = {};
	let pathTable: { [key: string]: boolean } = {};

	Object.keys(gamejson.assets).forEach(aid => (idTable[aid] = pathTable[gamejson.assets[aid].path] = true));
	(gamejson.globalScripts || []).forEach(p => (idTable[p] = pathTable[p] = true));

	if (!idTable.hasOwnProperty(prefix) && !pathTable.hasOwnProperty(makeScriptAssetPath(prefix)))
		return prefix;
	let i = 0;
	while (idTable.hasOwnProperty(prefix + i) || pathTable.hasOwnProperty(makeScriptAssetPath(prefix + i)))
		++i;
	return prefix + i;
}

export function addScriptAsset(gamejson: cmn.GameConfiguration, prefix: string): string {
	const aid = findUniqueScriptAssetName(gamejson, prefix);
	const filePath = makeScriptAssetPath(aid);
	gamejson.assets[aid] = {
		type: "script",
		global: true,
		path: filePath
	};
	return filePath;
}

export function makeUniqueAssetPath(gamejson: cmn.GameConfiguration, assetPath: string): string {
	let targetAssetPath = assetPath;
	const targetDirName = path.dirname(assetPath);
	const targetExtName = path.extname(assetPath);
	const targetFileNamePrefix = path.basename(assetPath, targetExtName);
	const assetIds = Object.keys(gamejson.assets);
	for (let index = 0; assetIds.some(aid => gamejson.assets[aid].path === targetAssetPath); index++) {
		targetAssetPath = path.join(targetDirName, targetFileNamePrefix + index + targetExtName);
	}
	return targetAssetPath;
}

export function extractFilePaths(gamejson: cmn.GameConfiguration, basedir: string): string[] {
	let result: string[] = [];
	Object.keys(gamejson.assets).forEach(aid => {
		const a = gamejson.assets[aid];
		if (a.type !== "audio") {
			result.push(a.path);
			return;
		}

		// audio のみ拡張子を補完する特殊対応: 補完して存在するファイルのみ扱う
		[".ogg", ".aac", ".mp4"].forEach(ext => {
			try {
				if (fs.statSync(path.resolve(basedir, a.path + ext)).isFile())
					result.push(a.path + ext);
			} catch (e) {
				// do nothing.
			}
		});
	});
	(gamejson.globalScripts || []).forEach(p => result.push(p));
	return result;
}

export function extractScriptAssetFilePaths(gamejson: cmn.GameConfiguration): string[] {
	let result: string[] = [];
	Object.keys(gamejson.assets).forEach(aid => (gamejson.assets[aid].type === "script") && result.push(gamejson.assets[aid].path));
	(gamejson.globalScripts || []).forEach(p => (/\.js$/.test(p)) && result.push(p));
	return result;
}

export function isScriptJsFile(filePath: string): boolean {
	return /^script\/.+(\.js$)/.test(filePath);
}

export function isEmptyScriptJs(str: string): boolean {
	if (!str || str.length === 0) return true;

	// jsファイルの中身が、Typescriptのinterfaceの記述のみの場合は空と同様とする
	// TypeScirpt 2.2.0以下かminifyされた場合は、"use strict";だけの出力となる
	const regex = /^"use strict";[\r\n\s]*(Object.defineProperty\(exports,\s*("__esModule",)\s*?({\s*?value\s*:\s*?[true|!0]+\s*})\);)*$/;
	return regex.test(str.trim());
}
