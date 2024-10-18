import { createRequire } from "module";
import * as path from "path";
import type { CliConfigExportHtml} from "@akashic/akashic-cli-commons";
import { ConsoleLogger, CliConfigurationFile } from "@akashic/akashic-cli-commons";
import { Command } from "commander";
import type { ExportHTMLParameterObject } from "./exportHTML.js";
import { promiseExportHTML } from "./exportHTML.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json");

function cli(param: CliConfigExportHtml): void {
	const logger = new ConsoleLogger({ quiet: param.quiet });
	const exportParam: ExportHTMLParameterObject = {
		cwd: !param.cwd ? process.cwd() : path.resolve(param.cwd),
		source: param.source,
		force: param.force,
		quiet: param.quiet,
		output: param.output,
		logger: logger,
		strip: (param.strip != null) ? param.strip : true,
		hashLength: !param.hashFilename ? 0 :
			(param.hashFilename === true || param.hashFilename === undefined) ? 20 : Number(param.hashFilename),
		minify: param.minify,
		terser: param.terser,
		bundle: param.bundle,
		magnify: param.magnify,
		injects: param.injects,
		unbundleText: !param.bundle,
		autoSendEventName: param.autoSendEventName || param.autoSendEvents,
		autoGivenArgsName: param.autoGivenArgsName,
		omitUnbundledJs: param.omitUnbundledJs,
		compress: param.output ? path.extname(param.output) === ".zip" : false,
		debugOverrideEngineFiles: param.debugOverrideEngineFiles,
		// index.htmlに書き込むためのexport実行時の情報
		exportInfo: {
			version, // export実行時のバージョン
			// export実行時のオプション情報。index.htmlに表示される値であるため、実行環境のディレクトリの情報は持たせていないことに注意。
			option: JSON.stringify({
				force: param.force,
				quiet: param.quiet,
				strip: param.strip,
				hashFilename: param.hashFilename,
				minify: param.minify,
				terser: param.terser,
				bundle: param.bundle,
				magnify: param.magnify
			})
		}
	};
	Promise.resolve()
		.then(() => {
			if (param.output === undefined) {
				throw new Error("--output option must be specified.");
			}
			return promiseExportHTML(exportParam);
		})
		.then(() => logger.info("Done!"))
		.catch((err: any) => {
			logger.error(err);
			process.exit(1);
		});
}

const commander = new Command();
commander
	.version(version);

commander
	.description("convert your Akashic game runnable standalone.")
	.option("-C, --cwd <dir>", "The directory to export from")
	.option("-s, --source <dir>", "Source directory to export from cwd/current directory")
	.option("-f, --force", "Overwrites existing files")
	.option("-q, --quiet", "Suppress output")
	.option("-o, --output <fileName>", "Name of output file or directory")
	.option("-S, --no-strip", "output fileset without strip")
	.option("-H, --hash-filename [length]", "Rename asset files with their hash values")
	.option("-M, --minify", "minify JavaScript files")
	.option("-b, --bundle", "bundle assets and scripts in index.html (to reduce the number of files)")
	.option("-m, --magnify", "fit game area to outer element size")
	.option("-i, --inject [fileName]", "specify injected file content into index.html", inject, [])
	.option("--autoSendEvents [eventName]", "(deprecated)event name that send automatically when game start")
	.option("-A, --auto-send-event-name [eventName]", "event name that send automatically when game start")
	.option("--auto-given-args-name [argsName]", "argument name that given automatically when game start")
	.option("-a, --atsumaru", "obsolete  option. Use 'akashic export zip --nicolive' instead")
	.option("--no-omit-unbundled-js", "Unnecessary script files are included even when the `--atsumaru` option is specified.")
	.option("--debug-override-engine-files <filePath>", "Use the specified engineFiles");

export function run(argv: string[]): void {
	// Commander の制約により --strip と --no-strip 引数を両立できないため、暫定対応として Commander 前に argv を処理する
	const argvCopy = dropDeprecatedArgs(argv);
	commander.parse(argvCopy);
	const options = commander.opts();

	CliConfigurationFile.read(path.join(options.cwd || process.cwd(), "akashic.config.js"), (error, configuration) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}
		if (options.debugOverrideEngineFiles) {
			if (!/^engineFilesV\d+_\d+_\d+.*\.js$/.test(path.basename(options.debugOverrideEngineFiles))) {
				console.error(`Invalid ---debug-override-engine-files option argument:${options.debugOverrideEngineFiles},`
					+ "File name should be in engineFilesVx_x_x format");
				process.exit(1);
			}
		}
		if (options.atsumaru) {
			console.error("--atsumaru is an obsolete option. Use \"akashic export zip --nicolive\" instead.");
			process.exit(1);
		}

		const conf = configuration!.commandOptions?.export?.html ?? {};
		cli({
			cwd: options.cwd ?? conf.cwd,
			force: options.force ?? conf.force,
			quiet: options.quiet ?? conf.quiet,
			output: options.output ?? conf.output,
			source: options.source ?? conf.source,
			strip: options.strip ?? conf.strip,
			minify: options.minify ?? conf.minify,
			terser: options.terser ?? conf.terser,
			bundle: options.bundle ?? conf.bundle,
			magnify: options.magnify ?? conf.magnify,
			hashFilename: options.hashFilename ?? conf.hashFilename,
			injects: options.inject ?? conf.injects,
			autoSendEventName: options.autoSendEventName ?? options.autoSendEvents ?? conf.autoSendEventName ?? conf.autoSendEvents,
			autoGivenArgsName: options.autoGivenArgsName ?? conf.autoGivenArgsName,
			omitUnbundledJs: options.omitUnbundledJs ?? conf.omitUnbundledJs,
			debugOverrideEngineFiles: options.debugOverrideEngineFiles ?? conf.debugOverrideEngineFiles
		});
	});
}

function dropDeprecatedArgs(argv: string[]): string[] {
	const filteredArgv = argv.filter(v => !/^(--strip)$/.test(v));
	if (argv.length !== filteredArgv.length) {
		console.log("WARN: --strip option is deprecated. strip is applied by default.");
		console.log("WARN: If you do not need to apply it, use --no-strip option.");
	}
	return filteredArgv;
}

function inject(val: string, injects: string[]): string[] {
	injects.push(val);
	return injects;
}
