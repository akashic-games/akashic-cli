// publish後にakashic-cliが一通り動作することを確認するためのスクリプト
// 本スクリプトは、このリポジトリのコードをテストするのではなく、publish された akashic-cli の動作確認を行います
const os = require("os");
const path = require("path");
const fs = require("fs");
const shell = require("shelljs");
const assert = require("assert");
const execSync = require("child_process").execSync;

const tmpDir = os.tmpdir();
const dirName = "test-akashic-cli_" + Date.now();
const targetDir = path.join(tmpDir, dirName);

// テスト用に作成されたディレクトリを消してからテストを終了する。
process.on("exit", function() {
	console.log("delete test-directory");
	shell.cd(`${tmpDir}`);
	shell.rm("-rf", `${targetDir}`);
});

function quit(isSuccess) {
	if (isSuccess) {
		console.log("Completed!");
		process.exit(0);
	} else {
		console.log("Failed!");
		process.exit(1);
	}
}

// 期待した値がactualsに含まれていることを確認。
function assertContains(actuals, expected) {
	assert.notStrictEqual(actuals.indexOf(expected), -1);
}

// 期待した値がactualsに含まれていないことを確認。
function assertNotContains(actuals, expected) {
	assert.strictEqual(actuals.indexOf(expected), -1);
}

try{
	console.log("Start test");

	// テストに使用するtmpディレクトリの作成
	console.log("create test-directory");
	shell.mkdir("-p", [`${targetDir}`, `${targetDir}/game`]);

	// akashic-cliのインストール
	console.log("npm install @akashic/akashic-cli");
	shell.cd(`${targetDir}`);
	execSync("npm init -y");
	execSync("npm install @akashic/akashic-cli@latest");

	// 以下、akashic-cliの動作検証
	const akashicCliPath = `${targetDir}/node_modules/.bin/akashic`;

	// akashic -v で取得したバージョンがnpmにpublishされた最新バージョンと同じであることを確認
	console.log("check version of @akashic/akashic-cli");
	const expectedVersion = execSync("npm info @akashic/akashic-cli version").toString();
	const versionResult = execSync(`${akashicCliPath} -V`).toString();
	assert(versionResult, expectedVersion);

	// ゲームディレクトリを作成しつつakashic-cli-initのテスト
	console.log("test @akashic/akashic-cli-init");
	shell.cd(`${targetDir}/game`);
	execSync(`${akashicCliPath} init -y`);
	// 出力されるファイルの検証
	const files = fs.readdirSync(`${targetDir}/game`);
	assertContains(files, "audio");
	assertContains(files, "image");
	assertContains(files, "script");
	assertContains(files, "text");
	assertContains(files, ".eslintrc.json");
	assertContains(files, "game.json");
	assertContains(files, "package.json");
	assertContains(files, "README.md");

	// 各akashic-cli-xxxモジュールのテスト
	console.log("test @akashic/akashic-cli-stat");
	execSync(`${akashicCliPath} stat size`);

	console.log("test @akashic/akashic-cli-scan");
	execSync(`${akashicCliPath} scan asset`);

	console.log("test @akashic/akashic-cli-update");
	execSync(`${akashicCliPath} update`);

	console.log("test @akashic/akashic-cli-export-html");
	execSync(`${akashicCliPath} export html --output output --bundle`);

	console.log("test @akashic/akashic-cli-export-zip");
	execSync(`${akashicCliPath} zip --strip --bundle`);

	console.log("test @akashic/akashic-cli-modify");
	execSync(`${akashicCliPath} modify width 816`);
	execSync(`${akashicCliPath} modify height 624`);
	execSync(`${akashicCliPath} modify fps 60`);
	let gameJson = JSON.parse(fs.readFileSync(`${targetDir}/game/game.json`).toString());
	assert(gameJson.width, 816);
	assert(gameJson.height, 624);
	assert(gameJson.fps, 60);

	console.log("test @akashic/akashic-cli-install");
	execSync(`${akashicCliPath} install @akashic-extension/akashic-label`);
	let packageJson = JSON.parse(fs.readFileSync(`${targetDir}/game/package.json`).toString());
	gameJson = JSON.parse(fs.readFileSync(`${targetDir}/game/game.json`).toString());
	assertContains(Object.keys(packageJson["dependencies"]), "@akashic-extension/akashic-label");
	assertContains(Object.keys(gameJson["moduleMainScripts"]), "@akashic-extension/akashic-label");
	assertContains(gameJson["globalScripts"], "node_modules/@akashic-extension/akashic-label/lib/index.js");

	console.log("test @akashic/akashic-cli-uninstall");
	execSync(`${akashicCliPath} uninstall @akashic-extension/akashic-label`);
	packageJson = JSON.parse(fs.readFileSync(`${targetDir}/game/package.json`).toString());
	gameJson = JSON.parse(fs.readFileSync(`${targetDir}/game/game.json`).toString());
	assertNotContains(Object.keys(packageJson["dependencies"]), "@akashic-extension/akashic-label");
	assertNotContains(Object.keys(gameJson), "moduleMainScripts");
	assertNotContains(gameJson["globalScripts"], "node_modules/@akashic-extension/akashic-label/lib/index.js");

	quit(true);
} catch (e) {
	console.error(e);
	quit(false);
}
