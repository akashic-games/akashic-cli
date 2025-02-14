#!/usr/bin/env node

(async () => {
	const { run } = await import("@akashic/akashic-cli-extra/lib/stat/index.js");
	run(process.argv);
})();
