import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import { promiseUpdate } from "./update";

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

interface CommandParameterObject {
	cwd?: string;
	quiet?: boolean;
	args?: string[];
}

commander
	.usage("[options] <moduleName...>")
	.description("Update installed npm modules")
	.version(ver);

function cli(param: CommandParameterObject) {
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
	cli(commander);
}
commander
	.on("--help", () => {
		console.log("  Update installed npm module");
		console.log("  If no moduleName is specified, update all modules");
	});
