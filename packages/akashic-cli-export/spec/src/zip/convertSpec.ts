import * as fs from "fs";
import { EOL } from "os";
import * as path from "path";
import * as fsx from "fs-extra";
import * as mockfs from "mock-fs";
import {
	bundleScripts,
	convertGame,
	ConvertGameParameterObject,
	checkAudioAssetExtensions,
	validateGameJsonForNicolive
} from "../../../lib/zip/convert";

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
		const consoleSpy = jest.spyOn(global.console, "warn");
		afterEach(() => {
			fsx.removeSync(destDir);
			consoleSpy.mockClear();
		});
		afterAll(() => {
			consoleSpy.mockRestore();
		});

		it("can not convert game if script that is not written with ES5 syntax", (done) => {
			var warningMessage = "";
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_es6"),
				dest: destDir,
				logger: {
					warn: (message: string) => {
						warningMessage = message;
					},
					print: (message: string) => {
						console.log(message);
					},
					error: (message: string) => {
						console.error(message);
					},
					info: (message: string) => {
						console.log(message);
					}
				}
			};
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(destDir)).toBe(true);
					const expected = "Non-ES5 syntax found.\n"
						+ "script/main.js(1:1): Parsing error: The keyword 'const' is reserved\n"
						+ "script/foo.js(1:1): Parsing error: The keyword 'const' is reserved";
					expect(warningMessage).toBe(expected);
					done();
				}, done.fail);
		});

		it("can downpile script to ES5", (done) => {
			var warningMessage = "";
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_es6"),
				dest: destDir,
				babel: true,
				logger: {
					warn: (message: string) => {
						warningMessage = message;
					},
					print: (message: string) => {
						console.log(message);
					},
					error: (message: string) => {
						console.error(message);
					},
					info: (message: string) => {
						console.log(message);
					}
				}
			};
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(destDir)).toBe(true);
					expect(warningMessage).toBe("");
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					done();
				}, done.fail);
		});

		it("copy all files in target directory", (done) => {
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_external"),
				dest: destDir
			};
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
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_external"),
				dest: destDir,
				strip: true
			};
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
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_external"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			};
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
			const param = {
				source: souceDirectory,
				dest: outputDirectory,
				bundle: true,
				omitUnbundledJs: true
			};
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
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_external"),
				dest: destDir,
				strip: true,
				bundle: true,
				omitUnbundledJs: true
			};
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
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_external"),
				dest: destDir
			};
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

		it("convert non UTF-8 content", (done) => {
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_using_non_utf8"),
				dest: destDir
			};
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "assets/euc-jp.txt"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "text/sjis.txt"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "text/utf8.txt"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);

					// UTF8 として読み込めることを確認
					const main = fs.readFileSync(path.join(destDir, "script/main.js"), { encoding: "utf-8" }).toString();
					expect(main).toBe([
						"var foo = require(\"./foo\");",
						"",
						"module.exports = function () {",
						"	return {",
						"		y: foo()",
						"	};",
						"}",
						""
					].join(EOL));
					const foo = fs.readFileSync(path.join(destDir, "script/foo.js"), { encoding: "utf-8" }).toString();
					expect(foo).toBe([
						"module.exports = function () {",
						"	return \"このスクリプトファイルは Shift-JIS です。\";",
						"};",
						""
					].join(EOL));
					const eucjp = fs.readFileSync(path.join(destDir, "assets/euc-jp.txt"), { encoding: "utf-8" }).toString();
					expect(eucjp).toBe("このテキストファイルは EUC-JP です");
					const sjis = fs.readFileSync(path.join(destDir, "text/sjis.txt"), { encoding: "utf-8" }).toString();
					expect(sjis).toBe("このテキストファイルは Shift-JIS です");
					const utf8 = fs.readFileSync(path.join(destDir, "text/utf8.txt"), { encoding: "utf-8" }).toString();
					expect(utf8).toBe("このテキストファイルは UTF8 です");
					done();
				}, done.fail);
		});

		it("rewrite aez_bundle_main.js, even if aez_bundle_main script-asset already exists as entry-point", (done) => {
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main"),
				dest: destDir,
				bundle: true
			};
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
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main2"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			};
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
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main3"),
				dest: destDir,
				bundle: true
			};
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
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_main_scene"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			};
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
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main4"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: true
			};
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
					// バンドルされた、もしくは利用されていない不要なファイルはgamejsonから取り除かれる
					expect(gameJson.assets.main).toBeUndefined();
					expect(gameJson.assets.foo).toBeUndefined();
					expect(gameJson.assets.bar).toBeUndefined();

					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/ModuleA.js")).toBeFalsy();
					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/ModuleB.js")).toBeFalsy();
					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/ModuleC.js")).toBeFalsy();
					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/index.js")).toBeFalsy();
					// バンドルに含まれず削除された利用されていない不要なファイルをログ出力
					expect(consoleSpy).toHaveBeenCalledWith("node_modules/@hoge/testmodule/lib/ModuleB.js was not included in the bundle.");
					expect(consoleSpy).toHaveBeenCalledWith("node_modules/@hoge/testmodule/lib/ModuleC.js was not included in the bundle.");
					expect(consoleSpy).toHaveBeenCalledWith("node_modules/@hoge/testmodule/lib/index.js was not included in the bundle.");
					expect(consoleSpy).toHaveBeenCalledWith("script/bar.js was not included in the bundle.");
					done();
				}, done.fail);
		});

		it("Unnecessary files are also saved with bundle", (done) => {
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main4"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			};
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
					// バンドルされていないファイルのログは出力されない
					expect(consoleSpy).toHaveBeenCalledTimes(0);

					// バンドルされたファイルは取り除かれる。
					expect(gameJson.assets.main).toBeUndefined();
					expect(gameJson.assets.foo).toBeUndefined();
					expect(gameJson.globalScripts.includes("node_modules/@hoge/testmodule/lib/ModuleA.js")).toBeFalsy();
					done();
				}, done.fail);
		});

		it("Add untainted: true to gamejson's image asset when targetService is nicolive", (done) => {
			const param: ConvertGameParameterObject = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main3"),
				dest: destDir,
				targetService: "nicolive"
			};
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
			const param: ConvertGameParameterObject = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_aez_bundle_main3"),
				dest: destDir,
				targetService: "none"
			};
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
			const param: ConvertGameParameterObject = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "simple_game_with_operation_plugins"),
				dest: destDir,
				bundle: true,
				targetService: "nicolive",
				omitUnbundledJs: true
			};
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

		it("nicolive option, can add akashic-runtime to gamejson.", (done) => {
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "sample_game_v3"),
				dest: destDir,
				bundle: true,
				nicolive: true
			};
			convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets.aez_bundle_main.path).toBe("script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.type).toBe("script");
					expect(gameJson.assets.aez_bundle_main.global).toBe(true);
					expect(gameJson.environment["sandbox-runtime"]).toBe("3");
					expect(gameJson.environment.external).toEqual({ send: "0" });
					expect(gameJson.environment["akashic-runtime"].version).toMatch(/^~3\.\d\.\d+(-.*)?$/);
					expect(gameJson.environment["akashic-runtime"].flavor).toBe("-canvas");
					done();
				}, done.fail);
		});

		it("nicolive option, Do not add akashic-runtime if it already exists in game.json.", (done) => {
			const param = {
				source: path.resolve(__dirname, "..", "..", "fixtures", "sample_game_with_akashic_runtime"),
				dest: destDir,
				bundle: true,
				nicolive: true
			};
			convertGame(param)
				.then(() => {
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment["akashic-runtime"].version).toBe("~1.0.9-beta");
					expect(gameJson.environment["akashic-runtime"].flavor).toBe(undefined);
					expect(gameJson.environment.nicolive.supportedModes.length).toBe(2);
					expect(gameJson.environment.nicolive.supportedModes).toContain("single");
					expect(gameJson.environment.nicolive.supportedModes).toContain("ranking");
					done();
				}, done.fail);
		});
	});
});

describe("game.json validation with nicolive option", () => {
	const gamejson: any = {
		environment: {
			nicolive: {
				supportedModes: ["multi"],
				preferredSessionParameters: {
					totalTimeLimit: 80
				}
			}
		}
	};

	it("validate normal end", () => {
		expect(() => validateGameJsonForNicolive(gamejson)).not.toThrow();
	});

	it("error in supportedModes", () => {
		delete gamejson.environment.nicolive.supportedModes;
		gamejson.environment.nicolive.supportedModes = []; // supportedModes なし
		expect(() => validateGameJsonForNicolive(gamejson)).toThrow();

		gamejson.environment.nicolive.supportedModes = []; // 空
		expect(() => validateGameJsonForNicolive(gamejson)).toThrow();

		gamejson.environment.nicolive.supportedModes = "ranking"; // 配列以外
		expect(() => validateGameJsonForNicolive(gamejson)).toThrow();

		gamejson.environment.nicolive.supportedModes = ["ranking", "multi", "hoge"]; // 指定値以外はエラーとせず console.warn()
		expect(() => validateGameJsonForNicolive(gamejson)).not.toThrow();
	});

	it("error in preferredSessionParameters.totalTimeLimit", () => {
		gamejson.environment.nicolive.preferredSessionParameters.totalTimeLimit = "foo"; // 数値以外
		expect(() => validateGameJsonForNicolive(gamejson)).toThrow();

		gamejson.environment.nicolive.preferredSessionParameters.totalTimeLimit = 19; // 範囲外
		expect(() => validateGameJsonForNicolive(gamejson)).toThrow();

		gamejson.environment.nicolive.preferredSessionParameters.totalTimeLimit = 201; // 範囲外
		expect(() => validateGameJsonForNicolive(gamejson)).toThrow();
	});

	it("nicolive property does not exist", () => {
		delete gamejson.environment.nicolive;
		expect(() => validateGameJsonForNicolive(gamejson)).toThrow();
	});
});

describe("checkAudioAssetExtensions", () => {
	const gamejson: any = {
		assets: {
			audio1: {
				type: "audio",
				duration: 456,
				systemId: "sound",
				global: true,
				hint: {
				  extensions: [".ogg", ".m4a"]
				}
			},
			audio2: {
				type: "audio",
				duration: 456,
				systemId: "sound",
				global: true,
				hint: {
				  extensions: [".m4a"]
				}
			},
			audio3: {
				type: "audio",
				duration: 456,
				systemId: "sound",
				global: true,
				hint: {
				  extensions: [".ogg"]
				}
			},
			audio4: {
				type: "audio",
				duration: 456,
				systemId: "sound",
				global: true,
				hint: {
				  extensions: [".ogg", ".aac"]
				}
			}

		}
	};

	it("Log output when checkAudioAssetExtensions", () => {
		const spy = jest.spyOn(global.console, "warn");
		checkAudioAssetExtensions(gamejson);

		expect(spy).toHaveBeenCalledWith(".ogg is missing from audio2.hint.extensions in game.json");
		expect(spy).toHaveBeenCalledWith(".m4a or .aac is missing from audio3.hint.extensions in game.json");
		spy.mockRestore();
	});
});
