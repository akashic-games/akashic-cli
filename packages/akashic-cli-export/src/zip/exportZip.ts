import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import { exists } from "@akashic/akashic-cli-commons/lib/FileSystem";
import { compress } from "./compress";
import { convertGame } from "./convert";

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
		targetService: param.targetService || "none"
	};
}

export async function promiseExportZip(param: ExportZipParameterObject): Promise<void> {
	param = _completeExportZipParameterObject(param);
	const outZip = /\.zip$/.test(param.dest);
	const destDir = outZip ? fs.mkdtempSync(path.join(os.tmpdir(), "akashic-export-zip-")) : param.dest;

	if ((await exists(param.dest)) && !param.force)
		throw new Error(param.dest + " already exists. Use --force option to overwrite.");

	await convertGame({
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
		targetService: param.targetService
	});

	if (outZip) {
		await compress(destDir, param.dest);
		// TODO mkdtempのフォルダを削除すべき？
	}
}

export function exportZip(param: ExportZipParameterObject, callback: (err?: Error) => void): void {
	promiseExportZip(param).then(() => callback(), callback);
}
