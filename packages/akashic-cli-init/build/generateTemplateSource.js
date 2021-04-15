const fs = require("fs");
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

generateTemplates(templatesSrcDirPath, templatesDirPath, templateData);

function generateTemplates(srcPath, outPath, data) {
	// typescriptテンプレートを作成
	console.log(`Start to generate typescript-templates from ${srcPath}`);
	Object.keys(data).forEach(key => {
		console.log(`"${key}" template`);
		shell.rm("-rf", path.join(outPath, data[key]["ts-dist"]));
		shell.cp("-R", path.join(srcPath, data[key]["src"]), path.join(outPath, data[key]["ts-dist"]));
		shell.cp("-R", path.join(srcPath, "typescript-base", "*"), path.join(outPath, data[key]["ts-dist"]));
		shell.cp(path.join(srcPath, "typescript-base", ".eslintrc.js"), path.join(outPath, data[key]["ts-dist"]));
		shell.cp(path.join(srcPath, "typescript-base", ".gitignore"), path.join(outPath, data[key]["ts-dist"]));
	});
	console.log("End to generate typescript-templates");

	// javascriptテンプレートを作成
	console.log("Start to generate javascript-templates");
	shell.cp("-R", path.join(srcPath, "typescript-base"), path.join(outPath, "common"));
	console.log("Install packages");
	// テンプレート生成処理時間の短縮のため、各jsテンプレートビルド時に共通的に使用するパッケージを先にインストールしておく
	execSync(`cd ${path.join(outPath, "common")} && npm install`);
	Object.keys(data).forEach(key => {
		console.log(`"${key}" template`);
		shell.cp("-R", path.join(srcPath, data[key]["src"], "src"), path.join(outPath, "common", "src"));
		console.log("  - start to build");
		// node_modulesがcommon下にあるので、そこでそのままビルドする
		execSync(`cd ${path.join(outPath, "common")} && npm run build`);
		console.log("  - end to build");
		// 他のテンプレートもcommon下でビルドするため、ソースファイルディレクトリは削除しておく
		shell.rm("-rf", path.join(outPath, "common", "src"));
		// このスクリプト実行前にテンプレートが既に作られているならば、それを削除する
		shell.rm("-rf", path.join(outPath, data[key]["js-dist"]));
		// テンプレートを新たに生成
		shell.cp("-R", path.join(srcPath, data[key]["src"]), path.join(outPath, data[key]["js-dist"]));
		// JS テンプレートは単純化のため spec を置かないので削除
		shell.rm("-rf", path.join(outPath, data[key]["js-dist"], "spec"));
		// common下でビルド済みのためソースファイルディレクトリは不要なので削除
		shell.rm("-rf", path.join(outPath, data[key]["js-dist"], "src"));
		// common下でビルドしたものをテンプレートに移す
		shell.mv(path.join(outPath, "common", "script"), path.join(outPath, data[key]["js-dist"], "script"));
		// javascriptテンプレートに共通で必要なものもテンプレートに置く
		shell.cp("-R", path.join(srcPath, "javascript-base", "*"), path.join(outPath, data[key]["js-dist"]));
		// jsファイルに不要な行があれば削除する
		deleteUnnecessaryLinesFromJsFile(path.join(outPath, data[key]["js-dist"], "script"));
		shell.cp(path.join(srcPath, "javascript-base", ".eslintrc.json"), path.join(outPath, data[key]["js-dist"]));
		shell.cp(path.join(srcPath, "javascript-base", ".gitignore"), path.join(outPath, data[key]["js-dist"]));
		// game.jsonにscriptアセットが登録されていない状態なので、ここで登録する
		execSync(`cd ${path.join(outPath, data[key]["js-dist"])} && ${path.join(outPath, data[key]["js-dist"], "..", "common", "node_modules", ".bin", "akashic-cli-scan")} asset script`);
	});
	shell.rm("-rf", path.join(outPath, "common"));
	console.log(`End to generate javascript-templates from ${srcPath}`);
}


/**
 * 対象ディレクトリ配下の js ファイルからテンプレートとして不要な箇所を削除する。(初心者にはわかりづらく不要な箇所)
 * 削除後、中身がなければファイルを削除する。
 * @param targetPath 対象ディレクトリのパス
 */
function deleteUnnecessaryLinesFromJsFile(targetPath) {
	const excludeRe = /^Object.defineProperty\(exports,\s*"__esModule",\s*{\s*value:\s*true\s*}\);\s*$/m;
	const files = fs.readdirSync(targetPath);

	files.forEach((file) => {
		if (path.extname(file) !== ".js") return

		const filePath = path.join(targetPath, file);
		const data = fs.readFileSync(filePath, "utf-8").toString();
		const writeData = data.replace(excludeRe, "");
		if (data === writeData) return;

		if (writeData.length === 0) {
			fs.unlinkSync(filePath);
		} else {
			fs.writeFileSync(filePath, writeData, "utf-8");
		}
	});
}
