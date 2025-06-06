#!/usr/bin/env node

(async () => {
	const { run } = await import("@akashic/akashic-cli-scan");
	run(process.argv);
})();
