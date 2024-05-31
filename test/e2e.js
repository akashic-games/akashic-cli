// akashic-cli 全体の動作確認スクリプト
//
// Usage:
//  node test/e2e.js          (latestタグでpublishされたものをインストールしてテスト)
//  node test/e2e.js --local  (このリポジトリの packages/akashic-cli/bin/akashic をテスト)

const os = require("os");
const path = require("path");
const fs = require("fs");
const shell = require("shelljs");
const assert = require("assert");
const execSync = require("child_process").execSync;

const tmpDir = os.tmpdir();
const targetDir = fs.mkdtempSync(`${path.join(tmpDir, "test-akashic-cli_")}`);

const testsPublished = (process.argv.slice(2)[0] !== "--local");

process.on("exit", function() {
	console.log("delete test-directory");
	shell.cd(`${tmpDir}`);
	shell.rm("-rf", `${targetDir}`);
});

function assertContains(actuals, expected) {
	assert.notStrictEqual(actuals.indexOf(expected), -1);
}

function assertNotContains(actuals, expected) {
	assert.strictEqual(actuals.indexOf(expected), -1);
}

try{
	console.log("Start test");

	// テストに使用するtmpディレクトリの作成
	console.log("create test-directory");
	shell.mkdir("-p", [`${targetDir}`, `${targetDir}/game`]);

	shell.cd(`${targetDir}`);

	// akashic-cliのインストール
	let akashicCliPath;
	if (testsPublished) {
		console.log("install @akashic/akashic-cli@latest");
		execSync("npm init -y");
		execSync("npm install @akashic/akashic-cli@latest");
		akashicCliPath = `${targetDir}/node_modules/.bin/akashic`;
	} else {
		akashicCliPath = path.resolve(__dirname, "..", "packages", "akashic-cli", "bin", "akashic");

		// workaround: Windows 環境は shebang を解釈しないのでそのままでは実行できない。
		// (npm i @akashic/akashic-cli した時は実行可能な .cmd ファイルが作られるが、ここでは存在しない)
		// 仕方がないので node をつけて node に実行させる。
		if (process.platform === "win32") {
			akashicCliPath = `node ${akashicCliPath}`;
		}

		console.log(`use ${akashicCliPath}`);
	}

	// 以下、akashic-cliの動作検証
	if (testsPublished) {
		// akashic -v で取得したバージョンがnpmにpublishされた最新バージョンと同じであることを確認
		console.log("check version of @akashic/akashic-cli");
		const expectedVersion = execSync("npm info @akashic/akashic-cli version").toString();
		const versionResult = execSync(`${akashicCliPath} -V`).toString();
		assert(versionResult, expectedVersion);
	} else {
		console.log("skip to check version");
	}

	// ゲームディレクトリを作成しつつakashic-cli-initのテスト
	console.log("test @akashic/akashic-cli-init");
	shell.cd(`${targetDir}/game`);
	execSync(`${akashicCliPath} init --type typescript -y`);
	const files = fs.readdirSync(`${targetDir}/game`);
	assertContains(files, "audio");
	assertContains(files, "image");
	assertContains(files, "src");
	assertContains(files, "text");
	assertContains(files, "game.json");
	assertContains(files, "package.json");
	assertContains(files, "README.md");
	assertContains(files, "sandbox.config.js");
	assertContains(files, ".eslintrc.js");
	assertContains(files, ".gitignore");
	assertContains(files, "jest.config.js");
	assertContains(files, "tsconfig.jest.json");
	assertContains(files, "tsconfig.json");
	execSync("npm install");
	execSync("npm run build");
	execSync("npm test");
	execSync("npm run lint");

	// 各akashic-cli-xxxモジュールのテスト
	// TODO 出力確認
	console.log("test @akashic/akashic-cli-stat");
	execSync(`${akashicCliPath} stat size`);

	// TODO game.json の編集結果確認
	console.log("test @akashic/akashic-cli-scan");
	execSync(`${akashicCliPath} scan asset`);

	console.log("test @akashic/akashic-cli-update");
	execSync(`${akashicCliPath} update`);

	// TODO 出力結果検証
	console.log("test @akashic/akashic-cli-export-html");
	execSync(`${akashicCliPath} export html --output output --bundle`);

	// TODO 出力結果検証
	console.log("test @akashic/akashic-cli-export-zip");
	execSync(`${akashicCliPath} export zip --strip --bundle`);

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
	if (packageJson["dependencies"]) {
		assertNotContains(Object.keys(packageJson["dependencies"]), "@akashic-extension/akashic-label");
	}
	assertContains(Object.keys(gameJson), "moduleMainScripts");
	assert.deepEqual(gameJson.moduleMainScripts, {});
	assertNotContains(gameJson["globalScripts"], "node_modules/@akashic-extension/akashic-label/lib/index.js");

	console.log("Completed!");
	process.exit(0);
} catch (e) {
	console.error(e);
	if (e.output) {
		console.error(e.output.toString());
	}
	console.error("Failed!");
	process.exit(1);
}
