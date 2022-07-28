import * as fs from "fs";
import * as path from "path";
import { ConsoleLogger, CliConfigExportHtml, CliConfigExportHtmlDumpableOptions, CliConfigExportZipDumpableOption, Logger } from "@akashic/akashic-cli-commons";
import type { CliConfiguration } from "@akashic/akashic-cli-commons/lib/CliConfig/CliConfiguration";
import { readJSONWithDefault } from "@akashic/akashic-cli-commons/lib/FileSystem";
import { Command } from "commander";
import { exportHTML, ExportHTMLParameterObject } from "./exportHTML";

const ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8")).version;

function makeConvertOptionInfo(param: CliConfigExportHtml): CliConfigExportZipDumpableOption {
	return {
		// ...param,
		// ↑は禁止。ダンプ情報にローカルのファイルパスが入り込まないよう、paramとは別のオブジェクトに必要な値だけ持たせる
    force: param.force,
    quiet: param.quiet,
    strip: param.strip,
    hashFilename: param.hashFilename,
    minify: param.minify,
    minifyJs: param.minifyJs,
    minifyJson: param.minifyJson,
    packImage: param.packImage,
    bundle: param.bundle,
    omitUnbundledJs: param.omitUnbundledJs
	};
}

function makeGenerateOptionInfo(param: CliConfigExportHtml): CliConfigExportHtmlDumpableOptions {
 	return {
		// ...param,
		// ↑は禁止。ダンプ情報にローカルのファイルパスが入り込まないよう、paramとは別のオブジェクトに必要な値だけ持たせる
    force: param.force,
    quiet: param.quiet,
    strip: param.strip,
    hashFilename: param.hashFilename,
    minify: param.minify,
    minifyJs: param.minifyJs,
    minifyJson: param.minifyJson,
    packImage: param.packImage,
    bundle: param.bundle,
    magnify: param.magnify,
    atsumaru: param.atsumaru,
    omitUnbundledJs: param.atsumaru
	};
}

export function makeExportHTMLParameter(param: CliConfigExportHtml, logger: Logger): ExportHTMLParameterObject {
	if (param.output == null)
		throw new Error("--output option must be specified.");

	const cwd = !param.cwd ? process.cwd() : path.resolve(param.cwd);
	const injects = (param.injects ?? []).map(p => path.resolve(cwd, p));
	const compress = path.extname(param.output) === ".zip";
	const hashLength =
		(typeof param.hashFilename === "number") ? param.hashFilename :
		(param.hashFilename === true) ? 20 :
		(param.hashFilename === false) ? 0 :
		null;

	// bundle を embed に読み替える。
	// bundle は「スクリプトを index.js にまとめる」 convert() のオプション。
	// embed は「テキスト系アセットを index.html に埋め込む」 generate() のオプション。
	// 実質的には後者は前者を包含している (bundle してもしなくてもどうせ embed すればすべて index.html に入る)。
	// 歴史的経緯のため、export html の --bundle オプションは embed として動作する。
	const embed = param.bundle;

	if (param.atsumaru) {
		// --atsumaru の時のパラメータ。
		return {
			cwd,
			source: param.source,
			output: param.output,
			force: param.force,
			logger,
			compress,
			convertOption: {
				strip: true,
				minifyJs: true,
				minifyJson: true,
				babel: true,
				bundle: true,
				omitUnbundledJs: param.omitUnbundledJs ?? true,
				packImage: param.packImage ?? true,
				hashLength: hashLength ?? 20,
				optionInfo: makeConvertOptionInfo(param),
				completeEnvironment: true,
				needUntaintedImage: true,
				targetService: "nicolive"
			},
			generateOption: {
				magnify: param.magnify ?? true,
				injects,
				optionInfo: makeGenerateOptionInfo(param),
				autoSendEventName: param.autoSendEventName ?? false,
				engineFiles: param.debugOverrideEngineFiles ?? null,
				embed: embed ?? true,
				// ニコ生ゲーム用に embed したものとは別にファイルはそのまま残す
				destructive: false,
				// ニコ生ゲーム用にテキストファイルは残る。JSと比してサイズが非常に大きい可能性があるのでHTMLからもそれを使う
				useRawText: true,
			}
		};

	} else {
		// --atsumaru でない時のパラメータ。
		return {
			cwd,
			source: param.source,
			output: param.output,
			force: param.force,
			compress,
			logger,
			convertOption: {
				babel: true,
				strip: param.strip ?? true,
				minifyJs: !!param.minifyJs,
				minifyJson: !!param.minifyJson,
				packImage: !!param.packImage,
				hashLength: hashLength ?? 0,
				optionInfo: makeConvertOptionInfo(param),
				bundle: false,
				omitUnbundledJs: true,
				completeEnvironment: false,
				needUntaintedImage: false,
				targetService: "none"
			},
			generateOption: {
				magnify: !!param.magnify,
				injects,
				optionInfo: makeGenerateOptionInfo(param),
				autoSendEventName: param.autoSendEventName ?? false,
				engineFiles: param.debugOverrideEngineFiles ?? null,
				embed: !!embed,
				destructive: true,
				useRawText: false,
			}
		};
	}
}

export async function cli(param: CliConfigExportHtml): Promise<void> {
	const logger = new ConsoleLogger({ quiet: param.quiet });
	await exportHTML(makeExportHTMLParameter(param, logger));
	logger.info("Done!");
}

const commander = new Command();
commander
	.version(ver);

commander
	.description("convert your Akashic game runnable standalone.")
	.option("-C, --cwd <dir>", "The directory to export from")
	.option("-s, --source <dir>", "Source directory to export from cwd/current directory")
	.option("-f, --force", "Overwrites existing files")
	.option("-q, --quiet", "Suppress output")
	.option("-o, --output <fileName>", "Name of output file or directory")
	.option("-S, --no-strip", "output fileset without strip")
	.option("-H, --hash-filename [length]", "Rename asset files with their hash values")
	.option("-M, --minify", "minify JavaScript files (DEPRECATED: use --minify-js")
	.option("-b, --bundle", "bundle assets and scripts in index.html (to reduce the number of files)")
	.option("-m, --magnify", "fit game area to outer element size")
	.option("-i, --inject [fileName]", "specify injected file content into index.html", ((val, acc) => acc.concat(val)), [] as string[])
	.option("--autoSendEvents [eventName]", "(deprecated)event name that send automatically when game start")
	.option("-A, --auto-send-event-name [eventName]", "event name that send automatically when game start")
	.option("-a, --atsumaru", "generate files that can be posted to GAME-atsumaru")
	.option("--minify-js", "minify JavaScript files")
	.option("--minify-json", "minify JSON files")
	.option("--pack-image", "pack small images")
	.option("--no-omit-unbundled-js", "Unnecessary script files are included even when the `--atsumaru` option is specified.")
	.option("--debug-override-engine-files <filePath>", "Use the specified engineFiles");

export async function run(argv: string[]): Promise<void> {
	commander.parse(dropDeprecatedArgs(argv));
	const options = commander.opts();

	if (options.debugOverrideEngineFiles) {
		if (!/^engineFilesV\d+_\d+_\d+.*\.js$/.test(path.basename(options.debugOverrideEngineFiles))) {
			console.error(
				`Invalid ---debug-override-engine-files option:${options.debugOverrideEngineFiles}. ` +
				"The file name must be engineFilesV{x}_{y}_{z}.js."
			);
			process.exit(1);
		}
	}

	const configurationPath = path.join(options.cwd || process.cwd(), "akashic.config.js");
	const configuration = await readJSONWithDefault<CliConfiguration>(configurationPath, {});

	const conf = configuration.commandOptions?.export?.html ?? {};
	cli({
		cwd: options.cwd ?? conf.cwd,
		force: options.force ?? conf.force,
		quiet: options.quiet ?? conf.quiet,
		output: options.output ?? conf.output,
		source: options.source ?? conf.source,
		strip: options.strip ?? conf.strip,
		minify: options.minify ?? conf.minify,
		minifyJs: options.minifyJs ?? conf.minifyJs,
		minifyJson: options.minifyJson ?? conf.minifyJson,
		packImage: options.packImage ?? conf.packImage,
		bundle: options.bundle ?? conf.bundle,
		magnify: options.magnify ?? conf.magnify,
		hashFilename: options.hashFilename ?? conf.hashFilename,
		injects: options.inject ?? conf.injects,
		atsumaru: options.atsumaru ?? conf.atsumaru,
		autoSendEventName: options.autoSendEventName ?? options.autoSendEvents ?? conf.autoSendEventName ?? conf.autoSendEvents,
		omitUnbundledJs: options.omitUnbundledJs ?? conf.omitUnbundledJs,
		debugOverrideEngineFiles: options.debugOverrideEngineFiles ?? conf.debugOverrideEngineFiles
	});
}

function dropDeprecatedArgs(argv: string[]): string[] {
	// Commander の制約により --strip と --no-strip 引数を両立できないため、ここで削る。
	const ret = argv.filter(v => !/^(--strip)$/.test(v));
	if (argv.length !== ret.length) {
		console.log("WARN: --strip option is deprecated. strip is applied by default.");
	}
	return ret;
}
