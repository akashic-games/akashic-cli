import * as fs from "fs";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import { Command } from "commander";
import * as config from "./config";

/**
 * akashic cli configを実行する
 *
 * この関数は複数回呼ばれるべきではない
 */
export function run(argv: string[]): void {

	const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8"));
	const commander = new Command();
	commander
		.description("List and edit configurations")
		.version(packageJson.version)
		.usage("<command> [argument]");

	commander
		.command("get [target]")
		.description("get configuration from your .akashicrc")
		.action((target: string, opts: any = {}) => {
			const logger = new ConsoleLogger({ quiet: opts.quiet });
			config.getConfigItem(null, target).then(value => {logger.print(value ?? "null")});
		});

	commander
		.command("set [target] [value]")
		.description("set configuration to your .akashicrc")
		.action((target: string, value: string, _opts: any = {}) => {
			config.setConfigItem(null, target, value);
		});

	commander
		.command("delete [target]")
		.description("delete configuration from your .akashicrc")
		.action((target: string, _opts: any = {}) => {
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


	commander.parse(argv);

	if (!/^(get|set|delete|list)$/.test(argv[2])) {
		commander.help();
	}
}
