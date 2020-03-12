import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger, CliConfigurationFile, CliConfigUninstall } from "@akashic/akashic-cli-commons";
import { promiseUninstall } from "./uninstall";

function cli(param: CliConfigUninstall): void {
	var logger = new ConsoleLogger({ quiet: param.quiet });
	var uninstallParam = { moduleNames: param.args, cwd: param.cwd, plugin: param.plugin, logger: logger, unlink: param.unlink };
	Promise.resolve()
		.then(() => promiseUninstall(uninstallParam))
		.catch((err: any) => {
			logger.error(err, err.cause);
			process.exit(1);
		});
}

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

commander
	.version(ver);

commander
	.description("Uninstall a node module and update globalScripts")
	.usage("[options] [moduleName ...]")
	.option("-l, --unlink", "Do npm unlink instead of npm uninstall")
	.option("-C, --cwd <dir>", "Specify directory includes game.json")
	.option("-q, --quiet", "Suppress output")
	.option("-p, --plugin", "Also remove from operationPlugins ", (x: string) => parseInt(x, 10));

export function run(argv: string[]): void {
	commander.parse(argv);
	CliConfigurationFile.read(path.join(commander["cwd"] || process.cwd(), "akashic.config.js"), (error, configuration) => {
		const conf = error ? {} : configuration.commandOptions.uninstall || {};
		cli({
			args: commander.args ?? conf.args,
			cwd: commander.cwd ?? conf.cwd,
			unlink: commander.unlink ?? conf.unlink,
			quiet: commander.quiet ?? conf.quiet,
			plugin: commander.plugin ?? conf.plugin
		});
	});
}

