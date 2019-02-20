import * as path from "path";
import * as mockfs from "mock-fs";
import * as fs from "fs";
import * as fsx from "fs-extra";
import { bundleScripts, convertGame } from "../../lib/convert";

describe("convert", () => {

	afterEach(() => {
		mockfs.restore();
	});

	describe("bundleScripts", () => {
		it("bundles scripts", (done) => {
			bundleScripts(require("../fixtures/simple_game/game.json").main, path.resolve(__dirname, "..", "fixtures", "simple_game"))
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
		const destDir = path.resolve(__dirname, "..", "fixtures", "output");
		afterEach(() => {
			fsx.removeSync(destDir);
		});
		it("can not convert game if script that is not written with ES5 syntax", (done) => {
			var warningMessage = "";
			const es6GameParameter = {
				source: path.resolve(__dirname, "..", "fixtures", "simple_game_es6"),
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
			convertGame(es6GameParameter)
				.then(() => {
					expect(fs.existsSync(destDir)).toBe(true);
					const expected = "Non-ES5 syntax found.\n"
						+ "script/main.js(1:1): Parsing error: The keyword 'const' is reserved\n"
						+ "script/foo.js(1:1): Parsing error: The keyword 'const' is reserved";
					expect(warningMessage).toBe(expected);
					done();
				}, done.fail);
		});
		it("copy all files in target directory", (done) => {
			const es6GameParameter = {
				source: path.resolve(__dirname, "..", "fixtures", "simple_game_using_external"),
				dest: destDir
			};
			convertGame(es6GameParameter)
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
			const es6GameParameter = {
				source: path.resolve(__dirname, "..", "fixtures", "simple_game_using_external"),
				dest: destDir,
				strip: true
			};
			convertGame(es6GameParameter)
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
		it("copy bundled-script in target directory when bandle mode", (done) => {
			const es6GameParameter = {
				source: path.resolve(__dirname, "..", "fixtures", "simple_game_using_external"),
				dest: destDir,
				bundle: true,
				omitEmptyJs: true
			};
			convertGame(es6GameParameter)
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
					expect(gameJson.assets["aez_bundle_main"].path).toBe("script/aez_bundle_main.js");
					expect(gameJson.assets["aez_bundle_main"].type).toBe("script");
					expect(gameJson.assets["aez_bundle_main"].global).toBe(true);
					expect(gameJson.assets["ignore2"].global).toBeFalsy();
					done();
				}, done.fail);
		});
		it("does not copy output directory, even if it exists in source directory", (done) => {
			const souceDirectory = path.resolve(__dirname, "..", "fixtures", "simple_game_using_external");
			const outputDirectory = path.join(souceDirectory, "output");
			const es6GameParameter = {
				source: souceDirectory,
				dest: outputDirectory,
				bundle: true
			};
			convertGame(es6GameParameter)
				.then(() => {
					expect(fs.existsSync(path.join(outputDirectory, "script/unrefered.js"))).toBe(true);
					expect(fs.existsSync(path.join(outputDirectory, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(outputDirectory, "script/ignore.js"))).toBe(true);
					expect(fs.existsSync(path.join(outputDirectory, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(outputDirectory, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(outputDirectory, "output"))).toBe(false);
					expect(fs.readFileSync(path.join(outputDirectory, "game.json")).toString())
						.not.toBe(fs.readFileSync(path.join(es6GameParameter.source, "game.json")).toString());
					fsx.removeSync(outputDirectory);
					done();
				}, done.fail);
		});
		it("copy only necessary files and bundled-script in target directory when strip and bundle mode", (done) => {
			const es6GameParameter = {
				source: path.resolve(__dirname, "..", "fixtures", "simple_game_using_external"),
				dest: destDir,
				strip: true,
				bundle: true
			};
			convertGame(es6GameParameter)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/ignore.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/unrefered.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(false);
					expect(fs.readFileSync(path.join(destDir, "game.json")).toString())
						.not.toBe(fs.readFileSync(path.join(es6GameParameter.source, "game.json")).toString());
					done();
				}, done.fail);
		});
		it("Include empty files when in no-omit-empty-js mode", (done) => {
			const es6GameParameter = {
				source: path.resolve(__dirname, "..", "fixtures", "simple_game_using_external"),
				dest: destDir,
				omitEmptyJs: false
			};
			convertGame(es6GameParameter)
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
					expect(gameJsonObj.assets["ignore2"].global).toBeTruthy();
					done();
				}, done.fail);
		});
		it("rewrite aez_bundle_main.js, even if aez_bundle_main script-asset already exists as entry-point", (done) => {
			const es6GameParameter = {
				source: path.resolve(__dirname, "..", "fixtures", "simple_game_with_aez_bundle_main"),
				dest: destDir,
				bundle: true
			};
			convertGame(es6GameParameter)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.readFileSync(path.join(destDir, "game.json")).toString())
						.not.toBe(fs.readFileSync(path.join(es6GameParameter.source, "game.json")).toString());
					expect(fs.readFileSync(path.join(destDir, "script/aez_bundle_main.js")).toString())
						.not.toBe(fs.readFileSync(path.join(es6GameParameter.source, "script/aez_bundle_main.js")).toString());
					done();
				}, done.fail);
		});
		it("does not rewrite aez_bundle_main.js, even if aez_bundle_main script-asset already exists as not entry-point", (done) => {
			const es6GameParameter = {
				source: path.resolve(__dirname, "..", "fixtures", "simple_game_with_aez_bundle_main2"),
				dest: destDir,
				bundle: true
			};
			convertGame(es6GameParameter)
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
						.not.toBe(fs.readFileSync(path.join(es6GameParameter.source, "game.json")).toString());
					done();
				}, done.fail);
		});
		it("does not rewrite aez_bundle_main-asset, even if same name asset already exists as not script-asset", (done) => {
			const es6GameParameter = {
				source: path.resolve(__dirname, "..", "fixtures", "simple_game_with_aez_bundle_main3"),
				dest: destDir,
				bundle: true
			};
			convertGame(es6GameParameter)
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
					expect(gameJson.assets["aez_bundle_main0"].path).toBe("script/aez_bundle_main0.js");
					expect(gameJson.assets["aez_bundle_main0"].type).toBe("script");
					expect(gameJson.assets["aez_bundle_main"].path).toBe("image/akashic-cli.png");
					expect(gameJson.assets["aez_bundle_main"].type).toBe("image");
					done();
				}, done.fail);
		});
		it("rewrite mainScene-asset, even if main is not included in game.json", (done) => {
			const es6GameParameter = {
				source: path.resolve(__dirname, "..", "fixtures", "simple_game_with_main_scene"),
				dest: destDir,
				bundle: true
			};
			convertGame(es6GameParameter)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/mainScene.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/mainScene0.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.readFileSync(path.join(destDir, "script/mainScene.js")).toString())
						.toBe(fs.readFileSync(path.join(es6GameParameter.source, "script/mainScene.js")).toString());
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets["mainScene"].path).toBe("script/mainScene0.js");
					expect(gameJson.assets["mainScene"].type).toBe("script");
					expect(gameJson.assets["mainScene"].global).toBe(true);
					expect(gameJson.assets["notEntryPoint"].path).toBe("script/mainScene.js");
					done();
				}, done.fail);
		});
	});
});
