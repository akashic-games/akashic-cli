import * as fs from "fs";
import { createRequire } from "module";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import type { ImageAssetConfigurationBase, NicoliveSupportedModes } from "@akashic/game-configuration";
import * as babel from "@babel/core";
import presetEnv from "@babel/preset-env";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import * as fsx from "fs-extra";
import type { OutputChunk, RollupBuild } from "rollup";
import { rollup } from "rollup";
import type { MinifyOptions } from "terser";
import { minify_sync } from "terser";
import * as utils from "../utils.js";
import { validateGameJson } from "../utils.js";
import { getFromHttps } from "./apiUtil.js";
import { NICOLIVE_SIZE_LIMIT_GAME_JSON, NICOLIVE_SIZE_LIMIT_TOTAL_FILE } from "./constants.js";
import * as gcu from "./GameConfigurationUtil.js";
import * as liceneUtil from "./licenseUtil.js";
import { transformPackSmallImages } from "./transformPackImages.js";

// NOTE: 以下のパッケージは型定義が存在しないか JS と型定義の齟齬があるため `require()` を用いている
const require = createRequire(import.meta.url);
const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const { convert, detect } = require("encoding-japanese");

export interface ConvertGameParameterObject {
	bundle?: boolean;
	babel?: boolean;
	minify?: boolean;
	minifyJs?: boolean;
	minifyJson?: boolean;
	terser?: MinifyOptions;
	packImage?: boolean;
	strip?: boolean;
	source?: string;
	hashLength?: number;
	dest: string;
	/**
	 * コマンドの出力を受け取るロガー。
	 * 省略された場合、akashic-cli-commons の `new ConsoleLogger()` 。
	 */
	logger?: cmn.Logger;
	exportInfo?: cmn.ExportZipInfo;
	omitUnbundledJs?: boolean;
	targetService?: cmn.ServiceType;
	nicolive?: boolean;
	resolveAkashicRuntime?: boolean;
	preservePackageJson?: boolean;
}

export function _completeConvertGameParameterObject(param: ConvertGameParameterObject): void {
	param.bundle = !!param.bundle;
	param.babel = !!param.babel;
	param.minify = !!param.minify;
	param.minifyJs = !!param.minifyJs;
	param.minifyJson = !!param.minifyJson;
	param.terser = param.terser;
	param.strip = !!param.strip;
	param.source = param.source || process.cwd();
	param.hashLength = param.hashLength || 0;
	param.logger = param.logger || new cmn.ConsoleLogger();
	param.exportInfo = param.exportInfo;
	param.omitUnbundledJs = !!param.omitUnbundledJs;
	param.targetService = param.targetService || "none";
	param.nicolive = !!param.nicolive;
	param.resolveAkashicRuntime = !!param.resolveAkashicRuntime;
	param.preservePackageJson = !!param.preservePackageJson;
}

export interface BundleResult {
	bundle: string;
	filePaths: string[];
}

interface ScriptAssetContent {
	id: string;
	path: string;
	code: string;
	global?: boolean;
	preload?: boolean;
	exports?: string[];
}

export async function bundleScripts(
	gamejson: cmn.GameConfiguration,
	basedir: string,
	optimizeScript?: (code: string) => string,
): Promise<BundleResult> {
	if (gamejson.environment?.["sandbox-runtime"] === "3") {
		const scriptAssetContents: ScriptAssetContent[] = [];

		for (const [assetId, asset] of Object.entries(gamejson.assets)) {
			if (asset.type !== "script") continue;

			let code = fs.readFileSync(path.resolve(basedir, asset.path)).toString();
			code = optimizeScript ? optimizeScript(code) : code;

			scriptAssetContents.push({
				...asset,
				id: assetId,
				code,
			});
		}

		for (const globalScript of gamejson.globalScripts ?? []) {
			let code = fs.readFileSync(path.resolve(basedir, globalScript)).toString();
			code = optimizeScript ? optimizeScript(code) : code;

			scriptAssetContents.push({
				id: globalScript,
				path: globalScript,
				global: true,
				code,
			});
		}

		return {
			bundle: generateAssetBundleString(scriptAssetContents),
			filePaths: scriptAssetContents.map(content => content.path),
		};
	}

	const entryPoint = gamejson.main || gamejson.assets.mainScene.path;

	const inputOptions = {
		input: path.join(basedir, entryPoint),
		external: ["g"],
		plugins: [commonjs(), json(), nodeResolve({ preferBuiltins: true })]
	};

	let bundle: RollupBuild;
	try {
		bundle = await rollup(inputOptions);
		const rollupOutput = await bundle.generate({
			file: path.join(basedir, "aez_bundle_main.js"),
			format: "cjs"
		});
		const chunk = rollupOutput.output.find(chunkOrAsset => chunkOrAsset.type === "chunk");
		const { code, moduleIds } = chunk as OutputChunk;
		const filePaths = moduleIds.map(p => cmn.Util.makeUnixPath(path.relative(basedir, p)));
		return { bundle: code, filePaths };
	 } finally {
		if (bundle)
			await bundle.close();
	 }
}

function generateAssetBundleString(assets: ScriptAssetContent[]): string {
	return `module.exports={assets:{${
		assets.map(
			asset => [
				`"${asset.id}": {`,
				"type:\"script\",",
				`path:"${asset.path}",`,
				`global:${!!asset.global},`,
				(asset.preload ? `preload:${!!asset.preload},` : ""),
				"execute: rv => {",
				[
					"\n'use strict';\n",
					"const module = rv.module;",
					"const exports = module.exports;",
					"const require = module.require;",
					"const __dirname = rv.dirname;",
					"const __filename = rv.filename;",
					`\n${asset.code}\n`,
					(asset.exports ?? [])
						.map(key => `exports["${key}"] = typeof ${key} !== "undefined" ? ${key} : undefined;`)
						.join(""),
					"return module.exports;\n",
				].join(""),
				"},\n",
				"},",
			].join("")
		).join("")
	}}}`;
}

const babelOption = {
	presets: [
		babel.createConfigItem([presetEnv, {
			modules: false,
			targets: {
				"ie": 10
			}
		}],
		{ type: "preset" })
	]
};

export function convertGame(param: ConvertGameParameterObject): Promise<void> {
	function optimizeScript(script: string): string {
		// この順序は入れ替えられない (先に minify すると babel がコードを整形してしまう)
		const downpiled = param.babel ? babel.transform(script, babelOption).code : script;
		const minified = param.minifyJs ? minify_sync(downpiled, param.terser).code : downpiled;
		return minified;
	}

	_completeConvertGameParameterObject(param);
	let gamejson: cmn.GameConfiguration;

	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read(path.join(param.source, "game.json"), param.logger))
		.then(async (result: cmn.GameConfiguration) => {
			gamejson = result;
			Object.values(gamejson.assets).forEach(asset => utils.warnLackOfAudioFile(asset));

			validateGameJson(gamejson);

			if (param.nicolive) {
				validateGameJsonForNicolive(gamejson);
			}

			// export-zip実行時のバージョンとオプションを追記
			if (param.exportInfo) {
				gamejson.exportZipInfo = {
					version: param.exportInfo.version,
					option: param.exportInfo.option
				};
			}
			// 全スクリプトがES5構文になっていることを確認する
			let errorMessages: string[] = [];
			const filePaths = gcu.extractScriptAssetFilePaths(gamejson);
			for (const filePath of filePaths) {
				const code = fs.readFileSync(path.resolve(param.source, filePath)).toString();
				if (!param.babel) {
					const errInfo = await cmn.LintUtil.validateEs5Code(code);
					errorMessages = errorMessages.concat(
						errInfo.map(info => `${filePath}(${info.line}:${info.column}): ${info.message}`)
					);
				}
			}
			if (errorMessages.length > 0) {
				param.logger.warn("Non-ES5 syntax found.\n" + errorMessages.join("\n"));
			}

			if (!param.bundle)
				return null;

			return bundleScripts(gamejson, param.source, optimizeScript);
		})
		.then(async (bundleResult) => {
			const files: string[] = param.strip ?
				gcu.extractFilePaths(gamejson, param.source, param.preservePackageJson) :
				cmn.Util.readdirRecursive(param.source).map(p => cmn.Util.makeUnixPath(p));

			let bundledFilePaths: string[] = [];
			const preservingFilePathSet = new Set<string>(files);
			if (bundleResult) {
				// 不要なスクリプトを削る。
				// bundle されたものは .js とは限らない (.json がありうる) ことに注意。
				bundledFilePaths = bundleResult.filePaths;
				bundledFilePaths.forEach(p => preservingFilePathSet.delete(p));

				if (param.omitUnbundledJs) {
					// omitUnbundledJs ならば全てのスクリプト (.js) を削る。
					// (bundle されたスクリプトは不要、されなかったスクリプトは omit なので区別せず全部削ればよい)
					files.filter(p => p.endsWith(".js")).forEach(p => preservingFilePathSet.delete(p));
				}
			}

			// operation plugin に登録されているスクリプトファイルは bundle されていても残しておく必要がある
			const operationPluginRoots = (gamejson.operationPlugins ?? []).map(plugin => plugin.script);
			for (const pluginRoot of operationPluginRoots) {
				let actualPluginRoot: string;
				if (pluginRoot.startsWith("./")) {
					actualPluginRoot = pluginRoot;
				} else {
					actualPluginRoot = path.relative(param.source, require.resolve(pluginRoot, { paths: [param.source] }));
					if (actualPluginRoot.startsWith("../"))
						throw new Error(`${pluginRoot} refers outside of the game (${actualPluginRoot})`);
				}
				const pluginRootAbsPath = cmn.Util.makeUnixPath(path.join(param.source, actualPluginRoot));
				const pluginRootDir = path.dirname(pluginRootAbsPath);
				// TODO: Promise#then() と async/await が混在する状態を改め、 async/await に統一する
				const pluginScripts = await cmn.NodeModules.listScriptFiles(
					pluginRootDir,
					"./" + path.basename(pluginRootAbsPath),
					param.logger,
					true
				);
				pluginScripts.forEach(pluginScript => {
					const realPath = cmn.Util.makeUnixPath(path.relative(param.source, path.join(pluginRootDir, pluginScript)));
					if (files.indexOf(realPath) !== -1) {
						// TODO: 操作プラグインによって preserve するファイルは bundle から除外する必要がある
						preservingFilePathSet.add(realPath);
						if (bundledFilePaths.indexOf(realPath) !== -1) {
							console.warn(
								`${realPath} IS DUPLICATED: the file is required from both the game and an operation plugin.`
								+ "The current akashic export command duplicates the file. "
								+ "This may breaks the code, especially using the instanceof operator."
								+ "Try --no-bundle option if you have a trouble."
							);
						}
					}
				});
			}

			const filePaths = bundleResult ? bundledFilePaths : Array.from(preservingFilePathSet);
			const existLicense = await liceneUtil.writeLicenseTextFile(param.source, param.dest, filePaths);
			const prefixCode = existLicense ? liceneUtil.LICENSE_TEXT_PREFIX : "";

			preservingFilePathSet.forEach(p => {
				const buff = fs.readFileSync(path.resolve(param.source, p));
				cmn.Util.mkdirpSync(path.dirname(path.resolve(param.dest, p)));
				let value: string | Buffer =
					(gcu.isScriptJsFile(p)) ? optimizeScript(encodeToString(buff).trim()) :
					(param.minifyJson && gcu.isTextJsonFile(p)) ? JSON.stringify(JSON.parse(encodeToString(buff))) :
					gcu.isMaybeTextFile(p) ? encodeToString(buff) : buff;

				if (bundleResult === null && gamejson.main.includes(p)) {
					value = prefixCode + value;
				}
				fs.writeFileSync(path.resolve(param.dest, p), value);
			});

			if (gamejson.environment?.["sandbox-runtime"] === "3" && bundleResult) {
				const assetBundlePath = gcu.addScriptAsset(gamejson, "aez_asset_bundle");
				const assetBundleAbsPath = path.resolve(param.dest, assetBundlePath);
				cmn.Util.mkdirpSync(path.dirname(assetBundleAbsPath));
				fs.writeFileSync(assetBundleAbsPath, bundleResult.bundle);
				gamejson.assetBundle = "./" + assetBundlePath;
				preservingFilePathSet.add(assetBundlePath);
			}

			// コピーしなかったアセットやファイルをgame.jsonから削除する
			gcu.removeScriptAssets(gamejson, (filePath: string) => preservingFilePathSet.has(filePath));
			gcu.removeGlobalScripts(gamejson, (filePath: string) => preservingFilePathSet.has(filePath));

			if (param.bundle && param.omitUnbundledJs) {
				 // omitUnbundledJs によって js ファイルが全て省かれる場合は警告する
				const noBundledJs: string[] = files.filter(p => p.endsWith(".js") && !bundledFilePaths.includes(p));
				noBundledJs.forEach(p => {
					if (!preservingFilePathSet.has(p)) {
						console.warn(`excluded ${p} due to unreachable/unhandled.`);
					}
				});
			}

			if (param.targetService === "nicolive") {
				addUntaintedToImageAssets(gamejson);
			}

			if (param.resolveAkashicRuntime) {
				await addGameJsonValuesForNicoLive(gamejson);
			}

			if (gamejson.environment?.niconico) {
				gamejson.environment.nicolive = gamejson.environment.niconico;
				delete gamejson.environment.niconico;
			}

			if (bundleResult === null || gamejson.environment?.["sandbox-runtime"] === "3") {
				return;
			}

			let entryPointPath: string;
			if (!!gamejson.main) {
				entryPointPath = gcu.addScriptAsset(gamejson, "aez_bundle_main");
				gamejson.main = "./" + entryPointPath;
			} else {
				entryPointPath = gcu.makeUniqueAssetPath(gamejson, "script/mainScene.js");
				gamejson.assets.mainScene = {
					type: "script",
					global: true,
					path: entryPointPath
				};
			}
			const entryPointAbsPath = path.resolve(param.dest, entryPointPath);
			cmn.Util.mkdirpSync(path.dirname(entryPointAbsPath));
			const code = optimizeScript(bundleResult.bundle);
			fs.writeFileSync(entryPointAbsPath, prefixCode + code);
		})
		.then(() => {
			if (!param.packImage) return;
			return transformPackSmallImages(gamejson, param.dest);
		})
		.then(() => {
			if (param.hashLength > 0) {
				const hashLength = Math.ceil(param.hashLength);
				try {
					cmn.Renamer.renameAssetFilenames(gamejson, param.dest, hashLength);
				} catch (error) {
					// ファイル名のハッシュ化に失敗した場合、throwして作業中のコピー先ファイルを削除する
					fsx.removeSync(path.resolve(param.dest));
					if (error.message === cmn.Renamer.ERROR_FILENAME_CONFLICT) {
						throw new Error("Hashed filename conflict. Use larger hash-filename param on command line.");
					}
					throw error;
				}
			}
			return cmn.ConfigurationFile.write(
				gamejson, path.resolve(param.dest, "game.json"), param.logger, { minify: param.minifyJson }
			);
		})
		.then(async () => {
			// ニコ生環境向けの簡易ファイルサイズチェック
			if (!param.nicolive) return;

			// 1. game.json のサイズ確認
			const gamejsonSize = await cmn.Util.getTotalFileSize(path.resolve(param.dest, "game.json"));
			if (NICOLIVE_SIZE_LIMIT_GAME_JSON < gamejsonSize) {
				param.logger.warn(
					`The size of game.json is larger than ${cmn.asHumanReadable(NICOLIVE_SIZE_LIMIT_GAME_JSON)} ` +
					`(${cmn.asHumanReadable(gamejsonSize)}). Too large game.json may be rejected as nicolive game.`
				);
			}

			// 2. 展開後のファイルサイズ確認
			const totalFileSize = await cmn.Util.getTotalFileSize(path.resolve(param.dest));
			if (NICOLIVE_SIZE_LIMIT_TOTAL_FILE < totalFileSize) {
				param.logger.warn(
					`The total size of the files is larger than ${cmn.asHumanReadable(NICOLIVE_SIZE_LIMIT_TOTAL_FILE)} ` +
					`(${cmn.asHumanReadable(totalFileSize)}). Too large file may be rejected as nicolive game.`
				);
			}
		});
}

/**
 * 指定のgameJson中の全てのImageAssetに untainted:true を付与する
 */
function addUntaintedToImageAssets(gameJson: cmn.GameConfiguration): void {
	Object.keys(gameJson.assets).forEach(key => {
		if (gameJson.assets[key].type === "image") {
			const asset = gameJson.assets[key] as ImageAssetConfigurationBase;
			if (!asset.hint) {
				asset.hint = {};
			}
			asset.hint.untainted = true;
		}
	});
}

/**
 * nicolive 用に game.json に値を追加する。
 */
async function addGameJsonValuesForNicoLive(gameJson: cmn.GameConfiguration): Promise<void> {
	// game.jsonへの追記
	if (!gameJson.environment) {
		gameJson.environment = {};
	}
	if (!gameJson.environment.external) {
		gameJson.environment.external = {};
	}
	gameJson.environment.external.send = "0";
	if (gameJson.environment["akashic-runtime"]) {
		return;
	}

	const versionInfo = JSON.parse(await getFromHttps(
		"https://raw.githubusercontent.com/akashic-games/akashic-runtime-version-table/master/versions.json"
	));

	gameJson.environment["akashic-runtime"] = { version: "" };
	if (!gameJson.environment["sandbox-runtime"] || gameJson.environment["sandbox-runtime"] === "1") {
		gameJson.environment["akashic-runtime"].version = "~" + versionInfo.latest["1"];
	} else {
		gameJson.environment["akashic-runtime"].version =
			"~" + versionInfo.latest[gameJson.environment["sandbox-runtime"]];
		if (!gameJson.renderers || gameJson.renderers.indexOf("webgl") === -1) {
			gameJson.environment["akashic-runtime"].flavor = "-canvas";
		}
	}
}

// Buffer を文字列に変換
function encodeToString(buf: Buffer): string {
	const array = new Uint8Array(buf);
	if (detect(array, "UTF8")) {
		// NOTE: UTF8 であれば Buffer#toString() を利用 (build in メソッドのため encoding-japanese による変換よりも早いだろうと仮定している)
		return buf.toString();
	}
	return convert(array, { from: "AUTO", to: "UNICODE", type: "string" });
}

/**
 * --nicolive オプション時の game.json の　validate
 */
export function validateGameJsonForNicolive(gamejson: cmn.GameConfiguration): void {
	const nicolive = gamejson.environment?.nicolive;
	if (!nicolive) {
		throw new Error("environment.nicolive does not exist in game.json.");
	}
	const supportedModesValues: NicoliveSupportedModes[] = ["single", "ranking", "multi_admission", "multi"];
	const supportedModes = nicolive.supportedModes;
	const preferredSessionParameters = nicolive.preferredSessionParameters;

	if (!supportedModes) {
		throw new Error("nicolive.supportedModes does not exist in game.json.");
	}
	if (!Array.isArray(supportedModes) ) {
		throw new Error("Invalid value: Specify an array for nicolive.supportedModes.");
	}
	if (supportedModes.length === 0) {
		throw new Error("Invalid value: nicolive.supportedModes is an empty array.");
	}
	supportedModes.forEach(v => {
		const exists = supportedModesValues.includes(v);
		if (!exists) {
			console.warn(`unknown value '${v}' found in nicolive.supportedModes.`);
		}
	});

	if (preferredSessionParameters && preferredSessionParameters.totalTimeLimit) {
		if (typeof preferredSessionParameters.totalTimeLimit !== "number") {
			throw new Error("Invalid Value: Specify a number value for nicolive.preferredSessionParameters.totalTimeLimit.");
		}
		if (preferredSessionParameters.totalTimeLimit < 20 || preferredSessionParameters.totalTimeLimit > 200) {
			throw new Error("Invalid Value: Specify a value between 20 and 200 for nicolive.preferredSessionParameters.totalTimeLimit.");
		}
	}
}
