import * as fs from "fs";
import * as path from "path";
import type { CliConfigUninstall } from "@akashic/akashic-cli-commons";
import { ConsoleLogger, CliConfigurationFile } from "@akashic/akashic-cli-commons";
import { Command } from "commander";
import { promiseUninstall } from "./uninstall.js";

function cli(param: CliConfigUninstall): void {
	const logger = new ConsoleLogger({ quiet: param.quiet });
	const uninstallParam = { moduleNames: param.args, cwd: param.cwd, plugin: param.plugin, logger: logger, unlink: param.unlink };
	Promise.resolve()
		.then(() => promiseUninstall(uninstallParam))
		.catch((err: any) => {
			logger.error(err, err.cause);
			process.exit(1);
		});
}

const ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8")).version;

const commander = new Command();
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
	const options = commander.opts();
	CliConfigurationFile.read(path.join(options.cwd || process.cwd(), "akashic.config.js"), (error, configuration) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		const conf = configuration!.commandOptions?.uninstall ?? {};
		cli({
			args: commander.args ?? conf.args,
			cwd: options.cwd ?? conf.cwd,
			unlink: options.unlink ?? conf.unlink,
			quiet: options.quiet ?? conf.quiet,
			plugin: options.plugin ?? conf.plugin
		});
	});
}

