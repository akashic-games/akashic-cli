// publish後にakashic-cliが一通り動作することを確認するためのスクリプト

const fs = require("fs");
const shell = require("shelljs");
const execSync = require("child_process").execSync;

const dirName = "test-akashic-cli_" + Date.now();

// テスト用に作成されたディレクトリを消してからテストを終了する。
function exit(isSuccess) {
	console.log("delete test-directory");
	shell.cd(`/tmp`);
	shell.rm("-rf", `/tmp/${dirName}`);
	if (isSuccess) {
		console.log("Completed!");
		process.exit(0);
	} else {
		console.log("Failed!");
		process.exit(1);
	}
}

// assertメソッド。期待通りの値でなければ即テストをエラーにして終了する。
function assert(actual, expected) {
	if (actual !== expected) {
		console.error(`${actual} is not ${expected}.`);
		exit(false);
	}
}

// 期待した値がactualsに含まれていることを確認。含まれていなければ即テストをエラーにして終了する。
function assertContains(actuals, expected) {
	if (actuals.indexOf(expected) === -1) {
		console.error(`${expected} is not contained in ${actuals}.`);
		exit(false);
	}
}

// 期待した値がactualsに含まれていないことを確認。含まれていれば即テストをエラーにして終了する。
function assertNotContains(actuals, expected) {
	if (actuals.indexOf(expected) >= 0) {
		console.error(`${expected} is contained in ${actuals}.`);
		exit(false);
	}
}

// 引数で与えられたシェルコマンドを実行。実行時にエラーが発生した場合即テストをエラーにして終了する。
function commandTest(command) {
	const result = execSync(command).toString();
	if (execSync("echo $?").toString().replace("\n", "") !== "0") {
		console.error(`Failed: ${command}.`);
		exit(false);
	}
	return result;
}

try{
	console.log("Start test");

	// テストに使用するtmpディレクトリの作成
	console.log("create test-directory");
	shell.mkdir("-p", [`/tmp/${dirName}`, `/tmp/${dirName}/game`]);

	// akashic-cliのインストール
	console.log("npm install @akashic/akashic-cli");
	shell.cd(`/tmp/${dirName}`);
	execSync("npm init -y");
	execSync("npm install @akashic/akashic-cli@latest");

	// 以下、akashic-cliの動作検証
	const akashicCliPath = `/tmp/${dirName}/node_modules/.bin/akashic`;

	// akashic -v で取得したバージョンがnpmにpublishされた最新バージョンと同じであることを確認
	console.log("check version of @akashic/akashic-cli");
	const expectedVersion = execSync("npm info @akashic/akashic-cli version").toString();
	const versionResult = commandTest(`${akashicCliPath} -V`).toString();
	assert(versionResult, expectedVersion);

	// ゲームディレクトリを作成しつつakashic-cli-initのテスト
	console.log("test @akashic/akashic-cli-init");
	shell.cd(`/tmp/${dirName}/game`);
	commandTest(`${akashicCliPath} init -y`);
	// 出力されるファイルの検証
	const files = fs.readdirSync(`/tmp/${dirName}/game`);
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
	commandTest(`${akashicCliPath} stat size`);

	console.log("test @akashic/akashic-cli-scan");
	commandTest(`${akashicCliPath} scan asset`);

	console.log("test @akashic/akashic-cli-update");
	commandTest(`${akashicCliPath} update`);

	console.log("test @akashic/akashic-cli-export-html");
	commandTest(`${akashicCliPath} export html --output output --bundle`);

	console.log("test @akashic/akashic-cli-export-zip");
	commandTest(`${akashicCliPath} zip --strip --bundle`);

	console.log("test @akashic/akashic-cli-modify");
	commandTest(`${akashicCliPath} modify width 816`);
	commandTest(`${akashicCliPath} modify height 624`);
	commandTest(`${akashicCliPath} modify fps 60`);
	let gameJson = JSON.parse(fs.readFileSync(`/tmp/${dirName}/game/game.json`).toString());
	assert(gameJson.width, 816);
	assert(gameJson.height, 624);
	assert(gameJson.fps, 60);

	console.log("test @akashic/akashic-cli-install");
	commandTest(`${akashicCliPath} install @akashic-extension/akashic-label`);
	let packageJson = JSON.parse(fs.readFileSync(`/tmp/${dirName}/game/package.json`).toString());
	gameJson = JSON.parse(fs.readFileSync(`/tmp/${dirName}/game/game.json`).toString());
	assertContains(Object.keys(packageJson["dependencies"]), "@akashic-extension/akashic-label");
	assertContains(Object.keys(gameJson["moduleMainScripts"]), "@akashic-extension/akashic-label");
	assertContains(gameJson["globalScripts"], "node_modules/@akashic-extension/akashic-label/lib/index.js");

	console.log("test @akashic/akashic-cli-uninstall");
	commandTest(`${akashicCliPath} uninstall @akashic-extension/akashic-label`);
	packageJson = JSON.parse(fs.readFileSync(`/tmp/${dirName}/game/package.json`).toString());
	gameJson = JSON.parse(fs.readFileSync(`/tmp/${dirName}/game/game.json`).toString());
	assertNotContains(Object.keys(packageJson["dependencies"]), "@akashic-extension/akashic-label");
	assertNotContains(Object.keys(gameJson), "moduleMainScripts");
	assertNotContains(gameJson["globalScripts"], "node_modules/@akashic-extension/akashic-label/lib/index.js");

	exit(true);
} catch (e) {
	console.error(e);
	exit(false);
}
