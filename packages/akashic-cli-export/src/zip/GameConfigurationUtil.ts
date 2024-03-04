import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";

export function removeScriptAssets(gamejson: cmn.GameConfiguration, filter: (filepath: string) => boolean): void {
	Object.keys(gamejson.assets).forEach(key => {
		const asset = gamejson.assets[key];
		if (asset.type === "script" && !filter(asset.path)) {
			delete gamejson.assets[key];
		}
	});
}

export function removeGlobalScripts(gamejson: cmn.GameConfiguration, filter: (filepath: string) => boolean): void {
	if (gamejson.globalScripts) {
		gamejson.globalScripts = gamejson.globalScripts.filter((p: string) => filter(p));
	}
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
		targetAssetPath = path.posix.join(targetDirName, targetFileNamePrefix + index + targetExtName);
	}
	return targetAssetPath;
}

export function extractFilePaths(gamejson: cmn.GameConfiguration, basedir: string, preservePackageJson: boolean = false): string[] {
	let result: string[] = [];
	Object.keys(gamejson.assets).forEach(aid => {
		const a = gamejson.assets[aid];
		if (a.type !== "audio") {
			result.push(a.path);
			return;
		}

		// audio のみ拡張子を補完する特殊対応: 補完して存在するファイルのみ扱う
		cmn.KNOWN_AUDIO_EXTENSIONS.forEach(ext => {
			try {
				if (fs.statSync(path.resolve(basedir, a.path + ext)).isFile())
					result.push(a.path + ext);
			} catch (e) {
				// do nothing.
			}
		});
		// if
	});
	(gamejson.globalScripts || []).forEach(p => result.push(p));
	if (preservePackageJson) result = Array.from(
		new Set(result.concat(cmn.NodeModules.listPackageJsonsFromScriptsPath(basedir, gamejson.globalScripts))));
	return result;
}

export function extractScriptAssetFilePaths(gamejson: cmn.GameConfiguration): string[] {
	let result: string[] = [];
	Object.keys(gamejson.assets).forEach(aid => (gamejson.assets[aid].type === "script") && result.push(gamejson.assets[aid].path));
	(gamejson.globalScripts || []).forEach(p => (/\.js$/.test(p)) && result.push(p));
	return result;
}

export function isScriptJsFile(filePath: string): boolean {
	return /^(script|assets)\/.+(\.js$)/.test(filePath);
}

export function isTextJsonFile(filePath: string): boolean {
	return /^(text|assets)\/.+(\.json$)/.test(filePath);
}

// (おそらく)テキストファイルであるかどうか。以下であれば真を返す。
// * script ディレクトリ以下にある拡張子が .js のファイル
// * text ディレクトリ以下にあるすべてのファイル
// * assets ディレクトリ以下にある拡張子が .txt と .json のファイル
export function isMaybeTextFile(filePath: string): boolean {
	if (isScriptJsFile(filePath)) {
		return true;
	}
	if (isTextJsonFile(filePath)) {
		return true;
	}
	return /^((text\/.+)|(assets\/.+\.(txt|json)))$/.test(filePath);
}
