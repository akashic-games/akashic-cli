import * as path from "path";
import * as fs from "fs";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { PromisedNpm } from "@akashic/akashic-cli-commons/lib/PromisedNpm";
import * as mockfs from "mock-fs";
import { promiseScanAsset, scanAsset, scanNodeModules } from "../../lib/scan";
import { MockPromisedNpm } from "./helpers/MockPromisedNpm";

describe("scan", function () {
	var nullLogger = new ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
	var DUMMY_OGG_DATA2 = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy2.ogg"));
	const DUMMY_1x1_PNG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy1x1.png"));

	afterEach(() => {
		mockfs.restore();
	});

	describe("scanAsset()", function () {
		var gamejson: any = {
			width: 320,
			height: 34,
			fps: 30,
			assets: {}
		};
		var mockFsContent: any = {
			"game": {
				"game.json": JSON.stringify(gamejson),
				"text": {
					"foo": {
						"$.txt": "dummy",
					},
				},
				"audio": {
					"foo": {
						"_.ogg": DUMMY_OGG_DATA2,
					},
				},
				"script": {
					"foo": {
						"_1.js": "var x = 1;",
					},
				},
			}
		};

		it("scan assets", function (done: any) {
			mockfs(mockFsContent);
			Promise.resolve()
				.then(() => promiseScanAsset({ cwd: "./game", target: "text", logger: nullLogger }))
				.then(() => promiseScanAsset({ cwd: "./game", target: "audio", logger: nullLogger }))
				.then(() => {
					var conf = JSON.parse(fs.readFileSync("./game/game.json").toString());
					expect(conf.assets["$"]).toEqual({ type: "text", path: "text/foo/$.txt" });
					expect(conf.assets["_"]).toEqual({ type: "audio", path: "audio/foo/_", systemId: "sound", duration: 8000 });
					expect(conf.assets["_1"]).toBe(undefined);
					expect(fs.existsSync("./game/akashic-lib.json")).toBe(false)
					done();
				});
		});

		it("scan all assets by default", function (done: any) {
			mockfs(mockFsContent);
			scanAsset({ cwd: "./game", logger: nullLogger }, (err: any) => {
				expect(!!err).toBe(false);
				var conf = JSON.parse(fs.readFileSync("./game/game.json").toString());
				expect(conf.assets["$"]).toEqual({ type: "text", path: "text/foo/$.txt" });
				expect(conf.assets["_"]).toEqual({ type: "audio", path: "audio/foo/_", systemId: "sound", duration: 8000 });
				expect(conf.assets["_1"]).toEqual({ type: "script", path: "script/foo/_1.js", global: true });
				done();
			});
		});

		it("scan asset ids from these path", function (done: any) {
			mockfs(mockFsContent);
			scanAsset({ cwd: "./game", logger: nullLogger, resolveAssetIdsFromPath: true }, (err: any) => {
				expect(!!err).toBe(false);
				var conf = JSON.parse(fs.readFileSync("./game/game.json").toString());
				expect(conf.assets["text/foo/$"]).toEqual({ type: "text", path: "text/foo/$.txt" });
				expect(conf.assets["audio/foo/_"]).toEqual({ type: "audio", path: "audio/foo/_", systemId: "sound", duration: 8000 });
				expect(conf.assets["script/foo/_1"]).toEqual({ type: "script", path: "script/foo/_1.js", global: true });
				done();
			});
		});

		it("rejects unknown target", function (done: any) {
			mockfs(mockFsContent);
			Promise.resolve()
				.then(() => promiseScanAsset({ cwd: "./game", target: "INVALID_TARGET", logger: nullLogger }))
				.then(done.fail, (err: any) => {
					expect(!!err).toBe(true);
					expect(path.relative("./", process.cwd())).toBe("");
					done();
				});
		});
	});

	describe("scanAsset() - with akashic-lib.json", () => {
		const mockFsContent = {
			"dir": {
				"akashic-lib.json": JSON.stringify({}),
				"assets": {
					"text": {
						"foo": {
							"$.txt": "dummy",
						},
					},
					"image": {
						"foo": {
							"_$.png": DUMMY_1x1_PNG_DATA
						}
					},
					"audio": {
						"foo": {
							"_.ogg": DUMMY_OGG_DATA2,
						},
					},
					"script": {
						"foo": {
							"_1.js": "var x = 1;",
						},
					},
				}
			}
		};

		it("scan assets", async () => {
			mockfs(mockFsContent);

			await promiseScanAsset({
				cwd: "./dir",
				target: "all",
				assetScanDirectoryTable: {
					image: ["assets/image"],
					audio: ["assets/audio"]
				},
				logger: nullLogger
			});
			let conf = JSON.parse(fs.readFileSync("./dir/akashic-lib.json").toString());

			// NOTE: アセットのスキャン順は仕様としては明記されていない。
			expect(conf.assetList[0]).toEqual({
				type: "audio",
				path: "assets/audio/foo/_",
				systemId: "sound",
				duration: 8000
			});
			expect(conf.assetList[1]).toEqual({
				type: "image",
				path: "assets/image/foo/_$.png",
				width: 1,
				height: 1
			});

			await promiseScanAsset({
				cwd: "./dir",
				target: "image",
				assetScanDirectoryTable: {
					image: ["not_exists"]
				},
				logger: nullLogger
			});
			conf = JSON.parse(fs.readFileSync("./dir/akashic-lib.json").toString());

			expect(conf.assetList).toEqual([
				{
					type: "audio",
					path: "assets/audio/foo/_",
					systemId: "sound",
					duration: 8000
				}
			]);
		});
	});

	describe("scanNodeModules()", function () {
		it("scan globalScripts ", function (done) {
			var mockFsContent: any = {
				"node_modules": {
					"dummy": {
						"package.json": JSON.stringify({
							name: "dummy",
							version: "0.0.0",
							main: "main.js",
							dependencies: { "dummyChild": "*" }
						}),
						"main.js": [
							"require('./foo');",
							"require('dummyChild');",
						].join("\n"),
						"foo.js": "module.exports = 1;",
						"node_modules": {
							"dummyChild": {
								"index.js": "module.exports = 'dummyChild';"
							}
						}
					},
					"dummy2": {
						"index.js": "require('./sub')",
						"sub.js": "",
					}
				}
			};
			mockfs(mockFsContent);

			var nullNpm: PromisedNpm = new MockPromisedNpm({
				expectDependencies: { "dummy": {}, "dummy2": {} }
			});
			scanNodeModules({ cwd: "./", logger: nullLogger, debugNpm: nullNpm }, (err: any) => {
				expect(!!err).toBe(false);
				var gamejson = JSON.parse(fs.readFileSync("./game.json").toString());
				var globalScripts = gamejson.globalScripts;
				var moduleMainScripts = gamejson.moduleMainScripts;
				expect(globalScripts.length).toBe(5);
				var expectedPaths = [
					"node_modules/dummy/main.js",
					"node_modules/dummy/foo.js",
					"node_modules/dummy/node_modules/dummyChild/index.js",
					"node_modules/dummy2/index.js",
					"node_modules/dummy2/sub.js"
				];
				expectedPaths.forEach((expectedPath) => {
					expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
				});
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/main.js"
				});
				done();
			});
		});
	});
});