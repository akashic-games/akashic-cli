import * as fs from "fs";
import * as path from "path";
import type { CliConfigModify } from "@akashic/akashic-cli-commons";
import { ConsoleLogger, CliConfigurationFile } from "@akashic/akashic-cli-commons";
import { Command } from "commander";
import { promiseModifyBasicParameter } from "./modify.js";

const commander = new Command();

function cliBasicParameter(target: string, value: string, opts: CliConfigModify): void {
	const logger = new ConsoleLogger({ quiet: opts.quiet });

	promiseModifyBasicParameter({ target: target, value: Number(value), cwd: opts.cwd, logger: logger })
		.catch((err: any) => {
			logger.error(err);
			process.exit(1);
		});
}

function defineCommand(commandName: string): void {
	commander
		.command(commandName + " <value>")
		.description("Update '" + commandName + "' property of game.json")
		.option("-C, --cwd <dir>", "The directory incluedes game.json")
		.option("-q, --quiet", "Suppress output")
		.action((value: string, opts: CliConfigModify = {}) => {
			CliConfigurationFile.read(path.join(opts.cwd || process.cwd(), "akashic.config.js"), (error, configuration) => {
				if (error) {
					console.error(error);
					process.exit(1);
				}

				const conf = configuration!.commandOptions?.modify ?? {};
				cliBasicParameter(commandName, value, {
					cwd: opts.cwd ?? conf.cwd,
					quiet: opts.quiet ?? conf.quiet
				});
			});
		});
}

["fps", "width", "height"].forEach((commandName) => {
	defineCommand(commandName);
});

commander
	.version(JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8")).version);

commander
	.command("*", "", {noHelp: true})
	.action((value: string) => {
		console.error("Unknown target " + value);
		process.exit(1);
	});

export function run(argv: string[]): void {
	commander.parse(argv);
}
