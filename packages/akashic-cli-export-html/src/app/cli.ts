import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger, CliConfigExportHtml, CliConfigurationFile } from "@akashic/akashic-cli-commons";
import { promiseExportHTML } from "./exportHTML";
import { promiseExportAtsumaru } from "./exportAtsumaru";

const ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

function cli(param: CliConfigExportHtml): void {
	const logger = new ConsoleLogger({ quiet: param.quiet });
	const exportParam = {
		cwd: !param.cwd ? process.cwd() : path.resolve(param.cwd),
		source: param.source,
		force: param.force,
		quiet: param.quiet,
		output: param.output,
		exclude: param.exclude,
		logger: logger,
		strip: (param.strip != null) ? param.strip : true,
		hashLength: !param.hashFilename && !param.atsumaru ? 0 :
			(param.hashFilename === true || param.hashFilename === undefined) ? 20 : Number(param.hashFilename),
		minify: param.minify,
		bundle: param.bundle || param.atsumaru,
		magnify: param.magnify || param.atsumaru,
		injects: param.injects,
		unbundleText: !param.bundle || param.atsumaru,
		lint: !param.atsumaru,
		autoSendEvents: param.autoSendEvents,
		needsUntaintedImageAsset: param.atsumaru,
		preserveUnbundledScript: param.atsumaru && param.preserveUnbundledScript,
		// index.htmlに書き込むためのexport実行時の情報
		exportInfo: {
			version: ver, // export実行時のバージョン
			// export実行時のオプション情報。index.htmlに表示される値であるため、実行環境のディレクトリの情報は持たせていないことに注意。
			option: JSON.stringify({
				force: param.force,
				quiet: param.quiet,
				strip: param.strip,
				hashFilename: param.hashFilename,
				minify: param.minify,
				bundle: param.bundle,
				magnify: param.magnify,
				atsumaru: param.atsumaru
			})
		}
	};
	Promise.resolve()
		.then(() => {
			if (param.output === undefined) {
				throw new Error("--output option must be specified.");
			}
			if (param.atsumaru) {
				return promiseExportAtsumaru(exportParam);
			} else {
				return promiseExportHTML(exportParam);
			}
		})
		.then(() => logger.info("Done!"))
		.catch((err: any) => {
			logger.error(err);
			process.exit(1);
		});
}

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
	.option("-M, --minify", "minify JavaScript files")
	.option("-b, --bundle", "bundle assets and scripts in index.html (to reduce the number of files)")
	.option("-m, --magnify", "fit game area to outer element size")
	.option("-i, --inject [fileName]", "specify injected file content into index.html", inject, [])
	.option("-A, --autoSendEvents [eventName]", "event name that send automatically when game start")
	.option("-a, --atsumaru", "generate files that can be posted to RPG-atsumaru")
	.option("--preserveUnbundledScript", "Unnecessary script files are included even when the `--atsumaru` option is specified.");

export function run(argv: string[]): void {
	// Commander の制約により --strip と --no-strip 引数を両立できないため、暫定対応として Commander 前に argv を処理する
	const argvCopy = dropDeprecatedArgs(argv);
	commander.parse(argvCopy);

	CliConfigurationFile.read(path.join(commander["cwd"] || process.cwd(), "akashic.config.js"), (error, configuration) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		const conf = configuration.commandOptions.export ? (configuration.commandOptions.export.html || {}) : {};
		cli({
			cwd: commander["cwd"] ?? conf.cwd,
			force: commander["force"] ?? conf.force,
			quiet: commander["quiet"] ?? conf.quiet,
			output: commander["output"] ?? conf.output,
			source: commander["source"] ?? conf.source,
			strip: commander["strip"] ?? conf.strip,
			minify: commander["minify"] ?? conf.minify,
			bundle: commander["bundle"] ?? conf.bundle,
			magnify: commander["magnify"] ?? conf.magnify,
			hashFilename: commander["hashFilename"] ?? conf.hashFilename,
			injects: commander["inject"] ?? conf.injects,
			atsumaru: commander["atsumaru"] ?? conf.atsumaru,
			autoSendEvents: commander["autoSendEvents"] ?? conf.autoSendEvents,
			preserveUnbundledScript: commander["preserveUnbundledScript"] ?? conf.preserveUnbundledScript
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
