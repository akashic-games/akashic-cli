import * as path from "path";
import * as fs from "fs";
import * as cmn from "@akashic/akashic-cli-commons";
import * as mockfs from "mock-fs";
import { promiseScanAsset, scanAsset, scanNodeModules } from "../../lib/scan";
import * as conf from "../../lib/Configuration";
import { MockPromisedNpm } from "./helpers/MockPromisedNpm";

describe("scan", function () {
	var nullLogger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
	var DUMMY_OGG_DATA2 = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy2.ogg"));

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

			var nullNpm: cmn.PromisedNpm = new MockPromisedNpm({
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
