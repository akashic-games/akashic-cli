import * as fs from "fs";
import * as fsx from "fs-extra";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as browserify from "browserify";
import readdir = require("fs-readdir-recursive");
import * as gcu from "./GameConfigurationUtil";
import * as UglifyJS from "uglify-js";
import * as babel from "@babel/core";
import * as presetEnv from "@babel/preset-env";

export interface ConvertGameParameterObject {
	bundle?: boolean;
	babel?: boolean;
	minify?: boolean;
	strip?: boolean;
	source?: string;
	hashLength?: number;
	dest: string;
	omitEmptyJs?: boolean;
	/**
	 * コマンドの出力を受け取るロガー。
	 * 省略された場合、akashic-cli-commons の `new ConsoleLogger()` 。
	 */
	logger?: cmn.Logger;
	exportInfo?: cmn.ExportZipInfo;
	omitUnbundledJs?: boolean;
	targetService?: cmn.ServiceType;
}

export function _completeConvertGameParameterObject(param: ConvertGameParameterObject): void {
	param.bundle = !!param.bundle;
	param.babel = !!param.babel;
	param.minify = !!param.minify;
	param.strip = !!param.strip;
	param.source = param.source || process.cwd();
	param.hashLength = param.hashLength || 0;
	param.logger = param.logger || new cmn.ConsoleLogger();
	param.omitEmptyJs = !!param.omitEmptyJs;
	param.exportInfo = param.exportInfo;
	param.omitUnbundledJs = !!param.omitUnbundledJs;
	param.targetService = param.targetService || "none";
}

export interface BundleResult {
	bundle: string;
	filePaths: string[];
}

export function bundleScripts(entryPoint: string, basedir: string): Promise<BundleResult> {
	const b = browserify({
		entries: entryPoint,
		basedir,
		builtins: false,
		standalone: "aez_bundle_main"
	});
	b.external("g");
	const filePaths: string[] = [];
	b.on("dep", (row: any) => {
		filePaths.push(cmn.Util.makeUnixPath(path.relative(basedir, row.file)));
	});
	return new Promise<BundleResult>((resolve, reject) => {
		b.bundle((err: any, buf: Buffer) => {
			if (err)
				return reject(err);
			resolve({ bundle: buf.toString(), filePaths });
		});
	});
}

export function convertGame(param: ConvertGameParameterObject): Promise<void> {
	_completeConvertGameParameterObject(param);
	let gamejson: cmn.GameConfiguration;

	cmn.Util.mkdirpSync(path.dirname(path.resolve(param.dest)));
	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read(path.join(param.source, "game.json"), param.logger))
		.then((result: cmn.GameConfiguration) => {
			gamejson = result;
			// export-zip実行時のバージョンとオプションを追記
			if (param.exportInfo) {
				gamejson.exportZipInfo = {
					version: param.exportInfo.version,
					option: param.exportInfo.option
				};
			}
			// 全スクリプトがES5構文になっていることを確認する
			let errorMessages: string[] = [];
			gcu.extractScriptAssetFilePaths(gamejson).forEach(filePath => {
				const code = fs.readFileSync(path.resolve(param.source, filePath)).toString();
				if (!param.babel) {
					errorMessages = errorMessages.concat(
						cmn.LintUtil.validateEs5Code(code).map(info => `${filePath}(${info.line}:${info.column}): ${info.message}`)
					);
				}
			});
			if (errorMessages.length > 0) {
				param.logger.warn("Non-ES5 syntax found.\n" + errorMessages.join("\n"));
			}
			if (!param.bundle)
				return null;
			return bundleScripts(gamejson.main || gamejson.assets.mainScene.path, param.source);
		})
		.then(async (bundleResult) => {
			const files: string[] = param.strip ?
				gcu.extractFilePaths(gamejson, param.source) :
				readdir(param.source).map(p => cmn.Util.makeUnixPath(p));

			let bundledFilePaths: string[] = [];
			const preservingFilePathSet = new Set<string>(files);
			if (bundleResult) {
				bundledFilePaths = bundleResult.filePaths;
				// 不要なスクリプトを削る。
				// omitUnbundledJs ならば全スクリプト取り除く点に注意。
				// (bundle されたスクリプトは不要、されなかったスクリプトは omit なので)
				// また bundle されたものは .js とは限らない (.json がありうる) ことにも注意。
				let unneeded = bundleResult.filePaths;
				if (param.omitUnbundledJs) {
					unneeded = unneeded.concat(files.filter(p => p.endsWith(".js")));
				}
				unneeded.forEach(p => preservingFilePathSet.delete(p));
			}

			// operation plugin に登録されているスクリプトファイルは bundle されていても残しておく必要がある
			const operationPluginRoots = (gamejson.operationPlugins ?? []).map(plugin => plugin.script.replace(/^\.\//g, ""));
			for (let pluginRoot of operationPluginRoots) {
				const pluginRootAbsPath = cmn.Util.makeUnixPath(path.join(param.source, pluginRoot));  // abs
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

			preservingFilePathSet.forEach(p => {
				let buff = fs.readFileSync(path.resolve(param.source, p));
				if (param.omitEmptyJs && gcu.isScriptJsFile(p) && gcu.isEmptyScriptJs(buff.toString().trim())) {
					Object.keys(gamejson.assets).some((key) => {
						if (gamejson.assets[key].type === "script" && gamejson.assets[key].path === p) {
							gamejson.assets[key].global = false;
							return true;
						}
						return false;
					});
				}
				cmn.Util.mkdirpSync(path.dirname(path.resolve(param.dest, p)));
				const value: string | Buffer =
					(param.babel && gcu.isScriptJsFile(p)) ? babel.transform(buff.toString().trim(), babelOption).code : buff;
				fs.writeFileSync(path.resolve(param.dest, p), value);
			});
			// コピーしなかったアセットやファイルをgmae.jsonから削除する
			gcu.removeScriptAssets(gamejson, (filePath: string) => preservingFilePathSet.has(filePath));
			gcu.removeGlobalScripts(gamejson, (filePath: string) => preservingFilePathSet.has(filePath));

			if (param.targetService === "nicolive") {
				addUntaintedToImageAssets(gamejson);
			}

			if (bundleResult === null) {
				return;
			}
			let entryPointPath: string;
			if (!!gamejson.main) {
				entryPointPath = gcu.addScriptAsset(gamejson, "aez_bundle_main");
				gamejson.main = "./" + entryPointPath;
			} else {
				entryPointPath = gcu.makeUniqueAssetPath(gamejson, "script/mainScene.js");
				gamejson.assets["mainScene"] = {
					type: "script",
					global: true,
					path: entryPointPath
				};
			}
			const entryPointAbsPath = path.resolve(param.dest, entryPointPath);
			cmn.Util.mkdirpSync(path.dirname(entryPointAbsPath));
			const code = param.babel ? babel.transform(bundleResult.bundle, babelOption).code : bundleResult.bundle;
			fs.writeFileSync(entryPointAbsPath, code);
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
			return cmn.ConfigurationFile.write(gamejson, path.resolve(param.dest, "game.json"), param.logger);
		})
		.then(() => {
			if (!param.minify)
				return;
			const scriptAssetPaths = gcu.extractScriptAssetFilePaths(gamejson).map(p => path.resolve(param.dest, p));
			scriptAssetPaths.forEach(p => {
				const code = fs.readFileSync(p).toString();
				fs.writeFileSync(p, UglifyJS.minify(code).code);
			});
		});
}


/**
 * 指定のgameJson中の全てのImageAssetに untainted:true を付与する
 */
function addUntaintedToImageAssets(gameJson: cmn.GameConfiguration): void {
	Object.keys(gameJson.assets).forEach(key => {
		if (gameJson.assets[key].type === "image") {
			if (!gameJson.assets[key].hint) {
				gameJson.assets[key].hint = {};
			}
			gameJson.assets[key].hint.untainted = true;
		}
	});
}
