import * as fs from "fs";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as mockfs from "mock-fs";
import { bundleScripts, convertGame, ConvertGameParameterObject } from "../../../lib/zip/convert";

class WarnRecordLogger {
	warningMessage: string | null = null;
	warn(message: string): void {
		this.warningMessage = message;
	}
	print(message: string): void {
		console.log(message);
	}
	error(message: string): void {
		console.error(message);
	}
	info(message: string): void {
		console.log(message);
	}
}

function normalizeConvertGameParameterObject(
	param: Partial<ConvertGameParameterObject> & { source: string; dest: string }
): ConvertGameParameterObject {
	return {
		bundle: false,
		babel: false,
		minifyJs: false,
		minifyJson: false,
		packImage: false,
		needUntaintedImage: false,
		completeEnvironment: false,
		strip: false,
		hashLength: 0,
		logger: new ConsoleLogger(),
		optionInfo: null,
		omitUnbundledJs: false,
		targetService: "none",
		...param
	};
}

describe("convert", () => {

	afterEach(() => {
		mockfs.restore();
	});

	describe("bundleScripts", () => {
		it("bundles scripts", (done) => {
			bundleScripts(
				require("../../fixtures/simple_game/game.json").main,
				path.resolve(__dirname, "..", "..", "fixtures", "simple_game")
			)
				.then((result) => {
					expect(result.filePaths).toEqual([
						"script/bar.js",
						"script/foo.js",
						"script/main.js",
						"text/test.json"
					]);

					// bundle結果の内容を確認するのは難しいので、簡易的に実行結果を確認しておく
					const f = new Function("module", "exports", result.bundle);
					const m = { exports: {} };
					f(m, m.exports);
					expect(typeof m.exports).toBe("function");
					expect((m.exports as Function)()).toEqual({ x: 200, y: 12 });

					done();
				}, done.fail);
		});
	});

	describe("convertGame", () => {
		const destDir = path.resolve(__dirname, "..", "..", "fixtures", "output");
		afterEach(() => {
			fsx.removeSync(destDir);
		});

		it("can not convert game if script that is not written with ES5 syntax", (done) => {
			const logger = new WarnRecordLogger();
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_es6"),
				dest: destDir,
				logger
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(destDir)).toBe(true);
					const expected = "Non-ES5 syntax found.\n"
						+ "script/main.js(1:1): Parsing error: The keyword 'const' is reserved\n"
						+ "script/foo.js(1:1): Parsing error: The keyword 'const' is reserved";
					expect(logger.warningMessage).toBe(expected);
					done();
				}, done.fail);
		});

		it("can downpile script to ES5", (done) => {
			const logger = new WarnRecordLogger();
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_es6"),
				dest: destDir,
				babel: true,
				logger
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(destDir)).toBe(true);
					expect(logger.warningMessage).toBe(null);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					done();
				}, done.fail);
		});

		it("copy all files in target directory", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_external"),
				dest: destDir
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/unrefered.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/ignore.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					done();
				}, done.fail);
		});

		it("copy only necessary files in target directory when strip mode", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_external"),
				dest: destDir,
				strip: true
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/ignore.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/unrefered.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(false);
					done();
				}, done.fail);
		});

		it("copy bundled-script in target directory when bundle mode", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_external"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/unrefered.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/ignore.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.main).toBe("./script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.path).toBe("script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.type).toBe("script");
					expect(gameJson.assets.aez_bundle_main.global).toBe(true);
					expect(gameJson.assets.ignore2.global).toBeTruthy(); // omitEmptyJs があった時は偽になりえたので念のため確認
					done();
				}, done.fail);
		});

		it("does not copy output directory, even if it exists in source directory", (done) => {
			const souceDirectory = path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_external");
			const outputDirectory = path.join(souceDirectory, "output");
			const param = normalizeConvertGameParameterObject({
				source: souceDirectory,
				dest: outputDirectory,
				bundle: true,
				omitUnbundledJs: true
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(outputDirectory, "script/unrefered.js"))).toBe(false);
					expect(fs.existsSync(path.join(outputDirectory, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(outputDirectory, "script/ignore.js"))).toBe(false);
					expect(fs.existsSync(path.join(outputDirectory, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(outputDirectory, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(outputDirectory, "output"))).toBe(false);
					expect(fs.readFileSync(path.join(outputDirectory, "game.json")).toString())
						.not.toBe(fs.readFileSync(path.join(param.source, "game.json")).toString());
					fsx.removeSync(outputDirectory);
					done();
				}, done.fail);
		});

		it("copy only necessary files and bundled-script in target directory when strip and bundle mode", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_external"),
				dest: destDir,
				strip: true,
				bundle: true,
				omitUnbundledJs: true
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/ignore.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/unrefered.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(false);
					expect(fs.readFileSync(path.join(destDir, "game.json")).toString())
						.not.toBe(fs.readFileSync(path.join(param.source, "game.json")).toString());
					done();
				}, done.fail);
		});

		it("includes empty .js (regression test for omitEmptyJs, a removed option)", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_external"),
				dest: destDir
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/ignore.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/unrefered.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					const gameJson = fs.readFileSync(path.join(destDir, "game.json")).toString();
					const gameJsonObj = JSON.parse(gameJson);
					expect(gameJsonObj.assets.ignore2.global).toBeTruthy();
					done();
				}, done.fail);
		});

		it("rewrite aez_bundle_main.js, even if aez_bundle_main script-asset already exists as entry-point", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main"),
				dest: destDir,
				bundle: true
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.readFileSync(path.join(destDir, "game.json")).toString())
						.not.toBe(fs.readFileSync(path.join(param.source, "game.json")).toString());
					expect(fs.readFileSync(path.join(destDir, "script/aez_bundle_main.js")).toString())
						.not.toBe(fs.readFileSync(path.join(param.source, "script/aez_bundle_main.js")).toString());
					done();
				}, done.fail);
		});

		it("does not rewrite aez_bundle_main.js, even if aez_bundle_main script-asset already exists as not entry-point", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main2"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(false);
					// script/aez_bundle_main.jsに被らない名前のスクリプトファイルが生成される
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main0.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.readFileSync(path.join(destDir, "game.json")).toString())
						.not.toBe(fs.readFileSync(path.join(param.source, "game.json")).toString());
					done();
				}, done.fail);
		});

		it("does not rewrite aez_bundle_main-asset, even if same name asset already exists as not script-asset", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main3"),
				dest: destDir,
				bundle: true
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(false);
					// script/aez_bundle_main.jsに被らない名前のスクリプトファイルが生成される
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main0.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "image/akashic-cli.png"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets.aez_bundle_main0.path).toBe("script/aez_bundle_main0.js");
					expect(gameJson.assets.aez_bundle_main0.type).toBe("script");
					expect(gameJson.assets.aez_bundle_main.path).toBe("image/akashic-cli.png");
					expect(gameJson.assets.aez_bundle_main.type).toBe("image");
					expect(gameJson.assets.aez_bundle_main.hint).not.toBeDefined();
					done();
				}, done.fail);
		});

		it("rewrite mainScene-asset, even if main is not included in game.json", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_main_scene"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/mainScene.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/mainScene0.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.readFileSync(path.join(destDir, "script/mainScene.js")).toString())
						.toBe(fs.readFileSync(path.join(param.source, "script/mainScene.js")).toString());
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets.mainScene.path).toBe("script/mainScene0.js");
					expect(gameJson.assets.mainScene.type).toBe("script");
					expect(gameJson.assets.mainScene.global).toBe(true);
					expect(gameJson.assets.notEntryPoint.path).toBe("script/mainScene.js");
					done();
				}, done.fail);
		});

		it("Unnecessary files are deleted by bundle", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main4"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: true
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);

					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets.aez_bundle_main.path).toBe("script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.type).toBe("script");
					expect(gameJson.assets.test.path).toBe("text/test.json");
					expect(gameJson.assets.test.type).toBe("text");
					// バンドルされていない不要なファイルはgamejsonから取り除かれる
					expect(gameJson.assets.main).toBeUndefined();
					expect(gameJson.assets.foo).toBeUndefined();
					expect(gameJson.assets.bar).toBeUndefined();

					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/ModuleA.js")).toBeFalsy();
					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/ModuleB.js")).toBeFalsy();
					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/ModuleC.js")).toBeFalsy();
					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/index.js")).toBeFalsy();
					done();
				}, done.fail);
		});

		it("Unnecessary files are also saved with bundle", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main4"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);

					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets.aez_bundle_main.path).toBe("script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.type).toBe("script");
					expect(gameJson.assets.test.path).toBe("text/test.json");
					expect(gameJson.assets.test.type).toBe("text");
					// バントルされていないファイルも omitUnbundledJs: false により残る。
					expect(gameJson.assets.bar.path).toBe("script/bar.js");
					expect(gameJson.assets.bar.type).toBe("script");
					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/ModuleB.js")).toBeTruthy();
					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/ModuleC.js")).toBeTruthy();
					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/index.js")).toBeTruthy();

					// バンドルされたファイルは取り除かれる。
					expect(gameJson.assets.main).toBeUndefined();
					expect(gameJson.assets.foo).toBeUndefined();
					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/ModuleA.js")).toBeFalsy();
					done();
				}, done.fail);
		});

		it("Add untainted: true to gamejson's image asset when targetService is nicolive", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main3"),
				dest: destDir,
				targetService: "nicolive"
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);

					expect(fs.existsSync(path.join(destDir, "image/akashic-cli.png"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					const imgAsset = gameJson.assets.aez_bundle_main;
					expect(imgAsset.type).toBe("image");
					expect(imgAsset.hint.untainted).toBeTruthy();
					done();
				}, done.fail);
		});

		it("No change in the gamejson image asset gamejson's image asset when targetService is none", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main3"),
				dest: destDir,
				targetService: "none"
			});
			convertGame(param)
				.then(() => {
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					const imgAsset = gameJson.assets.aez_bundle_main;
					expect(imgAsset.type).toBe("image");
					expect(imgAsset.hint).not.toBeDefined();
					done();
				}, done.fail);
		});

		it("Operation plugin scripts are saved even if they are depended by bundled file", (done) => {
			const param = normalizeConvertGameParameterObject({
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_operation_plugins"),
				dest: destDir,
				bundle: true,
				targetService: "nicolive",
				omitUnbundledJs: true
			});
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					// bundle済みのファイルは残らない
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "node_modules/@hoge/testmodule/lib/ModuleC.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "node_modules/@hoge/testmodule/lib/index.js"))).toBe(false);
					// bundleされていたとしてもoperationPluginsとして登録されているスクリプトファイルは残る
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "node_modules/@hoge/testmodule/lib/ModuleA.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "node_modules/@hoge/testmodule/lib/ModuleB.js"))).toBe(true);
					// モジュール名で game.json の operationPlugins に記述されていても参照できる
					expect(fs.existsSync(path.join(destDir, "node_modules/@hoge/testmodule2/lib/index.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "node_modules/@hoge/testmodule2/lib/ModuleA.js"))).toBe(true);
					// モジュール名/lib 記述されていても参照できる
					expect(fs.existsSync(path.join(destDir, "node_modules/@hoge/testmodule3/lib/index.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "node_modules/@hoge/testmodule3/lib/ModuleA.js"))).toBe(true);
					done();
				}, done.fail);
		});
	});
});
