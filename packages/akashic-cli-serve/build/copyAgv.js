import { execSync } from "child_process";
import { createRequire } from "module";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
	const src = require.resolve("@akashic/agvw/dist/index.js");
	execSync(`npx shx cp ${src} ${join(__dirname, "../www/public/external/akashic-gameview-web.strip.js")}`, { encoding: "utf-8" });
	execSync(`npx shx mkdir -p ${join(__dirname, "../www/internal/untrusted_loader")}`, { encoding: "utf-8" });
} catch (e) {
	console.error(e);
	process.exitCode = 1;
}
