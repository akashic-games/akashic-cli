import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

if (process.env.SKIP_SERVE_PREPARE) {
	process.exit(0);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
	const npmRootPath = execSync("npm root", { encoding: "utf-8" }).trim();
	execSync("npx --no shx mkdir -p src/client/static/thirdparty", { encoding: "utf-8" });
	execSync(`npx --no shx cp -r ${join(npmRootPath, "/material-icons/iconfont")} ${join(__dirname, "../src/client/static/thirdparty/material-icons")}`, { encoding: "utf-8" });
} catch (e) {
	console.error(e);
	process.exitCode = 1;
}
