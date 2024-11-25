import * as path from "path";
import { createRequire } from "module";
import type { CliConfigUninstall, CliConfiguration } from "@akashic/akashic-cli-commons";
import { ConsoleLogger, FileSystem } from "@akashic/akashic-cli-commons";
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

const require = createRequire(import.meta.url);
const { version } = require("../../package.json");

const commander = new Command();
commander
	.version(version);

commander
	.description("Uninstall a node module and update globalScripts")
	.usage("[options] [moduleName ...]")
	.option("-l, --unlink", "Do npm unlink instead of npm uninstall")
	.option("-C, --cwd <dir>", "Specify directory includes game.json")
	.option("-q, --quiet", "Suppress output")
	.option("-p, --plugin", "Also remove from operationPlugins ", (x: string) => parseInt(x, 10));

export async function run(argv: string[]): Promise<void> {
	commander.parse(argv);
	const options = commander.opts();
	let configuration: CliConfiguration = { commandOptions: {} };
	try { 
		configuration = await FileSystem.readFile<CliConfiguration>(path.join(options.cwd || process.cwd(), "akashic.config.js"), "utf-8");
	} catch (error) {
		if (error.code !== "ENOENT") {
			console.error(error);
			process.exit(1);
		}
	}
	const conf = configuration!.commandOptions?.uninstall ?? {};
	cli({
		args: commander.args ?? conf.args,
		cwd: options.cwd ?? conf.cwd,
		unlink: options.unlink ?? conf.unlink,
		quiet: options.quiet ?? conf.quiet,
		plugin: options.plugin ?? conf.plugin
	});
}

