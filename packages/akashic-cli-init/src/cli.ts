import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger, CliConfigurationFile, CliConfigInit } from "@akashic/akashic-cli-commons";
import { promiseInit } from "./init";
import { listTemplates } from "./listTemplates";

function cli(param: CliConfigInit): void {
	var logger = new ConsoleLogger({ quiet: param.quiet });
	var initParam = { cwd: param.cwd, type: param.type, logger: logger, forceCopy: param.force, skipAsk: param.yes };
	{
		Promise.resolve()
			.then(() => {
				if (param.list) {
					return listTemplates(initParam);
				}
				return promiseInit(initParam);
			})
			.catch((err: any) => {
				logger.error(err, err.cause);
				process.exit(1);
			});
	}
}

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

commander
	.version(ver);

commander
	.description("Generate project skeleton and initialize game.json.")
	.option("-C, --cwd <dir>", "The directory to initinialize")
	.option("-q, --quiet", "Suppress output")
	.option("-r, --registry <regname>", "Template registery to search template")
	.option("-t, --type <type>", "Type of template")
	.option("-l, --list", "Display available template list")
	.option("-f, --force", "If files to be copied already exist, overwrite them")
	.option("-y, --yes", "Initialize without user input");

export function run(argv: string[]): void {
	commander.parse(argv);

	CliConfigurationFile.read(path.join(commander["cwd"] || process.cwd(), "akashic.config.js"), (configuration) => {
		const conf = configuration.commandOptions.init || {};
		cli({
			cwd: commander.cwd ?? conf.cwd,
			quiet: commander.quiet ?? conf.quiet,
			type: commander.type ?? conf.type,
			list: commander.list ?? conf.list,
			yes: commander.yes ?? conf.yes,
			force: commander.force ?? conf.force
		});
	});
}
