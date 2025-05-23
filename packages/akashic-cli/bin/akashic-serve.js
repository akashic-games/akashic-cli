#!/usr/bin/env node

(async () => {
	const { run } = await import("@akashic/akashic-cli-serve/lib/server/index.js");
	run(process.argv);
})();
