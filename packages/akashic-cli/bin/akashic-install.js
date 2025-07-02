#!/usr/bin/env node

(async () => {
	const { run } = await import("@akashic/akashic-cli-lib-manage/lib/install/index.js");
	run(process.argv);
})();
