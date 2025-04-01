import * as fs from "fs";
import { createRequire } from "module";
import * as path from "path";
import vm from "vm";
import mockfs from "mock-fs";
import { vi } from "vitest";
import { validateGameJson } from "../../utils.js";
import type { ConvertGameParameterObject } from "../convert.js";
import { bundleScripts, convertGame, validateGameJsonForNicolive } from "../convert.js";
import { LICENSE_TEXT_PREFIX } from "../../licenseUtil.js";

const require = createRequire(import.meta.url);
const fixturesDir = path.resolve(__dirname, "..", "..", "__tests__", "fixtures");

function executeCommonJS(code: string): any {
	const sandbox: any = { module: { exports: {} } };
	vm.createContext(sandbox);
	vm.runInContext(code, sandbox);
	return sandbox.module.exports;
}

function compareAssetBundleFunction(scriptPath: string, func: Function): void {
	const raw = fs.readFileSync(scriptPath, { encoding: "utf-8" });
	const wrappedFuncString = [
		"rv => {",
		"'use strict';",
		[
			"const module = rv.module;",
			"const exports = module.exports;",
			"const require = module.require;",
			"const __dirname = rv.dirname;",
			"const __filename = rv.filename;",
		].join(""),
		`${raw}`,
		"return module.exports;",
		"}"
	].join("\n");

	expect(wrappedFuncString).toBe(func.toString());
}

describe("convert", () => {

	afterEach(() => {
		mockfs.restore();
	});

	describe("bundleScripts", () => {
		it("bundles scripts", async () => {
			const result = await bundleScripts(
				require("../../__tests__/fixtures/simple_game/game.json"),
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
			if(fs.existsSync(destDir))
				fs.rmSync(destDir, { recursive: true });
			consoleSpy.mockClear();
		});
		afterAll(() => {
			consoleSpy.mockRestore();
		});

		it("can downpile script", async () => {
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
					const script = fs.readFileSync(path.join(destDir, "script/main.js"), "utf8");
					expect(script).toBeDefined();
					expect(/\(\) =>/.test(script)).toBeTruthy(); // ES2015 のアロー関数はそのまま
					expect(/\*\*/.test(script)).toBeFalsy(); // ES2016 のべき乗演算子は Math.pow()に変換される
					expect(/Math\.pow/.test(script)).toBeTruthy();
					expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy();
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeTruthy();
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeTruthy();
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeTruthy();
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.main).toBe("./script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.path).toBe("script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.type).toBe("script");
					expect(gameJson.assets.aez_bundle_main.global).toBe(true);
					expect(gameJson.assets.ignore2.global).toBeTruthy(); // omitEmptyJs があった時は偽になりえたので念のため確認
				});
		});

		it("does not copy output directory, even if it exists in source directory", async () => {
			const sourceDirectory = path.resolve(fixturesDir, "simple_game_using_external");
			const outputDirectory = path.join(sourceDirectory, "output");
			const param = {
				source: sourceDirectory,
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy();
					expect(fs.readFileSync(path.join(outputDirectory, "game.json")).toString())
						.not.toBe(fs.readFileSync(path.join(param.source, "game.json")).toString());
				})
				.finally(() => fs.rmSync(outputDirectory, { recursive: true }));
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeTruthy();
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeTruthy();
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy();

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
					].join("\n"));
					const foo = fs.readFileSync(path.join(destDir, "script/foo.js"), { encoding: "utf-8" }).toString();
					expect(foo.replace(/\r?\n/g, "\n")).toBe([
						"module.exports = function () {",
						"	return \"このスクリプトファイルは Shift-JIS です。\";",
						"};",
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy();
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy();
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy();
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy();
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy();

					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets.aez_bundle_main.path).toBe("script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.type).toBe("script");
					// バンドルされた、もしくは利用されていない不要なファイルはgamejsonから取り除かれる
					expect(gameJson.assets.main).toBeUndefined();
					expect(gameJson.assets.foo).toBeUndefined();
					expect(gameJson.assets.bar).toBeUndefined();
					expect(gameJson.assets.test).toBeUndefined();

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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy(); // node_modules に LICENSE がないので false

					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets.aez_bundle_main.path).toBe("script/aez_bundle_main.js");
					expect(gameJson.assets.aez_bundle_main.type).toBe("script");
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
					expect(gameJson.assets.test).toBeUndefined();
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy();
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
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy(); // node_modules に LICENSE がないので false
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

		it("nicolive option, can add akashic-runtime to game.json.", async () => {
			const param = {
				source: path.resolve(fixturesDir, "sample_game_v3"),
				dest: destDir,
				bundle: true,
				nicolive: true,
				resolveAkashicRuntime: true
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "script/aez_asset_bundle.js"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeFalsy();
					const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
					expect(gameJson.assets.aez_asset_bundle.path).toBe("script/aez_asset_bundle.js");
					expect(gameJson.assets.aez_asset_bundle.type).toBe("script");
					expect(gameJson.assets.aez_asset_bundle.global).toBe(true);
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

		it("library_license.txt by bundle", () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_using_external"),
				dest: destDir,
				bundle: true
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBeFalsy();
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBeTruthy();
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBeFalsy();
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeTruthy();

					const mainScript = fs.readFileSync(path.join(destDir, "script/aez_bundle_main.js")).toString().split("\n");
					expect(mainScript[0]).toBe(LICENSE_TEXT_PREFIX.replace(/\r?\n/g, ""));
				});
		});

		it("library_license.txt by no bundle", () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_using_external"),
				dest: destDir,
			};
			return convertGame(param)
				.then(() => {
					expect(fs.existsSync(path.join(destDir, "node_modules/external/index.js"))).toBeTruthy();
					expect(fs.existsSync(path.join(destDir, "node_modules/external/package.json"))).toBeTruthy();
					expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBeTruthy();
					expect(fs.existsSync(path.join(destDir, "library_license.txt"))).toBeTruthy();

					const mainScript = fs.readFileSync(path.join(destDir, "script/main.js")).toString().split("\n");
					expect(mainScript[0]).toBe(LICENSE_TEXT_PREFIX.replace(/\r?\n/g, ""));
				});
		});
	});
});

describe("convert - v3", () => {
	const destDir = path.resolve(fixturesDir, "output");
	const consoleSpy = vi.spyOn(global.console, "warn");

	afterEach(() => {
		mockfs.restore();
	});

	describe("convert()", () => {
		afterEach(() => {
			if (fs.existsSync(destDir))
				fs.rmSync(destDir, { recursive: true });
			consoleSpy.mockClear();
		});
		afterAll(() => {
			consoleSpy.mockRestore();
		});

		it("bundles scripts", async () => {
			const result = await bundleScripts(
				require("../../__tests__/fixtures/simple_game_v3/game.json"),
				path.resolve(fixturesDir, "simple_game"),
			);

			expect(result.filePaths).toEqual([
				"script/main.js",
				"script/bar.js",
				"script/foo.js",
				"text/test.json",
			]);
			expect(result.bundle).toBeTypeOf("string");

			const assetBundle = executeCommonJS(result.bundle);

			expect(assetBundle.assets).toBeTypeOf("object");
			expect(assetBundle.assets.main.type).toBe("script");
			expect(assetBundle.assets.main.path).toBe("script/main.js");
			expect(assetBundle.assets.main.global).toBe(true);
			expect(assetBundle.assets.main.execute).toBeTypeOf("function");
			compareAssetBundleFunction(
				path.resolve(fixturesDir, "simple_game", "script/main.js"),
				assetBundle.assets.main.execute
			);

			expect(assetBundle.assets).toBeTypeOf("object");
			expect(assetBundle.assets.foo.type).toBe("script");
			expect(assetBundle.assets.foo.path).toBe("script/foo.js");
			expect(assetBundle.assets.foo.global).toBe(true);
			expect(assetBundle.assets.foo.execute).toBeTypeOf("function");
			compareAssetBundleFunction(
				path.resolve(fixturesDir, "simple_game", "script/foo.js"),
				assetBundle.assets.foo.execute
			);

			expect(assetBundle.assets).toBeTypeOf("object");
			expect(assetBundle.assets.bar.type).toBe("script");
			expect(assetBundle.assets.bar.path).toBe("script/bar.js");
			expect(assetBundle.assets.bar.global).toBe(true);
			expect(assetBundle.assets.bar.execute).toBeTypeOf("function");
			compareAssetBundleFunction(
				path.resolve(fixturesDir, "simple_game", "script/bar.js"),
				assetBundle.assets.bar.execute
			);

			expect(assetBundle.assets).toBeTypeOf("object");
			expect(assetBundle.assets.test.type).toBe("text");
			expect(assetBundle.assets.test.path).toBe("text/test.json");
			expect(assetBundle.assets.test.global).toBe(true);
			expect(JSON.parse(assetBundle.assets.test.data)).toEqual({ value: 12 });
		});
	});

	describe("convertGame()", () => {
		beforeEach(() => {
			if (fs.existsSync(destDir))
				fs.rmSync(destDir, { recursive: true });
		});
		afterEach(() => {
			fs.rmSync(destDir, { recursive: true });
			consoleSpy.mockClear();
		});
		afterAll(() => {
			consoleSpy.mockRestore();
		});

		it("can convert v3 game", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_v3"),
				dest: destDir,
				bundle: true
			};
			await convertGame(param);

			expect(fs.existsSync(path.join(destDir, "script/aez_asset_bundle.js"))).toBe(true);
			expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
			expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
			expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);
			expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
			expect(fs.existsSync(path.join(destDir, "package.json"))).toBe(true);
			expect(
				fs.readFileSync(path.join(destDir, "game.json")).toString()
			).not.toBe(
				fs.readFileSync(path.join(param.source, "game.json")).toString()
			);
		});

		it("should rename the aez_asset_bundle if the filename already exists as an entry-point.", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_with_aez_asset_bundle"),
				dest: destDir,
				bundle: true
			};
			await convertGame(param);

			// もともと存在した aez_asset_bundle.js を含むスクリプトアセット/テキストアセットは消える
			expect(fs.existsSync(path.join(destDir, "script/aez_asset_bundle.js"))).toBe(false);
			expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
			expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
			expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);

			// script/aez_asset_bundle.jsに被らない名前のスクリプトファイルが生成される
			expect(fs.existsSync(path.join(destDir, "script/aez_asset_bundle0.js"))).toBe(true);


			// それ以外のアセットは残る
			expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);
			expect(fs.readFileSync(path.join(destDir, "game.json")).toString())
				.not.toBe(fs.readFileSync(path.join(param.source, "game.json")).toString());
		});

		it("should rename the aez_asset_bundle if the filename already exists as another asset.", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_with_aez_asset_bundle2"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: false
			};
			await convertGame(param);

			// aez_asset_bundle に被らない名前のスクリプトファイルが生成される
			expect(fs.existsSync(path.join(destDir, "script/aez_asset_bundle0.js"))).toBe(true);

			expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
			expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
			expect(fs.existsSync(path.join(destDir, "script/main.js"))).toBe(false);
			expect(fs.existsSync(path.join(destDir, "image/akashic-cli.png"))).toBe(true);
			expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);

			const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
			expect(gameJson.assets.aez_asset_bundle0.path).toBe("script/aez_asset_bundle0.js");
			expect(gameJson.assets.aez_asset_bundle0.type).toBe("script");
			expect(gameJson.assets.aez_asset_bundle.path).toBe("image/akashic-cli.png");
			expect(gameJson.assets.aez_asset_bundle.type).toBe("image");
			expect(gameJson.assets.aez_asset_bundle.hint).not.toBeDefined();
		});

		it("should convert the game using external scripts", async () => {
			const param = {
				source: path.resolve(fixturesDir, "simple_game_with_aez_asset_bundle3"),
				dest: destDir,
				bundle: true,
				omitUnbundledJs: true
			};
			await convertGame(param);

			expect(fs.existsSync(path.join(destDir, "script/aez_asset_bundle.js"))).toBe(true);

			// もともと存在した aez_asset_bundle.js を含むスクリプトアセット/テキストアセットは消える
			expect(fs.existsSync(path.join(destDir, "script/bar.js"))).toBe(false);
			expect(fs.existsSync(path.join(destDir, "script/foo.js"))).toBe(false);
			expect(fs.existsSync(path.join(destDir, "text/test.json"))).toBe(false);

			// それ以外のアセットは残る
			expect(fs.existsSync(path.join(destDir, "game.json"))).toBe(true);

			const gameJson = JSON.parse(fs.readFileSync(path.join(destDir, "game.json")).toString());
			expect(gameJson.assets.aez_asset_bundle.path).toBe("script/aez_asset_bundle.js");
			expect(gameJson.assets.aez_asset_bundle.type).toBe("script");

			// バンドルされたファイルは game.json から取り除かれる
			expect(gameJson.assets.main).toBeUndefined();
			expect(gameJson.assets.foo).toBeUndefined();
			expect(gameJson.assets.bar).toBeUndefined();
			expect(gameJson.globalScripts).not.toContain("node_modules/@hoge/testmodule/lib/ModuleA.js");
			expect(gameJson.globalScripts).not.toContain("node_modules/@hoge/testmodule/lib/ModuleB.js");
			expect(gameJson.globalScripts).not.toContain("node_modules/@hoge/testmodule/lib/ModuleC.js");
			expect(gameJson.globalScripts).not.toContain("node_modules/@hoge/testmodule/lib/index.js");
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
