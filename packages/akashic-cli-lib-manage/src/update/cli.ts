import * as path from "path";
import { createRequire } from "module";
import type { CliConfigUpdate } from "@akashic/akashic-cli-commons";
import { ConsoleLogger, CliConfigurationFile } from "@akashic/akashic-cli-commons";
import { Command } from "commander";
import { promiseUpdate } from "./update.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json");

const commander = new Command();
commander
	.usage("[options] <moduleName...>")
	.description("Update installed npm modules")
	.version(version);

function cli(param: CliConfigUpdate): void {
	const logger = new ConsoleLogger({ quiet: param.quiet });
	promiseUpdate({ cwd: param.cwd, moduleNames: param.args, logger: logger })
		.catch((err: any) => {
			logger.error(err);
			process.exit(1);
		});
}

commander
	.option("-q, --quiet", "Suppress output");

export function run(argv: string[]): void {
	commander.parse(argv);
	const options = commander.opts();
	CliConfigurationFile.load(options.cwd || process.cwd()).then(configuration => {
		const conf = configuration!.commandOptions?.update ?? {};
		cli({
			cwd: options.cwd ?? conf.cwd,
			quiet: options.quiet ?? conf.quiet,
			args: commander.args ?? conf.args
		});
	}).catch(error => {
		console.error(error);
		process.exit(1);
	});
}
commander
	.on("--help", () => {
		console.log("  Update installed npm module");
		console.log("  If no moduleName is specified, update all modules");
	});
