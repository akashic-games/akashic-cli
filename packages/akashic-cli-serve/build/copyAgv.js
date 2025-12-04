import { execSync } from "child_process";
import { createRequire } from "module";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

if (process.env.SETUP) {
    process.exit(0);
}

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
	const agvw = require.resolve("@akashic/agvw/dist/index.js");
	execSync(`npx --no shx cp ${agvw} ${join(__dirname, "../www/public/external/akashic-gameview-web.strip.js")}`, { encoding: "utf-8" });

	const plg1 = require.resolve("@akashic/agvw/dist/plugin-instance-storage.js");
	execSync(`npx --no shx cp ${plg1} ${join(__dirname, "../www/public/external/plugin-instance-storage.js")}`, { encoding: "utf-8" });

	const plg2 = require.resolve("@akashic/agvw/dist/plugin-instance-storage-limited.js");
	execSync(`npx --no shx cp ${plg2} ${join(__dirname, "../www/public/external/plugin-instance-storage-limited.js")}`, { encoding: "utf-8" });

	execSync(`npx --no shx mkdir -p ${join(__dirname, "../www/internal/untrusted_loader")}`, { encoding: "utf-8" });
} catch (e) {
	console.error(e);
	process.exitCode = 1;
}
