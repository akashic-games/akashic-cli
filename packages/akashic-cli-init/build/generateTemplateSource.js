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
	"shin-ichiba-ranking": {
		"src": "game-shin-ichiba-ranking",
		"js-dist": "javascript-shin-ichiba-ranking",
		"ts-dist": "typescript-shin-ichiba-ranking"
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
shell.cp("-R", path.join(templatesSrcDirPath, "typescript-base"), path.join(templatesDirPath, "common"));
console.log("Install packages");
execSync(`cd ${path.join(templatesDirPath, "common")} && npm install`);
Object.keys(templateData).forEach(key => {
	console.log(`"${key}" template`);
	shell.cp("-R", path.join(templatesSrcDirPath, templateData[key]["src"], "src"), path.join(templatesDirPath, "common", "src"));
	console.log("  - start to build");
	// インストールとビルドが完了するのを待ちたいので、ここだけ execSync を使用する
	execSync(`cd ${path.join(templatesDirPath, "common")} && npm run build`);
	console.log("  - end to build");
	shell.rm("-rf", path.join(templatesDirPath, "common", "src"));
	shell.rm("-rf", path.join(templatesDirPath, templateData[key]["js-dist"]));
	shell.cp("-R", path.join(templatesSrcDirPath, templateData[key]["src"]), path.join(templatesDirPath, templateData[key]["js-dist"]));
	shell.rm("-rf", path.join(templatesDirPath, templateData[key]["js-dist"], "src"));
	shell.mv(path.join(templatesDirPath, "common", "script"), path.join(templatesDirPath, templateData[key]["js-dist"], "script"));
	shell.cp("-R", path.join(templatesSrcDirPath, "javascript-base", "*"), path.join(templatesDirPath, templateData[key]["js-dist"]));
	shell.cp(path.join(templatesSrcDirPath, "javascript-base", ".eslintrc.json"), path.join(templatesDirPath, templateData[key]["js-dist"]));
	execSync(`cd ${path.join(templatesDirPath, templateData[key]["js-dist"])} && ../common/node_modules/.bin/akashic-cli-scan asset script`);
});
shell.rm("-rf", path.join(templatesDirPath, "common"));
console.log("End to generate javascript-templates");
