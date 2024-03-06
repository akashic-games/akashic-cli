import * as fs from "fs";
import * as path from "path";
import { ConsoleLogger, CliConfigurationFile, CliConfigExportZip, SERVICE_TYPES } from "@akashic/akashic-cli-commons";
import { Command } from "commander";
import { promiseExportZip } from "./exportZip";

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8")).version;

export function cli(param: CliConfigExportZip): void {
	var logger = new ConsoleLogger({ quiet: param.quiet });

	if (!param.omitEmptyJs) {
		logger.info("deprecated: --no-omit-empty-js is now always enabled since output may be broken without this option.");
	}
	if (param.nicolive && !param.hashFilename) {
		param.hashFilename = true;
	}

	Promise.resolve()
		.then(() => promiseExportZip({
			bundle: param.bundle || param.nicolive,
			babel: (param.babel != null) ? param.babel : true,
			minify: param.minify,
			minifyJs: param.minifyJs,
			minifyJson: param.minifyJson,
			packImage: param.packImage,
			strip: (param.strip != null) ? param.strip : true,
			source: param.cwd,
			dest: param.output,
			force: param.force,
			hashLength: !param.hashFilename ? 0 :
				(param.hashFilename === true) ? 20 : Number(param.hashFilename),
			logger,
			omitUnbundledJs: (param.bundle || param.nicolive) && param.omitUnbundledJs,
			targetService: param.nicolive ? "nicolive" : param.targetService,
			nicolive: param.nicolive,
			resolveAkashicRuntime: param.resolveAkashicRuntime || param.nicolive,
			preservePackageJson: param.preservePackageJson,
			exportInfo: {
				version: ver,
				option: {
					quiet: param.quiet,
					force: param.force,
					strip: param.strip,
					minify: param.minify,
					minifyJs: param.minifyJs,
					minifyJson: param.minifyJson,
					bundle: param.bundle,
					babel: param.babel,
					hashFilename: param.hashFilename,
					targetService: param.nicolive ? "nicolive" : param.targetService || "none",
					nicolive: param.nicolive,
					preservePackageJson: param.preservePackageJson
				}
			}
		}))
		.then(() => logger.info("Done!"))
		.catch((err: any) => {
			logger.error(err);
			process.exit(1);
		});
}

const commander = new Command();
commander
	.version(ver);

commander
	.description("Export an Akashic game to a zip file")
	.option("-C, --cwd <dir>", "A directory containing a game.json (default: .)")
	.option("-q, --quiet", "Suppress output")
	.option("-o, --output <fileName>", "Name of output file (default: game.zip)")
	.option("-f, --force", "Overwrites existing files")
	.option("-S, --no-strip", "output fileset without strip")
	.option("-M, --minify", "(DEPRECATED: use --minify-js) Minify JavaScript files")
	.option("-H, --hash-filename [length]", "Rename asset files with their hash values")
	.option("-b, --bundle", "Bundle script assets into a single file")
	.option("--no-es5-downpile", "No convert JavaScript into es5")
	.option("--no-omit-empty-js", "(DEPRECATED) Changes nothing. Provided for backward compatibility")
	.option("--no-omit-unbundled-js", "Preserve unbundled .js files (not required from root). Works with --bundle only")
	.option("--minify-js", "Minify JavaScript files")
	.option("--minify-json", "Minify JSON files")
	.option("--pack-image", "Pack small images")
	.option("--target-service <service>", `(Deprecated) Specify the target service of the exported content:${SERVICE_TYPES}`)
	.option("--nicolive", "Export zip file for nicolive")
	.option("--resolve-akashic-runtime", "Fill akashic-runtime field in game.json")
	.option("--preserve-package-json", "Preserve package.json even if --strip");

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

		if (options.targetService && !SERVICE_TYPES.includes(options.targetService)) {
			console.error("Invalid --target-service option argument: " + options.targetService);
			process.exit(1);
		}

		const conf = configuration!.commandOptions?.export?.zip ?? {};
		cli({
			cwd: options.cwd ?? conf.cwd,
			quiet: options.quiet ?? conf.quiet,
			output: options.output ?? conf.output,
			force: options.force ?? conf.force,
			strip: options.strip ?? conf.strip,
			minify: options.minify ?? conf.minify,
			minifyJs: options.minifyJs ?? conf.minifyJs,
			minifyJson: options.minifyJson ?? conf.minifyJson,
			packImage: options.packImage ?? conf.packImage,
			hashFilename: options.hashFilename ?? conf.hashFilename,
			bundle: options.bundle ?? conf.bundle,
			babel: options.es5Downpile ?? conf.babel,
			omitEmptyJs: options.omitEmptyJs ?? conf.omitEmptyJs,
			omitUnbundledJs: options.omitUnbundledJs ?? conf.omitUnbundledJs,
			targetService: options.targetService ?? conf.targetService,
			nicolive: options.nicolive ?? conf.nicolive,
			resolveAkashicRuntime: options.resolveAkashicRuntime ?? conf.resolveAkashicRuntime,
			preservePackageJson: options.preservePackageJson ?? options.preservePackageJson
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
