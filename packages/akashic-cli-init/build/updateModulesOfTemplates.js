const fs = require("fs");
const path = require("path");
const ncu = require("npm-check-updates");

const templateSrcPath = path.join(__dirname, "..", "templates-src");
const templateSrcV3Path = path.join(__dirname, "..", "templates-src-v3");

updateModules(templateSrcPath);
updateModules(templateSrcV3Path);

function updateModules(srcPath) {
	const templates = fs.readdirSync(srcPath).filter(dir => fs.existsSync(path.join(srcPath, dir, "package.json")));
	console.log(`Start to update modules of templates in ${srcPath}`);
	Promise.all(
		templates.map((name) => {
			return ncu.run({upgrade :true, packageFile: path.join(srcPath, name, "package.json"), filter: "/^@akashic\/.+$/"})
				.then(upgraded => console.log(`- ${name}:`, upgraded));
		})
	).then(() => {
		console.log(`End to update modules of templates in ${srcPath}`);
	});
}
