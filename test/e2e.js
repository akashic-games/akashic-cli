// akashic-cli 全体の動作確認スクリプト
//
// Usage:
//  node test/e2e.js          (latestタグでpublishされたものをインストールしてテスト)
//  node test/e2e.js --local  (このリポジトリの packages/akashic-cli/bin/akashic をテスト)

import { tmpdir } from "os";
import { dirname, join, resolve } from "path";
import { mkdtemp, readdir, readFile, writeFile } from "fs/promises";
import { exec as _exec, spawn as _spawn } from "child_process";
import assert from "assert";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { createRequire } from "module";
import { setTimeout } from "timers/promises";
import getPort from "get-port";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const exec = promisify(_exec);
const shell = require("shelljs");
const _psTree = require("ps-tree");
const psTree = promisify(_psTree);
const tmpDir = tmpdir();
const targetDir = await mkdtemp(`${join(tmpDir, "test-akashic-cli_")}`);

const testsPublished = (process.argv.slice(2)[0] !== "--local");

process.on("exit", () => {
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

async function loadJSON(path) {
	const json = await readFile(path, { encoding: "utf-8" });
	return JSON.parse(json);
}

function spawn(command, argv) {
	const proc = _spawn(command, argv, { shell: true, detached: true });
	// 動作確認用にコメントアウトだけしておく
	// proc.stdout.on("data", data => void console.log(`${data}`));
	// proc.stderr.on("data", data => void console.error(`${data}`));
	const pid = proc.pid;
	return async () => {
		const children = await psTree(pid);
		for (const child of children) {
			process.kill(child.PID);
		}
	};
}

async function checkHttp(url) {
	try {
		const res = await fetch(url);
		return res.ok;
	} catch (_error) {
		return false;
	}
}

async function createAkashicConfigJs() { 	
	const content = `
		module.exports = {
		  commandOptions: {
		    init : {
			  type: "typescript",
			  yes: true
		    }
		  }
	    };
	`;
	await writeFile("akashic.config.js", content);
}

try {
	console.log("Start test");

	// テストに使用するtmpディレクトリの作成
	console.log("create test-directory");
	shell.mkdir("-p", [`${targetDir}`, `${targetDir}/game`]);

	shell.cd(`${targetDir}`);

	// akashic-cliのインストール
	let akashicCliPath;
	if (testsPublished) {
		console.log("install @akashic/akashic-cli@latest");
		await exec("npm init -y");
		await exec("npm install @akashic/akashic-cli@latest");
		akashicCliPath = `${targetDir}/node_modules/.bin/akashic`;
	} else {
		akashicCliPath = resolve(__dirname, "..", "packages", "akashic-cli", "bin", "akashic");

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
		const { stdout: expectedVersion } = await exec("npm info @akashic/akashic-cli version");
		const { stdout: versionResult } = await exec(`${akashicCliPath} -V`);
		assert(versionResult, expectedVersion);
	} else {
		console.log("skip to check version");
	}

	// ゲームディレクトリを作成しつつakashic-cli-initのテスト
	{
		console.log("test @akashic/akashic-cli-init");
		shell.cd(`${targetDir}/game`);
		await createAkashicConfigJs();
		await exec(`${akashicCliPath} init`);
		const files = await readdir(`${targetDir}/game`);
		assertContains(files, "audio");
		assertContains(files, "image");
		assertContains(files, "src");
		assertContains(files, "text");
		assertContains(files, "game.json");
		assertContains(files, "package.json");
		assertContains(files, "README.md");
		assertContains(files, "sandbox.config.js");
		assertContains(files, "eslint.config.js");
		assertContains(files, ".gitignore");
		assertContains(files, "jest.config.js");
		assertContains(files, "tsconfig.jest.json");
		assertContains(files, "tsconfig.json");
		await exec("npm install");
		await exec("npm run build");
		await exec("npm test");
		await exec("npm run lint");
	}

	// 各akashic-cli-xxxモジュールのテスト
	// TODO 出力確認
	{
		console.log("test @akashic/akashic-cli-stat");
		await exec(`${akashicCliPath} stat size`);
	}

	// TODO game.json の編集結果確認
	{
		console.log("test @akashic/akashic-cli-scan");
		await exec(`${akashicCliPath} scan asset`);
	}

	{
		console.log("test @akashic/akashic-cli-update");
		await exec(`${akashicCliPath} update`);
	}

	// TODO 出力結果検証
	{
		console.log("test @akashic/akashic-cli-export-html");
		await exec(`${akashicCliPath} export html --output output --bundle`);
	}

	// TODO 出力結果検証
	{
		console.log("test @akashic/akashic-cli-export-zip");
		await exec(`${akashicCliPath} export zip --strip --bundle`);
	}

	try {
		console.log("test @akashic/akashic-cli-sandbox");
		// 通常の動作テスト
		{
			const port = await getPort();
			const finalize = spawn(`${akashicCliPath} sandbox`, ["-p", port]);
			try {
				const baseUrl = `http://localhost:${port}`;
				await setTimeout(1000); // 起動するまで待機
				const engine = await (await fetch(`${baseUrl}/engine`)).json();
				assert.equal(engine.engine_configuration_version, "1.0");

				const gameJsonUrl = engine.content_url;
				const assetBaseUrl = engine.asset_base_url;
				const gameJson1 = await (await fetch(gameJsonUrl)).json();
				const gameJson2= await (await fetch(`${assetBaseUrl}game.json`)).json();

				assert.equal(gameJson1.width, 1280);
				assert.equal(gameJson1.height, 720);
				assert.equal(gameJson1.fps, 30);
				assert.deepEqual(gameJson1, gameJson2);
			} catch (error) {
				throw error;
			} finally {
				await finalize();
			}
		}

		// カスケードの動作テスト
		{
			// カスケード用の game.json を作成
			const cascadeGameJsonDir = `${targetDir}/cascadeGameJson`;
			shell.mkdir("-p", [cascadeGameJsonDir]);
			const cascadeGameJson = {
				width: 1920,
				height: 1080,
				fps: 60,
			};
			await writeFile(join(cascadeGameJsonDir, "game.json"), JSON.stringify(cascadeGameJson));

			const port = await getPort();
			const finalize = spawn(`${akashicCliPath} sandbox`, ["-p", port, "--cascade", cascadeGameJsonDir]);
			try {
				const baseUrl = `http://localhost:${port}`;
				await setTimeout(1000); // 起動するまで待機
				const engine = await (await fetch(`${baseUrl}/engine`)).json();
				assert.equal(engine.engine_configuration_version, "1.0");

				const gameJson = await (await fetch(engine.content_url)).json();
				const gameJson1 = await (await fetch(`${baseUrl}${gameJson.definitions[0]}`)).json();
				const gameJson2 = await (await fetch(`${baseUrl}${gameJson.definitions[1]}`)).json();
				assert.equal(gameJson1.width, 1280);
				assert.equal(gameJson1.height, 720);
				assert.equal(gameJson1.fps, 30);
				assert.equal(gameJson2.width, 1920);
				assert.equal(gameJson2.height, 1080);
				assert.equal(gameJson2.fps, 60);
			} catch (error) {
				throw error;
			} finally {
				await finalize();
			}
		}
	} catch (error) {
		throw new Error(`akashic-cli-sandbox did not run successfully: ${error}`);
	}

	{
		console.log("test @akashic/akashic-cli-modify");
		await exec(`${akashicCliPath} modify width 816`);
		await exec(`${akashicCliPath} modify height 624`);
		await exec(`${akashicCliPath} modify fps 60`);
		const gameJson = await loadJSON(`${targetDir}/game/game.json`);
		assert(gameJson.width, 816);
		assert(gameJson.height, 624);
		assert(gameJson.fps, 60);
	}

	{
		console.log("test @akashic/akashic-cli-install");
		await exec(`${akashicCliPath} install @akashic-extension/akashic-label`);
		const packageJson = await loadJSON(`${targetDir}/game/package.json`);
		const gameJson = await loadJSON(`${targetDir}/game/game.json`);
		assertContains(Object.keys(packageJson["dependencies"]), "@akashic-extension/akashic-label");
		assertContains(Object.keys(gameJson["moduleMainScripts"]), "@akashic-extension/akashic-label");
		assertContains(gameJson["globalScripts"], "node_modules/@akashic-extension/akashic-label/lib/index.js");
	}

	{
		console.log("test @akashic/akashic-cli-uninstall");
		await exec(`${akashicCliPath} uninstall @akashic-extension/akashic-label`);
		const packageJson = await loadJSON(`${targetDir}/game/package.json`);
		const gameJson = await loadJSON(`${targetDir}/game/game.json`);
		if (packageJson["dependencies"]) {
			assertNotContains(Object.keys(packageJson["dependencies"]), "@akashic-extension/akashic-label");
		}
		assertContains(Object.keys(gameJson), "moduleMainScripts");
		assert.deepEqual(gameJson.moduleMainScripts, {});
		assertNotContains(gameJson["globalScripts"], "node_modules/@akashic-extension/akashic-label/lib/index.js");
	}

	console.log("Completed!");
	process.exitCode = 0;
} catch (e) {
	console.error(e);
	if (e.output) {
		console.error(e.output.toString());
	}
	console.error("Failed!");
	process.exitCode = 1;
}
