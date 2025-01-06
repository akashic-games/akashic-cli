import { execSync } from "child_process";
import { join } from "path";

try {
	const npmRootPath = execSync("npm root", { encoding: "utf-8" }).trim();
	execSync("npx shx mkdir -p src/client/static/thirdparty", { encoding: "utf-8" });
	execSync(`npx shx cp -r ${join(npmRootPath, "/material-icons/iconfont")} ${join(__dirname, "../src/client/static/thirdparty/material-icons")}`, { encoding: "utf-8" });
} catch (e) {
	console.error(e);
	process.exitCode = 1;
}
