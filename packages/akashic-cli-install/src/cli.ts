import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger, CliConfigurationFile, CliConfigInstall } from "@akashic/akashic-cli-commons";
import { promiseInstall } from "./install";

function cli(param: CliConfigInstall): void {
	var logger = new ConsoleLogger({ quiet: param.quiet });
	var installParam = {
		moduleNames: param.args, cwd: param.cwd, plugin: param.plugin, logger: logger, link: param.link, noOmitPackagejson: !param.omitPackagejson
	};
	Promise.resolve()
		.then(() => promiseInstall(installParam))
		.catch((err: any) => {
			logger.error(err, err.cause);
			process.exit(1);
		});
}

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

commander
	.version(ver);

commander
	.description("Install a node module and update globalScripts")
	.usage("[options] [moduleName ...]")
	.option("-l, --link", "Do npm link instead of npm install")
	.option("-C, --cwd <dir>", "The directory incluedes game.json")
	.option("-q, --quiet", "Suppress output")
	.option("-p, --plugin <code>", "Also add to operationPlugins with the code", (x: string) => parseInt(x, 10))
	.option("--no-omit-packagejson", "Add package.json of each module to the globalScripts property (to support older Akashic Engine)");

export function run(argv: string[]): void {
	commander.parse(argv);
	CliConfigurationFile.read(path.join(commander["cwd"] || process.cwd(), "akashic.config.js"), (configuration) => {
		const conf = configuration.commandOptions.install || {};
		cli({
			args: commander["args"] ?? conf.args,
			cwd: commander["cwd"] ?? conf.cwd,
			link: commander["link"] ?? conf.link,
			quiet: commander["quiet"] ?? conf.quiet,
			plugin: commander["plugin"] ?? conf.plugin,
			omitPackagejson: commander["omitPackagejson"] ?? conf.omitPackagejson
		});
	});
}
