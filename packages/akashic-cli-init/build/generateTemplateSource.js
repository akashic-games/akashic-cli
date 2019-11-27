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
// テンプレート生成処理時間の短縮のため、各jsテンプレートビルド時に共通的に使用するパッケージを先にインストールしておく
execSync(`cd ${path.join(templatesDirPath, "common")} && npm install`);
Object.keys(templateData).forEach(key => {
	console.log(`"${key}" template`);
	shell.cp("-R", path.join(templatesSrcDirPath, templateData[key]["src"], "src"), path.join(templatesDirPath, "common", "src"));
	console.log("  - start to build");
	// node_modulesがcommon下にあるので、そこでそのままビルドする
	execSync(`cd ${path.join(templatesDirPath, "common")} && npm run build`);
	console.log("  - end to build");
	// 他のテンプレートもcommon下でビルドするため、ソースファイルディレクトリは削除しておく
	shell.rm("-rf", path.join(templatesDirPath, "common", "src"));
	// このスクリプト実行前にテンプレートが既に作られているならば、それを削除する
	shell.rm("-rf", path.join(templatesDirPath, templateData[key]["js-dist"]));
	// テンプレートを新たに生成
	shell.cp("-R", path.join(templatesSrcDirPath, templateData[key]["src"]), path.join(templatesDirPath, templateData[key]["js-dist"]));
	// common下でビルド済みのためソースファイルディレクトリは不要なので削除
	shell.rm("-rf", path.join(templatesDirPath, templateData[key]["js-dist"], "src"));
	// common下でビルドしたものをテンプレートに移す
	shell.mv(path.join(templatesDirPath, "common", "script"), path.join(templatesDirPath, templateData[key]["js-dist"], "script"));
	// javascriptテンプレートに共通で必要なものもテンプレートに置く
	shell.cp("-R", path.join(templatesSrcDirPath, "javascript-base", "*"), path.join(templatesDirPath, templateData[key]["js-dist"]));
	shell.cp(path.join(templatesSrcDirPath, "javascript-base", ".eslintrc.json"), path.join(templatesDirPath, templateData[key]["js-dist"]));
	// game.jsonにscriptアセットが登録されていない状態なので、ここで登録する
	execSync(`cd ${path.join(templatesDirPath, templateData[key]["js-dist"])} && ${path.join(templatesDirPath, templateData[key]["js-dist"], "..", "common", "node_modules", ".bin", "akashic-cli-scan")} asset script`);
});
shell.rm("-rf", path.join(templatesDirPath, "common"));
console.log("End to generate javascript-templates");
