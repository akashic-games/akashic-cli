#!/usr/bin/env node

(async () => {
	const { run } = await import("@akashic/akashic-cli-lib-manage/lib/uninstall/index.js");
	run(process.argv);
})();
