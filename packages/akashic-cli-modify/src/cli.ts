import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import { promiseModifyBasicParameter } from "./modify";

function cliBasicParameter(target: string, value: string, opts: any): void {
	var logger = new ConsoleLogger({ quiet: opts.quiet });
	promiseModifyBasicParameter({ target: target, value: Number(value), cwd: opts.cwd, logger: logger })
		.catch((err: any) => {
			logger.error(err);
			process.exit(1);
		});
}

function defineCommand(commandName: string): void {
	commander
		.command(commandName + " <value>")
		.description("Update '" + commandName + "' property of game.json")
		.option("-C, --cwd <dir>", "The directory incluedes game.json")
		.option("-q, --quiet", "Suppress output")
		.action((value: string, opts: any = {}) => cliBasicParameter(commandName, value, opts));
}

["fps", "width", "height"].forEach((commandName) => {
	defineCommand(commandName);
});

commander
	.version(JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version);

commander
	.command("*", "", {noHelp: true})
	.action((value: string) => {
		console.error("Unknown target " + value);
		process.exit(1);
	});

export function run(argv: string[]): void {
	commander.parse(argv);
}
