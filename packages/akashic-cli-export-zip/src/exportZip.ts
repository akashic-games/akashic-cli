import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as cmn from "@akashic/akashic-cli-commons";
import archiver = require("archiver");
import readdir = require("fs-readdir-recursive");
import { convertGame } from "./convert";

export interface ExportZipParameterObject {
	bundle?: boolean;
	babel?: boolean;
	minify?: boolean;
	strip?: boolean;
	source?: string;
	dest?: string;
	force?: boolean;
	logger?: cmn.Logger;
	hashLength?: number;
	omitEmptyJs?: boolean;
}

export function _completeExportZipParameterObject(param: ExportZipParameterObject): ExportZipParameterObject {
	return {
		bundle: !!param.bundle,
		babel: !!param.babel,
		minify: !!param.minify,
		strip: !!param.strip,
		source: param.source || process.cwd(),
		dest: param.dest || "./game.zip",
		force: !!param.force,
		logger: param.logger || new cmn.ConsoleLogger(),
		hashLength: param.hashLength,
		omitEmptyJs: param.omitEmptyJs
	};
}

// TODO akashic-cli-commons に移して export html と実装を共有する
export function _checkDestinationValidity(dest: string, force: boolean): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.stat(path.resolve(dest), (error: any, stat: any) => {
			if (error) {
				if (error.code === "ENOENT") {
					resolve();
				} else {
					reject(new Error("Error code " + error.code + " for " + dest));
				}
				return;
			}
			if (!force)
				reject(new Error(dest + " already exists. Use --force option to overwrite."));
			else
				resolve();
		});
	});
}

export function promiseExportZip(param: ExportZipParameterObject): Promise<void> {
	param = _completeExportZipParameterObject(param);
	const outZip = /\.zip$/.test(param.dest);
	const destDir = outZip ? fs.mkdtempSync(path.join(os.tmpdir(), "akashic-export-zip-")) : param.dest;

	return _checkDestinationValidity(param.dest, param.force)
		.then(() => {
			return convertGame({
				bundle: param.bundle,
				babel: param.babel,
				minify: param.minify,
				strip: param.strip,
				source: param.source,
				dest: destDir,
				hashLength: param.hashLength,
				omitEmptyJs: param.omitEmptyJs,
				logger: param.logger
			});
		})
		.then(() => {
			if (!outZip)
				return;
			return new Promise<void>((resolve, reject) => {
				const files = readdir(destDir).map(p => ({
					src: path.resolve(destDir, p),
					entryName: p
				}));
				const ostream = fs.createWriteStream(param.dest);
				const archive = archiver("zip");
				ostream.on("close", () => resolve());
				archive.on("error", (err) => reject(err));
				archive.pipe(ostream);
				files.forEach((f) => archive.file(f.src, {name: f.entryName}));
				archive.finalize();
			});
			// TODO mkdtempのフォルダを削除すべき？
		});
}

export function exportZip(param: ExportZipParameterObject, callback: (err?: Error) => void): void {
	promiseExportZip(param).then(() => callback(), callback);
}
