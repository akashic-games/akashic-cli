#!/usr/bin/env node

const argv = process.argv.slice(0);
const type = argv.splice(2, 1)[0];

if (type === "html") {
	const { run } = await import("../lib/html/index.js");
	run(argv);
} else if (type === "zip") {
	const { run } = await import("../lib/zip/index.js");
	run(argv);
} else if (type === "help" || type === "--help" || type === "-h") {
	console.log([
		"  ",
		"  Usage: akashic export [format] [options]",
		"  ",
		"  Format:",
		"    html",
		"    zip",
		"  "
	].join("\n"));
} else {
	console.log("Unknown option : " + type);
}
