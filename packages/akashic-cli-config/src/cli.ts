import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import * as config from "./config";

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8"));

commander
	.description("List and edit configurations")
	.version(packageJson.version)
	.usage("<command> [argument]");

commander
	.command("get [target]")
	.description("get configuration from your .akashicrc")
	.action((target: string, opts: any = {}) => {
		const logger = new ConsoleLogger({ quiet: opts.quiet });
		config.getConfigItem(null, target).then(value => logger.print(value));
	});

commander
	.command("set [target] [value]")
	.description("set configuration to your .akashicrc")
	.action((target: string, value: string, opts: any = {}) => {
		config.setConfigItem(null, target, value);
	});

commander
	.command("delete [target]")
	.description("delete configuration from your .akashicrc")
	.action((target: string, opts: any = {}) => {
		config.deleteConfigItem(null, target);
	});

commander
	.command("list")
	// akashicrcの仕様を定義する validator が出来るまで --all は実装できない
	// .option("-a, --all", "List all items")
	.description("list configuration from your .akashicrc")
	.action((opts: any = {}) => {
		const logger = new ConsoleLogger({ quiet: opts.quiet });
		config.listConfigItems(logger);
	});

export function run(argv: string[]): void {
	commander.parse(argv);

	if (!/^(get|set|delete|list)$/.test(argv[2])) {
		commander.help();
	}
}
