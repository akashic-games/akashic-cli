import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
	const npmRootPath = execSync("npm root", { encoding: "utf-8" }).trim();
	execSync(`npx shx cp ${join(npmRootPath, "/@akashic/agvw/dist/index.js")} ${join(__dirname, "../www/public/external/akashic-gameview-web.strip.js")}`, { encoding: "utf-8" });
	execSync(`npx shx mkdir -p ${join(__dirname, "../www/internal/untrusted_loader")}`, { encoding: "utf-8" });
} catch (e) {
	console.error(e);
	process.exitCode = 1;
}
