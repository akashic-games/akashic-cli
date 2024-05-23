const { execSync } = require("child_process");
const { join } = require("path");

try {
	const npmRootPath = execSync("npm root", { encoding: "utf-8" }).trim();
	execSync("npx shx mkdir -p www/public/thirdparty", { encoding: "utf-8" });
	execSync(`npx shx cp -r ${join(npmRootPath, "/material-icons/iconfont")} ${join(__dirname, "../www/public/thirdparty/material-icons")}`, { encoding: "utf-8" });
} catch (e) {
	console.error(e);
	process.exitCode = 1;
}
