import * as fs from "fs";
import * as path from "path";
import type { CliConfigInstall } from "@akashic/akashic-cli-commons";
import { ConsoleLogger, CliConfigurationFile } from "@akashic/akashic-cli-commons";
import { Command } from "commander";
import { promiseInstall } from "./install";

function cli(param: CliConfigInstall): void {
	const logger = new ConsoleLogger({ quiet: param.quiet });
	const installParam = {
		moduleNames: param.args,
		cwd: param.cwd,
		plugin: param.plugin,
		logger: logger,
		link: param.link,
		noOmitPackagejson: !param.omitPackagejson,
		tmpMmp: param.tmpMmp
	};
	Promise.resolve()
		.then(() => promiseInstall(installParam))
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
	.description("Install a node module and update globalScripts")
	.usage("[options] [moduleName ...]")
	.option("-l, --link", "Do npm link instead of npm install")
	.option("-C, --cwd <dir>", "The directory incluedes game.json")
	.option("-q, --quiet", "Suppress output")
	.option("-p, --plugin <code>", "Also add to operationPlugins with the code", (x: string) => parseInt(x, 10))
	.option("--no-omit-packagejson", "Add package.json of each module to the globalScripts property (to support older Akashic Engine)")
	.option("--tmp-mmp", "Supports moduleMainPaths in game.json");

export function run(argv: string[]): void {
	commander.parse(argv);
	const options = commander.opts();
	CliConfigurationFile.read(path.join(options.cwd || process.cwd(), "akashic.config.js"), (error, configuration) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		const conf = configuration!.commandOptions?.install ?? {};
		cli({
			args: commander.args ?? conf.args,
			cwd: options.cwd ?? conf.cwd,
			link: options.link ?? conf.link,
			quiet: options.quiet ?? conf.quiet,
			plugin: options.plugin ?? conf.plugin,
			omitPackagejson: options.omitPackagejson ?? conf.omitPackagejson,
			tmpMmp: options.tmpMmp ?? conf.tmpMmp
		});
	});
}
