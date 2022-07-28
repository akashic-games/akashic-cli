import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as assert from "assert";
import * as fsx from "fs-extra";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import type { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType";
import type { CliConfigExportHtmlDumpableOptions } from "@akashic/akashic-cli-commons/lib/CliConfig/CliConfigExportHtml";
import { convertGame } from "../zip/convert";
import { compress as compressToZip } from "../zip/compress";
import { generateHTML } from "./generate";
import { exists } from "@akashic/akashic-cli-commons/lib/FileSystem";
import { CliConfigExportZipDumpableOption } from "@akashic/akashic-cli-commons";

export interface ExportHTMLConvertOption {
	strip: boolean;
	minifyJs: boolean;
	minifyJson: boolean;
	babel: boolean;
	bundle: boolean;
	omitUnbundledJs: boolean;
	completeEnvironment: boolean;
	packImage: boolean;
	needUntaintedImage: boolean;
	hashLength: number;
	targetService: ServiceType;
	optionInfo: CliConfigExportZipDumpableOption | null;
}

export interface ExportHTMLGenerateOption {
	magnify: boolean;
	injects: string[];
	autoSendEventName: string | boolean;
	engineFiles: string | null;
	embed: boolean;
	destructive: boolean;
	useRawText: boolean;
	optionInfo: CliConfigExportHtmlDumpableOptions | null;
}

export interface ExportHTMLParameterObject {
	cwd?: string | null;
	source?: string | null;
	output: string;
	compress?: boolean | null;
	force?: boolean;
	logger: Logger;
	convertOption: ExportHTMLConvertOption;
	generateOption: ExportHTMLGenerateOption;
}

export async function exportHTML(param: ExportHTMLParameterObject): Promise<void> {
	const {
		cwd: givenCwd,
		source: givenSource,
		output: givenOutput,
		compress,
		logger,
		force,
		convertOption,
		generateOption
	} = param;

	const cwd = givenCwd ? path.resolve(givenCwd) : process.cwd();
	const source = path.resolve(cwd, givenSource ?? ".");
	const output = path.resolve(cwd, givenOutput);

	if (path.relative(source, output) === "")
		throw new Error("the output directory is identical to source game directory.");
	if (!force && await exists(output))
		throw new Error(output + " already exists. Use --force option to overwrite.");

	logger.info("exporting content into html...");
	if (!convertOption.strip && !/^\.\./.test(path.relative(source, output))) {
		logger.warn("The output path overlaps with the game directory: files will be exported into the game directory.");
		logger.warn("NOTE that after this, exporting this game with --no-strip option may include the files.");
	}

	const exportDest = compress ? fs.mkdtempSync(path.join(os.tmpdir(), "akashic-export-html-")) : output;

	await convertGame({
		source: source,
		dest: exportDest,
		logger,
		...convertOption,
	});

	await generateHTML({
		gameDir: exportDest,
		...generateOption
	});

	if (compress) {
		assert(exportDest !== output);
		await compressToZip(exportDest, output);
		fsx.removeSync(exportDest);
	}
}
