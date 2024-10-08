import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { fileURLToPath } from "url";
import * as cmn from "@akashic/akashic-cli-commons";
import { size as statSize } from "@akashic/akashic-cli-extra/lib/stat/stat.js";
import archiver = require("archiver");
import { convertGame } from "./convert.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ExportZipParameterObject {
	bundle?: boolean;
	babel?: boolean;
	minify?: boolean;
	minifyJs?: boolean;
	minifyJson?: boolean;
	packImage?: boolean;
	strip?: boolean;
	source?: string;
	dest?: string;
	force?: boolean;
	logger?: cmn.Logger;
	hashLength?: number;
	exportInfo?: cmn.ExportZipInfo;
	omitUnbundledJs?: boolean;
	targetService?: cmn.ServiceType;
	nicolive?: boolean;
	resolveAkashicRuntime?: boolean;
	preservePackageJson?: boolean;
}

function _createExportInfo(param: ExportZipParameterObject): cmn.ExportZipInfo {
	return {
		version: JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8")).version,
		option: {
			force: !!param.force,
			strip: !!param.strip,
			minify: !!param.minify,
			minifyJs: !!param.minifyJs,
			minifyJson: !!param.minifyJson,
			packImage: !!param.packImage,
			bundle: !!param.bundle,
			babel: !!param.babel,
			targetService: param.targetService || "none"
		}
	};
}

export function _completeExportZipParameterObject(param: ExportZipParameterObject): ExportZipParameterObject {
	return {
		bundle: !!param.bundle,
		babel: !!param.babel,
		minify: !!param.minify,
		minifyJs: !!param.minifyJs,
		minifyJson: !!param.minifyJson,
		packImage: !!param.packImage,
		strip: !!param.strip,
		source: param.source || process.cwd(),
		dest: param.dest || "./game.zip",
		force: !!param.force,
		logger: param.logger || new cmn.ConsoleLogger(),
		hashLength: param.hashLength,
		exportInfo: param.exportInfo || _createExportInfo(param),
		omitUnbundledJs: param.omitUnbundledJs,
		targetService: param.targetService || "none",
		nicolive: !!param.nicolive,
		resolveAkashicRuntime: !!param.resolveAkashicRuntime,
		preservePackageJson: !!param.preservePackageJson
	};
}

// TODO akashic-cli-commons に移して export html と実装を共有する
export function _checkDestinationValidity(dest: string, force: boolean): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.stat(path.resolve(dest), (error: any, _stat: any) => {
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
				minifyJs: param.minifyJs,
				minifyJson: param.minifyJson,
				packImage: param.packImage,
				strip: param.strip,
				source: param.source,
				dest: destDir,
				hashLength: param.hashLength,
				logger: param.logger,
				exportInfo: param.exportInfo,
				omitUnbundledJs: param.omitUnbundledJs,
				targetService: param.targetService,
				nicolive: param.nicolive,
				resolveAkashicRuntime: param.resolveAkashicRuntime,
				preservePackageJson: param.preservePackageJson
			});
		})
		.then(() => {
			if (!outZip)
				return;
			return new Promise<void>((resolve, reject) => {
				const files = cmn.Util.readdirRecursive(destDir).map(p => ({
					src: path.resolve(destDir, p),
					entryName: p
				}));
				const ostream = fs.createWriteStream(param.dest);
				const archive = archiver("zip");
				ostream.on("close", () => resolve());
				archive.on("error", (err) => reject(err));
				archive.pipe(ostream);
				files.forEach((f) => archive.file(f.src, {name: f.entryName}));
				return archive.finalize();
			});
			// TODO mkdtempのフォルダを削除すべき？
		})
		.then(() => {
			const gameJson = JSON.parse(fs.readFileSync(path.resolve(destDir, "game.json"), "utf8"));
			const params = {
				logger: param.logger,
				basepath: destDir,
				game: gameJson,
				raw: false
			};
			return statSize(params);
		});
}

export function exportZip(param: ExportZipParameterObject, callback: (err?: Error) => void): void {
	promiseExportZip(param).then(() => callback(), callback);
}
