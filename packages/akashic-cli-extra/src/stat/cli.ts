import * as path from "path";
import { createRequire } from "module";
import type { Logger, CliConfigStat, GameConfiguration, CliConfiguration } from "@akashic/akashic-cli-commons";
import { ConsoleLogger, FileSystem } from "@akashic/akashic-cli-commons";
import { Command } from "commander";
import * as stat from "./stat.js";

async function statSize(logger: Logger, param: CliConfigStat): Promise<void> {
	const basepath = param.cwd || process.cwd();
	try {
		const game = await FileSystem.readJSON<GameConfiguration>(path.join(basepath, "game.json"));
		await stat.size({
			logger,
			basepath,
			game,
			limit: param.limit,
			raw: !!param.raw
		});
	} catch (err: any) {
		errorExit(logger, err.message);
	}
}

function errorExit(logger: Logger, message: string): void {
	logger.error(message);
	process.exit(1);
}

const require = createRequire(import.meta.url);
const { version } = require("../../package.json");

const commander = new Command();
commander
	.description("Show statistics information")
	.version(version)
	.usage("size [options]")
	.option("-C, --cwd <dir>", "The directory includes game.json")
	.option("-q, --quiet", "Suppress output")
	.option("-l, --limit <limit>", "Limit size")
	.option("--raw", "Raw mode. Result will not contain logger prefix.");

function cli(param: CliConfigStat): void {
	const logger = new ConsoleLogger({ quiet: param.quiet });
	const target = param.args.length > 0 ? param.args[0] : "(empty)";
	switch (target) {
		case "size":
			statSize(logger, param);
			break;
		default:
			commander.help();
			break;
	}
}

export async function run(argv: string[]): Promise<void> {
	commander.parse(argv);
	const options = commander.opts();
	let configuration;
	try {
		configuration = await FileSystem.readJSWithDefault<CliConfiguration>(path.join(options.cwd || process.cwd(), "akashic.config.js"), { commandOptions: {} });
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
	const conf = configuration!.commandOptions?.stat ?? {};
	cli({
		args: commander.args ?? conf.args,
		cwd: options.cwd ?? conf.cwd,
		quiet: options.quiet ?? conf.quiet,
		limit: options.limit ?? conf.limit,
		raw: options.raw ?? conf.raw
	});
}
