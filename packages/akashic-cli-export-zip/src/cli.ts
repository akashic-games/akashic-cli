import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import { promiseExportZip } from "./exportZip";

export interface CommandParameterObject {
	cwd?: string;
	quiet?: boolean;
	output?: string;
	force?: boolean;
	strip?: boolean;
	minify?: boolean;
	bundle?: boolean;
	babel?: boolean;
	hashFilename?: number | boolean;
	omitEmptyJs?: boolean;
}

export function cli(param: CommandParameterObject): void {
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
			logger
		}))
		.then(() => logger.info("Done!"))
		.catch((err: any) => {
			logger.error(err);
			process.exit(1);
		});
}

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

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
	cli({
		cwd: commander["cwd"],
		quiet: commander["quiet"],
		output: commander["output"],
		force: commander["force"],
		strip: commander["strip"],
		minify: commander["minify"],
		hashFilename: commander["hashFilename"],
		bundle: commander["bundle"],
		babel: commander["babel"],
		omitEmptyJs: commander["omitEmptyJs"]
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
