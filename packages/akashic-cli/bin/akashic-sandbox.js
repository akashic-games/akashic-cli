#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program
	.allowUnknownOption(true)
	.option("-p, --port <port>", parseInt)
	.option("--legacy")
	.option("--standalone")
	.parse(process.argv);

const options = program.opts();

(async () => {
	const args = process.argv.filter(arg => arg !== "--legacy" );

	// --legacy オプションが指定された場合は akashic-cli-sandbox (旧バージョン) を使用
	if (options.legacy) {
		const { run } = await import("@akashic/akashic-cli-sandbox");
		run(args);
		return;
	}

	if (options.standalone == null) {
		args.push("--standalone");
	}

	// port が未指定なら後方互換としてデフォルト値 3000 を設定
	if (options.port == null) {
		args.push("--port", "3000");
	}

	const { run } = await import("@akashic/akashic-cli-serve/lib/server/index.js");
	run(args);
})();
