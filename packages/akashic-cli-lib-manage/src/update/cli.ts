import * as fs from "fs";
import * as path from "path";
import type { CliConfigUpdate } from "@akashic/akashic-cli-commons";
import { ConsoleLogger, CliConfigurationFile } from "@akashic/akashic-cli-commons";
import { Command } from "commander";
import { promiseUpdate } from "./update.js";

const ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8")).version;

const commander = new Command();
commander
	.usage("[options] <moduleName...>")
	.description("Update installed npm modules")
	.version(ver);

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
	CliConfigurationFile.read(path.join(options.cwd || process.cwd(), "akashic.config.js"), (error, configuration) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		const conf = configuration!.commandOptions?.update ?? {};
		cli({
			cwd: options.cwd ?? conf.cwd,
			quiet: options.quiet ?? conf.quiet,
			args: commander.args ?? conf.args
		});
	});
}
commander
	.on("--help", () => {
		console.log("  Update installed npm module");
		console.log("  If no moduleName is specified, update all modules");
	});
