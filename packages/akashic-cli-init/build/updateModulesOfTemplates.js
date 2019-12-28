const path = require("path");
const shell = require('shelljs');

const templates = ["javascript-base", "typescript-base"];
const templateSrcPath = path.join(__dirname, "..", "templates-src");

console.log("Start to update modules of templates");
templates.forEach(name => {
	console.log(`- ${name}`);
	const templatePath = path.join(templateSrcPath, name);
	const packageJson = require(path.join(templatePath, "package.json"));
	const targetModules = Object.keys(packageJson["devDependencies"]).filter(m => /^@akashic\//.test(m));
	shell.cd(templatePath);
	targetModules.forEach(module => {
		console.log(`  - ${module}`);
		shell.exec(`npm install --save-dev ${module}@latest`);
	});
});
console.log("End to update modules of templates");
