import { createRequire } from "module";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import { Command } from "commander";
import * as config from "./config.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json");

/**
 * akashic cli configを実行する
 *
 * この関数は複数回呼ばれるべきではない
 */
export function run(argv: string[]): void {
	const commander = new Command();
	commander
		.description("List and edit configurations")
		.version(version)
		.usage("<command> [argument]");

	commander
		.command("get [target]")
		.description("get configuration from your .akashicrc")
		.action(async (target: string, opts: any = {}) => {
			const logger = new ConsoleLogger({ quiet: opts.quiet });
			const value = await config.getConfigItem(null, target);
			// 互換性のために "null" の文字列を返している。(config に存在しない場合)
			// 利用者は akashic-cli 内部に限られるはずで、本当は悪影響なくこの仕様は変更できる可能性がある。
			logger.print(value ?? "null");
		});

	commander
		.command("set [target] [value]")
		.description("set configuration to your .akashicrc")
		.action(async (target: string, value: string, _opts: any = {}) => {
			await config.setConfigItem(null, target, value);
		});

	commander
		.command("delete [target]")
		.description("delete configuration from your .akashicrc")
		.action(async (target: string, _opts: any = {}) => {
			await config.deleteConfigItem(null, target);
		});

	commander
		.command("list")
		// akashicrcの仕様を定義する validator が出来るまで --all は実装できない
		// .option("-a, --all", "List all items")
		.description("list configuration from your .akashicrc")
		.action(async (opts: any = {}) => {
			const logger = new ConsoleLogger({ quiet: opts.quiet });
			await config.listConfigItems(logger);
		});


	commander.parse(argv);

	if (!/^(get|set|delete|list)$/.test(argv[2])) {
		commander.help();
	}
}
