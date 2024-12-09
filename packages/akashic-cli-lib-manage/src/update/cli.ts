import * as path from "path";
import { createRequire } from "module";
import type { CliConfigUpdate, CliConfiguration } from "@akashic/akashic-cli-commons";
import { ConsoleLogger, FileSystem } from "@akashic/akashic-cli-commons";
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
	const conf = configuration!.commandOptions?.update ?? {};
	cli({
		cwd: options.cwd ?? conf.cwd,
		quiet: options.quiet ?? conf.quiet,
		args: commander.args ?? conf.args
	});
}
commander
	.on("--help", () => {
		console.log("  Update installed npm module");
		console.log("  If no moduleName is specified, update all modules");
	});
