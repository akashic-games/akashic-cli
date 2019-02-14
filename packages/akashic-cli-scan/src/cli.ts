import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import { promiseScanAsset, promiseScanNodeModules } from "./scan";

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

commander
	.description("Update various properties of game.json")
	.version(ver);

commander
	.command("asset [target]")
	.description("Update 'assets' property of game.json")
	.option("-C, --cwd <dir>", "The directory incluedes game.json")
	.option("-q, --quiet", "Suppress output")
	.action((target: string, opts: any = {}) => {
		var logger = new ConsoleLogger({ quiet: opts.quiet });
		promiseScanAsset({ target: target, cwd: opts.cwd, logger: logger })
			.catch((err: any) => {
				logger.error(err);
				process.exit(1);
			});
	})
	.on("--help", () => {
		console.log("  Target:");
		console.log("");
		console.log("    image");
		console.log("    audio");
		console.log("    script");
		console.log("    text");
		console.log("    all");
		console.log("");
	});

commander
	.command("globalScripts")
	.description("Update 'globalScripts' property of game.json")
	.option("-C, --cwd <dir>", "The directory incluedes game.json")
	.option("-e, --from-entry-point", "Scan from the entrypoint instead of `npm ls`")
	.option("-q, --quiet", "Suppress output")
	.option("--no-omit-packagejson", "Add package.json of each module to the globalScripts property (to support older Akashic Engine)")
	.action((opts: any = {}) => {
		var logger = new ConsoleLogger({ quiet: opts.quiet });
		promiseScanNodeModules({ cwd: opts.cwd, logger: logger, fromEntryPoint: opts.fromEntryPoint, noOmitPackagejson: !opts.omitPackagejson })
			.catch((err: any) => {
				logger.error(err);
				process.exit(1);
			});
	});

export function run(argv: string[]): void {
	commander.parse(argv);

	if (argv.length < 3
		|| !argv[2].match(/^(asset|globalScripts)$/)) {
		commander.help();
	}

}
