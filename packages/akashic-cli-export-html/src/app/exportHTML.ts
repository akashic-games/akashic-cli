import * as cmn from "@akashic/akashic-cli-commons";
import { ConvertTemplateParameterObject } from "./convertUtil";
import { promiseConvertNoBundle } from "./convertNoBundle";
import { promiseConvertBundle } from "./convertBundle";

import * as fs from "fs";
import * as fsx from "fs-extra";
import * as path from "path";
import * as os from "os";

export interface ExportHTMLParameterObject extends ConvertTemplateParameterObject {
	quiet?: boolean;
	bundle?: boolean;
	hashLength?: number;
}

export function _completeExportHTMLParameterObject(p: ExportHTMLParameterObject): ExportHTMLParameterObject {
	const param = {...p};
	const source = param.source ? param.source : "./";
	param.source = path.resolve(param.cwd, source);
	param.output = param.output ? path.resolve(param.cwd, param.output) : undefined;
	param.logger = param.logger || new cmn.ConsoleLogger();
	return param;
}
export function promiseExportHTML(p: ExportHTMLParameterObject): Promise<string> {
	const param = _completeExportHTMLParameterObject(p);
	let gamepath: string;

	param.logger.info("exporting content into html...");
	if (!param.strip && param.output != null && !/^\.\./.test(path.relative(param.source, param.output))) {
		param.logger.warn("The output path overlaps with the game directory: files will be exported into the game directory.");
		param.logger.warn("NOTE that after this, exporting this game with --no-strip option may include the files.");
	}
	return new Promise((resolve, reject) => {
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
		const convertParam = {
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
			lint: param.lint
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

export function exportHTML(param: ExportHTMLParameterObject, cb: (err?: any) => void): void {
	promiseExportHTML(param).then<void>(cb).catch(cb);
}

function createRenamedGame(sourcePath: string, hashLength: number, logger: cmn.Logger): Promise<string> {
	const destDirPath = path.resolve(fs.mkdtempSync(path.join(os.tmpdir(), "akashic-export-html-")));
	fsx.copySync(sourcePath, destDirPath);

	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read(path.join(destDirPath, "game.json"), logger))
		.then((gamejson: cmn.GameConfiguration) => {
			cmn.Renamer.renameAssetFilenames(gamejson, destDirPath, hashLength);
			return cmn.ConfigurationFile.write(gamejson, path.resolve(path.join(destDirPath, "game.json")), logger);
		}).then(() => destDirPath);
}
