import * as fs from "fs";
import * as fsx from "fs-extra";
import * as path from "path";
import * as archiver from "archiver";
import {promiseExportZip} from "@akashic/akashic-cli-export-zip/lib/exportZip";
import {_completeExportHTMLParameterObject, ExportHTMLParameterObject, promiseExportHTML} from "./exportHTML";
import {getFromHttps} from "./apiUtil";

export function promiseExportAtsumaru(param: ExportHTMLParameterObject): Promise<string> {
	if (param.output === undefined) {
		throw new Error("--output option must be specified.");
	}
	const outZip = path.extname(param.output) === ".zip";
	const destDir = outZip ? undefined : param.output;
	const completedParam = _completeExportHTMLParameterObject({...param});
	return _checkDestinationValidity(param.output, param.force)
		.then(() => promiseExportHTML({...param, output: destDir, logger: completedParam.logger}))
		.then((dest) => {
			completedParam.output = dest;
			// filesディレクトリはakashic export zip時にも生成されるので削除しておく。削除しないとハッシュ名の衝突が起きてエラーになるため。
			fsx.removeSync(path.join(completedParam.output, "files"));
			// akashic export zip -o [outputDir] -b -H -f の実行
			// export-html と同じ箇所に export-zip を実行するため必ず force: true で実行する。force オプションがない場合のチェックは promiseExportHTML() で行われている。
			return promiseExportZip({
				source: completedParam.source,
				bundle: completedParam.bundle,
				dest: completedParam.output,
				hashLength: completedParam.hashLength,
				strip: true,
				force: true
			});
		}).then(() => {
			// game.jsonへの追記
			const gameJson = require(path.join(completedParam.output, "game.json"));
			if (!gameJson.environment) {
				gameJson.environment = {};
			}
			if (!gameJson.environment.niconico || !gameJson.environment.niconico.supportedModes) {
				// モード指定がなければ、常に指定可能なモードであるsingleモードを追加する。
				completedParam.logger.warn(
					"'environment.niconico.supportedModes', a required property for '--atsumaru' mode," +
					"is not given in game.json. Assumed to be [\"single\"]."
				);
				gameJson.environment.niconico = {
					"supportedModes": ["single"]
				};
			}
			if (!gameJson.environment.external) {
				gameJson.environment.external = {};
			}
			gameJson.environment.external.send = "0";
			if (gameJson.environment["akashic-runtime"]) {
				return gameJson;
			}
			gameJson.environment["akashic-runtime"] = {};
			return getFromHttps(
				"https://raw.githubusercontent.com/akashic-games/akashic-runtime-version-table/master/versions.json").then((data) => {
				const versionInfo = JSON.parse(data);
				if (!gameJson.environment["sandbox-runtime"] || gameJson.environment["sandbox-runtime"] === "1") {
					gameJson.environment["akashic-runtime"]["version"] = "~" + versionInfo["latest"]["1"];
				} else {
					gameJson.environment["akashic-runtime"]["version"] = "~" + versionInfo["latest"]["2"];
					if (!gameJson.renderers || gameJson.renderers.indexOf("webgl") === -1) {
						gameJson.environment["akashic-runtime"]["flavor"] = "-canvas";
					}
				}
				return gameJson;
			});
		}).then((gameJson) => {
			fs.writeFileSync(path.join(completedParam.output, "game.json"), JSON.stringify(gameJson, null, 2));
		})
		.then(() => {
			if (!outZip) {
				return;
			}
			return new Promise<void>((resolve, reject) => {
				const ostream = fs.createWriteStream(path.resolve(param.cwd, param.output));
				const archive = archiver("zip");
				ostream.on("close", () => resolve());
				archive.on("error", (err) => reject(err));
				archive.pipe(ostream);
				archive.directory(completedParam.output, path.basename(param.output).replace(/.zip$/g, ""));
				archive.finalize();
			}).then(() => {
				fsx.removeSync(completedParam.output);
			});
		}).then(() => {
			return path.resolve(param.cwd, param.output);
		});
}

export function _checkDestinationValidity(dest: string, force: boolean): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.stat(path.resolve(dest), (error: any, stat: any) => {
			if (error) {
				if (error.code === "ENOENT") {
					resolve();
				} else {
					return reject("Output directory has bad status. Error code " + error.code);
				}
				return;
			}
			if (!force)
				return reject("The output directory " + dest + " already exists. Cannot overwrite without force option.");
			else
				resolve();
		});
	});
}
