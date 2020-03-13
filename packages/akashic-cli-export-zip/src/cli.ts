import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger, CliConfigurationFile, CliConfigExportZip  } from "@akashic/akashic-cli-commons";
import { promiseExportZip } from "./exportZip";

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

export function cli(param: CliConfigExportZip): void {
	var logger = new ConsoleLogger({ quiet: param.quiet });
	Promise.resolve()
		.then(() => promiseExportZip({
			bundle: param.bundle,
			babel: (param.babel != null) ? param.babel : true,
			minify: param.minify,
			strip: (param.strip != null) ? param.strip : true,
			source: param.cwd,
			dest: param.output,
			force: param.force,
			hashLength: !param.hashFilename ? 0 : (param.hashFilename === true) ? 20 : Number(param.hashFilename),
			omitEmptyJs: param.omitEmptyJs,
			logger,
			exportInfo: {
				version: ver,
				option: {
					quiet: param.quiet,
					force: param.force,
					strip: param.strip,
					minify: param.minify,
					bundle: param.bundle,
					babel: param.babel,
					hashFilename: param.hashFilename,
					omitEmptyJs: param.omitEmptyJs
				}
			}
		}))
		.then(() => logger.info("Done!"))
		.catch((err: any) => {
			logger.error(err);
			process.exit(1);
		});
}

commander
	.version(ver);

commander
	.description("Export an Akashic game to a zip file")
	.option("-C, --cwd <dir>", "A directory containing a game.json (default: .)")
	.option("-q, --quiet", "Suppress output")
	.option("-o, --output <fileName>", "Name of output file (default: game.zip)")
	.option("-f, --force", "Overwrites existing files")
	.option("-S, --no-strip", "output fileset without strip")
	.option("-M, --minify", "Minify JavaScript files")
	.option("-H, --hash-filename [length]", "Rename asset files with their hash values")
	.option("-b, --bundle", "Bundle script assets into a single file")
	.option("--no-es5-downpile", "No convert JavaScript into es5")
	.option("--no-omit-empty-js", "Disable omitting empty js from global assets");

export function run(argv: string[]): void {
	// Commander の制約により --strip と --no-strip 引数を両立できないため、暫定対応として Commander 前に argv を処理する
	const argvCopy = dropDeprecatedArgs(argv);
	commander.parse(argvCopy);

	CliConfigurationFile.read(path.join(commander["cwd"] || process.cwd(), "akashic.config.js"), (error, configuration) => {
		if (error) throw error;

		const conf = configuration.commandOptions.export ? (configuration.commandOptions.export.zip || {}) : {};
		cli({
			cwd: commander["cwd"] ?? conf.cwd,
			quiet: commander["quiet"] ?? conf.quiet,
			output: commander["output"] ?? conf.output,
			force: commander["force"] ?? conf.force,
			strip: commander["strip"] ?? conf.strip,
			minify: commander["minify"] ?? conf.minify,
			hashFilename: commander["hashFilename"] ?? conf.hashFilename,
			bundle: commander["bundle"] ?? conf.bundle,
			babel: commander["es5Downpile"] ?? conf.babel,
			omitEmptyJs: commander["omitEmptyJs"] ?? conf.omitEmptyJs
		});
	});
}

function dropDeprecatedArgs(argv: string[]): string[] {
	const filteredArgv = argv.filter(v => !/^(-s|--strip)$/.test(v));
	if (argv.length !== filteredArgv.length) {
		console.log("WARN: --strip option is deprecated. strip is applied by default.");
		console.log("WARN: If you do not need to apply it, use --no-strip option.");
	}
	return filteredArgv;
}
