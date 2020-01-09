const fs = require("fs");
const path = require("path");
const shell = require("shelljs");

const templateSrcPath = path.join(__dirname, "..", "templates-src");
const templates = fs.readdirSync(templateSrcPath).filter(dir => fs.existsSync(path.join(templateSrcPath, dir, "package.json")));

console.log("Start to update modules of templates");
const ncuPath = path.join(__dirname, "..", "node_modules", ".bin", "ncu");
templates.forEach(name => {
	console.log(`- ${name}`);
	shell.cd(path.join(templateSrcPath, name));
	shell.exec(`${ncuPath} -u "/^@akashic\/.+$/" --loglevel verbose --packageFile package.json`);
});
console.log("End to update modules of templates");
