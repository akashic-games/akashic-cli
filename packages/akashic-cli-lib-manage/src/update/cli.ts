import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger, CliConfigurationFile, CliConfigUpdate } from "@akashic/akashic-cli-commons";
import { promiseUpdate } from "./update";

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8")).version;

commander
	.usage("[options] <moduleName...>")
	.description("Update installed npm modules")
	.version(ver);

function cli(param: CliConfigUpdate) {
	var logger = new ConsoleLogger({ quiet: param.quiet });
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
	CliConfigurationFile.read(path.join(commander["cwd"] || process.cwd(), "akashic.config.js"), (error, configuration) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		const conf = configuration.commandOptions.update || {};
		cli({
			cwd: commander.cwd ?? conf.cwd,
			quiet: commander.quiet ?? conf.quiet,
			args: commander.args ?? conf.args
		});
	});
}
commander
	.on("--help", () => {
		console.log("  Update installed npm module");
		console.log("  If no moduleName is specified, update all modules");
	});
