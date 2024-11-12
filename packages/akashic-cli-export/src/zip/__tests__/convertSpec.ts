import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";
import { vi } from "vitest";
import * as fsx from "fs-extra";
import mockfs from "mock-fs";
import { validateGameJson } from "../../utils.js";
import type { ConvertGameParameterObject } from "../convert.js";
import {
	bundleScripts,
	convertGame,
	validateGameJsonForNicolive
} from "../convert.js";
import { LICENSE_TEXT_PREFIX } from "../licenseUtil.js";

const require = createRequire(import.meta.url);
const fixturesDir = path.resolve(__dirname, "..", "..", "__tests__", "fixtures");

describe("convert", () => {

	afterEach(() => {
		mockfs.restore();
	});

	describe("bundleScripts", () => {
		it("bundles scripts", async () => {
			const result = await bundleScripts(
				require("../../__tests__/fixtures/simple_game/game.json").main,
				path.resolve(fixturesDir, "simple_game")
			);

			// バンドル時に rollup の plugin が独自の js ファイルを含めるので、toEqual() は利用せず個々にファイルを確認
			expect(result.filePaths.includes("script/bar.js")).toBeTruthy();
			expect(result.filePaths.includes("script/foo.js")).toBeTruthy();
			expect(result.filePaths.includes("text/test.json")).toBeTruthy();
			expect(result.filePaths.includes("script/main.js")).toBeTruthy();

			// bundle結果の内容を確認するのは難しいので、簡易的に実行結果を確認しておく
			const f = new Function("module", "exports", result.bundle);
			const m = { exports: {} };
			f(m, m.exports);

			expect(typeof m.exports).toBe("function");
			expect((m.exports as Function)()).toEqual({ x: 200, y: 12 });
		});
	});

	describe("convertGame", () => {
		const destDir = path.resolve(fixturesDir, "output");
		const consoleSpy = vi.spyOn(global.console, "warn");
		afterEach(() => {
			fsx.removeSync(destDir);
			consoleSpy.mockClear();
		});
		afterAll(() => {
			consoleSpy.mockRestore();
		});

		it("can not convert game if script that is not written with ES5 syntax", async () => {
			let warningMessage = "";
			const param = {
				source: path.resolve(fixturesDir, "simple_game_es6"),
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
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(destDir)).toBe(true);
					const expected = "Non-ES5 syntax found.\n"
						+ "script/main.js(1:1): Parsing error: The keyword 'const' is reserved\n"
						+ "script/foo.js(1:1): Parsing error: The keyword 'const' is reserved";
					expect(warningMessage).toBe(expected);
				});
		});

		it("can downpile script to ES5", async () => {
			let warningMessage = "";
			const param = {
				source: path.resolve(fixturesDir, "simple_game_es6"),
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
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(destDir)).toBe(true);
					expect(warningMessage).toBe("");
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy();
				});
		});

		it("copy all files in target directory", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_using_external"),
				dest: destDir
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/unrefered.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/ignore.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeTruthy();
				});
		});

		it("copy only necessary files in target directory when strip mode", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_using_external"),
				dest: destDir,
				strip: true
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/ignore.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/unrefered.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeTruthy();
				});
		});

		it("copy bundled-script in target directory when bundle mode", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_using_external"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			};
			return convertGame(param)
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
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeTruthy();
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.main).toBe("./script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.path).toBe("script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.type).toBe("script");
					expect(gameJson.assets.aez_bundle_main.global).toBe(true);
					expect(gameJson.assets.ignore2.global).toBeTruthy(); // omitEmptyJs があった時は偽になりえたので念のため確認
				});
		});

		it("does not copy output directory, even if it exists in source directory", async () => {
			const souceDirectory = path.resolve(fixturesDir, "simple_game_using_external");
			const outputDirectory = path.join(souceDirectory, "output");
			const param = {
				source: souceDirectory,
				dest: outputDirectory,
				bundle: true,
				omitUnbundledJs: true
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(outputDirectory, "script/unrefered.js"))).toBe(false);
					expect(fs.existsSync(path.join(outputDirectory, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(outputDirectory, "script/ignore.js"))).toBe(false);
					expect(fs.existsSync(path.join(outputDirectory, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(outputDirectory, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(outputDirectory, "output"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy();
					expect(fs.readFileSync(path.join(outputDirectory, "game.json")).toString())
						.not.toBe(fs.readFileSync(path.join(param.source, "game.json")).toString());
					fsx.removeSync(outputDirectory);
				});
		});

		it("copy only necessary files and bundled-script in target directory when strip and bundle mode", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_using_external"),
				dest: destDir,
				strip: true,
				bundle: true,
				omitUnbundledJs: true
			};
			return convertGame(param)
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
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeTruthy();
				});
		});

		it("includes empty .js (regression test for omitEmptyJs, a removed option)", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_using_external"),
				dest: destDir
			};
			return convertGame(param)
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
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeTruthy();
				});
		});

		it("convert non UTF-8 content", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_using_non_utf8"),
				dest: destDir
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "assets/euc-jp.txt"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "text/sjis.txt"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "text/utf8.txt"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy();

					// UTF8 として読み込めることを確認
					const main = fs.readFileSync(path.join(destDir, "script/main.js"), { encoding: "utf-8" }).toString();
					// convert が出力する改行コードに export コマンドは関与しないため、 LF に変換してテストを実行する
					expect(main.replace(/\r?\n/g, "\n")).toBe([
						"var foo = require(\"./foo\");",
						"",
						"module.exports = function () {",
						"	return {",
						"		y: foo()",
						"	};",
						"}",
						""
					].join("\n"));
					const foo = fs.readFileSync(path.join(destDir, "script/foo.js"), { encoding: "utf-8" }).toString();
					expect(foo.replace(/\r?\n/g, "\n")).toBe([
						"module.exports = function () {",
						"	return \"このスクリプトファイルは Shift-JIS です。\";",
						"};",
						""
					].join("\n"));
					const eucjp = fs.readFileSync(path.join(destDir, "assets/euc-jp.txt"), { encoding: "utf-8" }).toString();
					expect(eucjp).toBe("このテキストファイルは EUC-JP です");
					const sjis = fs.readFileSync(path.join(destDir, "text/sjis.txt"), { encoding: "utf-8" }).toString();
					expect(sjis).toBe("このテキストファイルは Shift-JIS です");
					const utf8 = fs.readFileSync(path.join(destDir, "text/utf8.txt"), { encoding: "utf-8" }).toString();
					expect(utf8).toBe("このテキストファイルは UTF8 です");
				});
		});

		it("rewrite aez_bundle_main.js, even if aez_bundle_main script-asset already exists as entry-point", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_with_aez_bundle_main"),
				dest: destDir,
				bundle: true
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy();
					expect(fs.readFileSync(path.join(destDir, "game.json")).toString())
						.not.toBe(fs.readFileSync(path.join(param.source, "game.json")).toString());
					expect(fs.readFileSync(path.join(destDir, "script/aez_bundle_main.js")).toString())
						.not.toBe(fs.readFileSync(path.join(param.source, "script/aez_bundle_main.js")).toString());
				});
		});

		it("does not rewrite aez_bundle_main.js, even if aez_bundle_main script-asset already exists as not entry-point", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_with_aez_bundle_main2"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			};
			return convertGame(param)
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
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy();
				});
		});

		it("does not rewrite aez_bundle_main-asset, even if same name asset already exists as not script-asset", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_with_aez_bundle_main3"),
				dest: destDir,
				bundle: true
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(false);
					// script/aez_bundle_main.jsに被らない名前のスクリプトファイルが生成される
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main0.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "image/akashic-cli.png"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy();
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets.aez_bundle_main0.path).toBe("script/aez_bundle_main0.js");
					expect(gameJson.assets.aez_bundle_main0.type).toBe("script");
					expect(gameJson.assets.aez_bundle_main.path).toBe("image/akashic-cli.png");
					expect(gameJson.assets.aez_bundle_main.type).toBe("image");
					expect(gameJson.assets.aez_bundle_main.hint).not.toBeDefined();
				});
		});

		it("rewrite mainScene-asset, even if main is not included in game.json", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_with_main_scene"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/mainScene.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/mainScene0.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy();
					expect(fs.readFileSync(path.join(destDir, "script/mainScene.js")).toString())
						.toBe(fs.readFileSync(path.join(param.source, "script/mainScene.js")).toString());
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets.mainScene.path).toBe("script/mainScene0.js");
					expect(gameJson.assets.mainScene.type).toBe("script");
					expect(gameJson.assets.mainScene.global).toBe(true);
					expect(gameJson.assets.notEntryPoint.path).toBe("script/mainScene.js");
				});
		});

		it("Unnecessary files are deleted by bundle", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_with_aez_bundle_main4"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: true
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy();

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
					/* eslint-disable max-len */
					expect(consoleSpy).toHaveBeenCalledWith("excluded node_modules/@hoge/testmodule/lib/ModuleB.js due to unreachable/unhandled.");
					expect(consoleSpy).toHaveBeenCalledWith("excluded node_modules/@hoge/testmodule/lib/ModuleC.js due to unreachable/unhandled.");
					expect(consoleSpy).toHaveBeenCalledWith("excluded node_modules/@hoge/testmodule/lib/index.js due to unreachable/unhandled.");
					expect(consoleSpy).toHaveBeenCalledWith("excluded script/bar.js due to unreachable/unhandled.");
					/* eslint-enable max-len */
				});
		});

		it("Unnecessary files are also saved with bundle", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_with_aez_bundle_main4"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy(); // node_modules に LICENSE がないので false

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
				});
		});

		it("Add untainted: true to gamejson's image asset when targetService is nicolive", async () => {
			const param: ConvertGameParameterObject = {
				source: path.resolve(fixturesDir, "simple_game_with_aez_bundle_main3"),
				dest: destDir,
				targetService: "nicolive"
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(true);

					expect(fs.existsSync(path.join(destDir, "image/akashic-cli.png"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy();
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					const imgAsset = gameJson.assets.aez_bundle_main;
					expect(imgAsset.type).toBe("image");
					expect(imgAsset.hint.untainted).toBeTruthy();
				});
		});

		it("No change in the gamejson image asset gamejson's image asset when targetService is none", async () => {
			const param: ConvertGameParameterObject = {
				source: path.resolve(fixturesDir, "simple_game_with_aez_bundle_main3"),
				dest: destDir,
				targetService: "none"
			};
			return convertGame(param)
				.then(() => {
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					const imgAsset = gameJson.assets.aez_bundle_main;
					expect(imgAsset.type).toBe("image");
					expect(imgAsset.hint).not.toBeDefined();
				});
		});

		it("Operation plugin scripts are saved even if they are depended by bundled file", async () => {
			const param: ConvertGameParameterObject = {
				source: path.resolve(fixturesDir, "simple_game_with_operation_plugins"),
				dest: destDir,
				bundle: true,
				targetService: "nicolive",
				omitUnbundledJs: true
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy(); // node_modules に LICENSE がないので false
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
				});
		});

		it("nicolive option, can add akashic-runtime to gamejson.", async () => {
			const param = {
				source: path.resolve(fixturesDir, "sample_game_v3"),
				dest: destDir,
				bundle: true,
				nicolive: true,
				resolveAkashicRuntime: true
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_bundle_main.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeFalsy();
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets.aez_bundle_main.path).toBe("script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.type).toBe("script");
					expect(gameJson.assets.aez_bundle_main.global).toBe(true);
					expect(gameJson.environment["sandbox-runtime"]).toBe("3");
					expect(gameJson.environment.external).toEqual({ send: "0" });
					expect(gameJson.environment["akashic-runtime"].version).toMatch(/^~3\.\d\.\d+(-.*)?$/);
					expect(gameJson.environment["akashic-runtime"].flavor).toBe("-canvas");
				});
		});

		it("nicolive option, Do not add akashic-runtime if it already exists in game.json.", async () => {
			const param = {
				source: path.resolve(fixturesDir, "sample_game_with_akashic_runtime"),
				dest: destDir,
				bundle: true,
				nicolive: true,
				resolveAkashicRuntime: true
			};
			return convertGame(param)
				.then(() => {
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment["akashic-runtime"].version).toBe("~1.0.9-beta");
					expect(gameJson.environment["akashic-runtime"].flavor).toBe(undefined);
					expect(gameJson.environment.nicolive.supportedModes.length).toBe(2);
					expect(gameJson.environment.nicolive.supportedModes).toContain("single");
					expect(gameJson.environment.nicolive.supportedModes).toContain("ranking");
				});
		});

		it("resolveAkashicRuntime option, Add Akashic runtime in game.json.", async () => {
			const param = {
				source: path.resolve(fixturesDir, "sample_game_v3"),
				dest: destDir,
				resolveAkashicRuntime: true

			};
			return convertGame(param)
				.then(() => {
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.environment["sandbox-runtime"]).toBe("3");
					expect(gameJson.environment["akashic-runtime"].version).toMatch(/^~3\.\d\.\d+(-.*)?$/);
					expect(gameJson.environment["akashic-runtime"].flavor).toBe("-canvas");
					expect(gameJson.environment.external).toEqual({ send: "0" });
				});
		});

		it("niconico option, replace to nicolive option.", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_using_niconico"),
				dest: destDir
			};
			return convertGame(param)
				.then(() => {
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.environment.nicolive.supportedModes.length).toBe(1);
					expect(gameJson.environment.nicolive.supportedModes).toContain("single");
					expect(gameJson.environment.niconico).toBeUndefined();
				});
		});

		it("thirdpary_license.txt by bundle", () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_using_external"),
				dest: destDir,
				bundle: true
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBeFalsy();
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBeTruthy()
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBeFalsy();
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeTruthy();

					const mainScript = fs.readFileSync(path.join(destDir, "script/aez_bundle_main.js")).toString().split("\n");
					expect(mainScript[0]).toBe(LICENSE_TEXT_PREFIX.replace(/\r?\n/g, ""));

					const license = fs.readFileSync(path.join(destDir, "thirdpary_license.txt")).toString().split(/\r?\n/g);
					console.log("@@@@@", license);
					expect(license).toEqual(
						[
							"# external",
							"",
							"The MIT License (MIT)",
							"",
							"Copyright (c) 2024 hogehoge",
							"",
						]	
					);
				});
		});

		it("thirdpary_license.txt by no bundle", () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_using_external"),
				dest: destDir,
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBeTruthy()
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBeTruthy()
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBeTruthy()
					expect(fs.existsSync(path.join(destDir, "thirdpary_license.txt"))).toBeTruthy()

					const mainScript = fs.readFileSync(path.join(destDir, "script/main.js")).toString().split("\n");
					expect(mainScript[0]).toBe(LICENSE_TEXT_PREFIX.replace(/\r?\n/g, ""));

					const license = fs.readFileSync(path.join(destDir, "thirdpary_license.txt")).toString().split(/\r?\n/g);
					expect(license).toEqual(
						[
							"# external",
							"",
							"The MIT License (MIT)",
							"",
							"Copyright (c) 2024 hogehoge",
							"",
						]	
					);
				});
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

describe("validateGameJson", function () {
	const gamejson: any = {
		moduleMainScripts: {
			"@akashic/akashic-engine": "node_modules/@akashic/akashic-engine/index.js"
		}
	};
	it("throw Error when specified gamejson include @akashic/akashic-engine", function () {
		expect(() => validateGameJson(gamejson)).toThrow();
	});
});
