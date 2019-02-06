import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import { promiseInit } from "./init";
import { listTemplates } from "./listTemplates";

interface CommandParameterObject {
	cwd?: string;
	quiet?: boolean;
	type?: string;
	list?: boolean;
	force?: boolean;
}

function cli(param: CommandParameterObject): void {
	var logger = new ConsoleLogger({ quiet: param.quiet });
	var initParam = { cwd: param.cwd, type: param.type, logger: logger, forceCopy: param.force };
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
	.option("-f, --force", "If files to be copied already exist, overwrite them");

export function run(argv: string[]): void {
	commander.parse(argv);
	cli(commander);
}
