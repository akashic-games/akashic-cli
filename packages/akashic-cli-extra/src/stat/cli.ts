import * as fs from "fs";
import * as path from "path";
import type { Logger, CliConfigStat } from "@akashic/akashic-cli-commons";
import { ConsoleLogger, ConfigurationFile, CliConfigurationFile } from "@akashic/akashic-cli-commons";
import { Command } from "commander";
import * as stat from "./stat.js";

function statSize(logger: Logger, param: CliConfigStat): void {
	const basepath = param.cwd || process.cwd();
	ConfigurationFile.read(path.join(basepath, "game.json"), logger)
		.then(game =>
			stat.size({
				logger,
				basepath,
				game,
				limit: param.limit,
				raw: !!param.raw
			})
		)
		.catch(err => errorExit(logger, err));
}

function errorExit(logger: Logger, message: string): void {
	logger.error(message);
	process.exit(1);
}

const version = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8")).version;

const commander = new Command();
commander
	.description("Show statistics information")
	.version(version)
	.usage("size [options]")
	.option("-C, --cwd <dir>", "The directory incluedes game.json")
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

export function run(argv: string[]): void {
	commander.parse(argv);
	const options = commander.opts();
	CliConfigurationFile.read(path.join(options.cwd || process.cwd(), "akashic.config.js"), (error, configuration) => {
		if (error) {
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
	});
}
