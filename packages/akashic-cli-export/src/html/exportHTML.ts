
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import archiver = require("archiver");
import * as fsx from "fs-extra";
import { readdirRecursive } from "../utils.js";
import { promiseConvertBundle } from "./convertBundle.js";
import { promiseConvertNoBundle } from "./convertNoBundle.js";
import type { ConvertTemplateParameterObject } from "./convertUtil.js";
import * as Utils from "./Utils.js";

export interface ExportHTMLParameterObject extends ConvertTemplateParameterObject {
	quiet?: boolean;
	bundle?: boolean;
	hashLength?: number;
	compress?: boolean;
}

export function _completeExportHTMLParameterObject(p: ExportHTMLParameterObject): ExportHTMLParameterObject {
	const param = {...p};
	const source = param.source ? param.source : "./";
	param.source = path.resolve(param.cwd, source);
	param.output = param.output ? path.resolve(param.cwd, param.output) : undefined;
	param.logger = param.logger || new cmn.ConsoleLogger();
	return param;
}

export function promiseExportHtmlRaw(param: ExportHTMLParameterObject): Promise<string> {
	let gamepath: string;

	param.logger.info("exporting content into html...");
	if (!param.strip && param.output != null && !/^\.\./.test(path.relative(param.source, param.output))) {
		param.logger.warn("The output path overlaps with the game directory: files will be exported into the game directory.");
		param.logger.warn("NOTE that after this, exporting this game with --no-strip option may include the files.");
	}
	return new Promise<void>((resolve, reject) => {
		if (!param.output) {
			param.output = fs.mkdtempSync(path.join(os.tmpdir(), "akashic-export-html-tmp-"));
			return resolve();
		}
		fs.stat(path.resolve(param.output), (error: any, stat: any) => {
			if (error) {
				if (error.code !== "ENOENT") {
					return reject("Output directory has bad status. Error code " + error.code);
				}
				fs.mkdir(path.resolve(param.output), (err: any) => {
					if (err) {
						return reject("Create " + param.output + " directory failed.");
					}
					resolve();
				});
			} else if (stat) {
				if (!stat.isDirectory()) {
					return reject(param.output + " is not directory.");
				}
				if (!param.force) {
					return reject("The output directory " + param.output + " already exists. Cannot overwrite without force option.");
				}
				resolve();
			}
		});
	})
		.then(() => {
			if (param.hashLength === 0) return param.source;
			return createRenamedGame(param.source, param.hashLength, param.logger);
		})
		.then((currentGamepath: string) => {
			gamepath = currentGamepath;
			const convertParam: ConvertTemplateParameterObject = {
				output: param.output,
				logger: param.logger,
				strip: param.strip,
				minify: param.minify,
				magnify: param.magnify,
				force: param.force,
				source: gamepath,
				cwd: param.cwd,
				injects: param.injects,
				unbundleText: param.unbundleText,
				exportInfo: param.exportInfo,
				autoSendEventName: param.autoSendEventName,
				autoGivenArgsName: param.autoGivenArgsName,
				debugOverrideEngineFiles: param.debugOverrideEngineFiles
			};
			if (param.bundle) {
				return promiseConvertBundle(convertParam);
			} else {
				return promiseConvertNoBundle(convertParam);
			}
		})
		.then(() => {
			// ハッシュ化した場合一時ファイルが生成されるため削除する
			if (param.hashLength > 0) {
				param.logger.info("removing temp files...");
				fsx.removeSync(gamepath);
			}
		})
		.catch((error) => {
			throw error;
		})
		.then(() => {
			return param.output;
		});
}

export function promiseExportHTML(p: ExportHTMLParameterObject): Promise<string> {
	const param = _completeExportHTMLParameterObject(p);
	const output = param.output;
	if (param.compress) {
		// promiseExportHtmlRaw() で一時ディレクトリを作成させるため、param.output に null を代入
		param.output = null;
	}
	return promiseExportHtmlRaw(param)
		.then((dest: string) => {
			if (param.compress) {
				return new Promise<void>((resolve, reject) => {
					const files = readdirRecursive(dest).map(p => ({
						src: path.resolve(dest, p),
						entryName: p
					}));
					const ostream = fs.createWriteStream(output);
					const archive = archiver("zip");
					ostream.on("close", () => resolve());
					archive.on("error", (err) => reject(err));
					archive.pipe(ostream);
					files.forEach((f) => archive.file(f.src, { name: f.entryName }));
					return archive.finalize();
				}).finally(() => {
					fsx.removeSync(dest);
				});
			}
		})
		.then(() => {
			return param.compress ? output : param.output;
		});
}

export function exportHTML(param: ExportHTMLParameterObject, cb: (err?: any) => void): void {
	promiseExportHTML(param).then<void>(cb).catch(cb);
}

function createRenamedGame(sourcePath: string, hashLength: number, logger: cmn.Logger): Promise<string> {
	const destDirPath = path.resolve(fs.mkdtempSync(path.join(os.tmpdir(), "akashic-export-html-")));
	if (fs.existsSync(path.resolve(sourcePath, "sandbox.config.js"))) {
		fs.copyFileSync(path.resolve(sourcePath, "sandbox.config.js"), path.resolve(destDirPath, "sandbox.config.js"));
	}
	Utils.copyContentFiles(sourcePath, destDirPath);
	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read(path.join(destDirPath, "game.json"), logger))
		.then((gamejson: cmn.GameConfiguration) => {
			cmn.Renamer.renameAssetFilenames(gamejson, destDirPath, hashLength);
			return cmn.ConfigurationFile.write(gamejson, path.resolve(path.join(destDirPath, "game.json")), logger);
		}).then(() => destDirPath);
}
