const fs = require("fs");
const path = require("path");
const ncu = require("npm-check-updates");

const templateSrcPath = path.join(__dirname, "..", "templates-src");
const templates = fs.readdirSync(templateSrcPath).filter(dir => fs.existsSync(path.join(templateSrcPath, dir, "package.json")));

console.log("Start to update modules of templates");
Promise.all(
	templates.map((name) => {
		return ncu.run({upgrade :true, packageFile: path.join(templateSrcPath, name, "package.json"), filter: "/^@akashic\/.+$/"})
			.then(upgraded => console.log(`- ${name}:`, upgraded));
	})
).then(() => {
	console.log("End to update modules of templates");
});
