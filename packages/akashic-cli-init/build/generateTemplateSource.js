const path = require("path");
const shell = require('shelljs');
const { execSync } = require("child_process");

const templatesSrcDirPath = path.join(__dirname, "..", "templates-src");
const templatesDirPath = path.join(__dirname, "..", "templates");
const templateData = {
	"default": {
		"src": "game-default",
		"js-dist": "javascript",
		"ts-dist": "typescript"
	},
	"minimal": {
		"src": "game-minimal",
		"js-dist": "javascript-minimal",
		"ts-dist": "typescript-minimal"
	},
	"ichiba": {
		"src": "game-ichiba",
		"js-dist": "javascript-ichiba",
		"ts-dist": "typescript-ichiba"
	}
};

// typescriptテンプレートを作成
console.log("Start to generate typescript-templates");
Object.keys(templateData).forEach(key => {
	console.log(`"${key}" template`);
	shell.rm("-rf", path.join(templatesDirPath, templateData[key]["ts-dist"]));
	shell.cp("-R", path.join(templatesSrcDirPath, templateData[key]["src"]), path.join(templatesDirPath, templateData[key]["ts-dist"]));
	shell.cp("-R", path.join(templatesSrcDirPath, "typescript-base", "*"), path.join(templatesDirPath, templateData[key]["ts-dist"]));
	shell.cp(path.join(templatesSrcDirPath, "typescript-base", ".gitignore"), path.join(templatesDirPath, templateData[key]["ts-dist"]));
});
console.log("End to generate typescript-templates");

// javascriptテンプレートを作成
console.log("Start to generate javascript-templates");
Object.keys(templateData).forEach(key => {
	console.log(`"${key}" template`);
	shell.rm("-rf", path.join(templatesDirPath, templateData[key]["js-dist"]));
	shell.cp("-R", path.join(templatesSrcDirPath, templateData[key]["src"]), path.join(templatesDirPath, templateData[key]["js-dist"]));
	shell.cp(path.join(templatesSrcDirPath, "typescript-base", "package.json"), path.join(templatesDirPath, templateData[key]["js-dist"]));
	shell.cp(path.join(templatesSrcDirPath, "typescript-base", "tsconfig.json"), path.join(templatesDirPath, templateData[key]["js-dist"]));
	console.log("  - start to install packages and build");
	// インストールとビルドが完了するのを待ちたいので、ここだけ execSync を使用する
	execSync(`cd ${path.join(templatesDirPath, templateData[key]["js-dist"])} && npm install && npm run build`);
	console.log("  - end to install packages and build");
	shell.rm(
		"-rf",
		path.join(templatesDirPath, templateData[key]["js-dist"], "src"),
		path.join(templatesDirPath, templateData[key]["js-dist"], "node_modules")
	);
	shell.rm(
		path.join(templatesDirPath, templateData[key]["js-dist"], "package.json"),
		path.join(templatesDirPath, templateData[key]["js-dist"], "package-lock.json"),
		path.join(templatesDirPath, templateData[key]["js-dist"], "tsconfig.json")
	);
	shell.cp("-R", path.join(templatesSrcDirPath, "javascript-base", "*"), path.join(templatesDirPath, templateData[key]["js-dist"]));
	shell.cp(path.join(templatesSrcDirPath, "javascript-base", ".eslintrc.json"), path.join(templatesDirPath, templateData[key]["js-dist"]));
});
console.log("End to generate javascript-templates");
