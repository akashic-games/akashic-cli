import * as fs from "fs";
import * as path from "path";
import * as mockfs from "mock-fs";
import * as cmn from "@akashic/akashic-cli-commons";
import { promiseInstall } from "../../../lib/install/install";
import { workaroundMockFsExistsSync } from "../testUtils"; 

describe("install()", function () {
	workaroundMockFsExistsSync();

	afterEach(function () {
		mockfs.restore();
	});

	it("handles npm install failure", function (done) {
		mockfs({});
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		const dummyNpm = new cmn.PromisedNpm({});
		dummyNpm.install = function (names) { return Promise.reject("InstallFail:" + names); };
		Promise.resolve()
			.then(() => promiseInstall({ moduleNames: ["bar"], logger: logger, debugNpm: dummyNpm }))
			.then(() => done.fail())
			.catch((err) => {
				expect(err).toBe("InstallFail:bar");
			})
			.then(() => cmn.ConfigurationFile.read("./game.json", logger))
			.then((content) => {
				expect(content.globalScripts).toBeUndefined();
			})
			.then(done, done.fail);
	});

	it("handles npm link failure", function (done) {
		mockfs({});
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		const dummyNpm = new cmn.PromisedNpm({});
		dummyNpm.link = function (names) { return Promise.reject("LinkFail:" + names); };
		Promise.resolve()
			.then(() => promiseInstall({ moduleNames: ["bar"], link: true, logger: logger, debugNpm: dummyNpm }))
			.then(() => done.fail())
			.catch((err) => {
				expect(err).toBe("LinkFail:bar");
			})
			.then(() => cmn.ConfigurationFile.read("./game.json", logger))
			.then((content) => {
				expect(content.globalScripts).toBeUndefined();
			})
			.then(done, done.fail);
	});

	it("installs modules and update globalScripts", function (done) {
		let warnLogs: string[] = [];
		const logger: cmn.Logger = {
			warn: function(message) {
				warnLogs.push(message);
			},
			info: function(_message) {
				// do nothing
			},
			print: function(_message) {
				// do nothing
			},
			error: function(_message) {
				// do nothing
			},
		};

		let mockModules: any = {
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
						"main.js": "module.exports = 'dummyChild';",
						"package.json": JSON.stringify({
							name: "dummyChild",
							version: "0.0.0",
							main: "main.js"
						})
					}
				}
			},
			"dummy2": {
				"index.js": "require('./sub')",
				"sub.js": "",
			},
			"noOmitPackagejson": {
				"package.json": JSON.stringify({
					name: "noOmitPackagejson",
					version: "0.0.0",
					main: "main.js"
				}),
				"main.js": "module.exports = 1;"
			},
		};
		const mockFsContent: any = {
			"somedir": {
				"node_modules": {}
			}
		};

		jest.spyOn(cmn.Util, "requireResolve").mockImplementation((id: string, opts: { paths?: string[] | undefined }): string => {
			const pkgJsonPath = path.join(opts.paths[0], "package.json");
			const pkgData =  JSON.parse(fs.readFileSync(pkgJsonPath).toString("utf-8"));
			const mainScriptName = pkgData.main.split(".").pop() === "js" ? pkgData.main : pkgData.main + ".js";
			return path.join(path.resolve("."), path.dirname(pkgJsonPath), mainScriptName);
		});

		mockfs(mockFsContent);
		const dummyNpm = new cmn.PromisedNpm({});
		dummyNpm.install = function (names) {
			names = (names instanceof Array) ? names : [names];
			names.forEach(function (name) {
				const nameNoVer = cmn.Util.makeModuleNameNoVer(name);
				mockFsContent.somedir.node_modules[nameNoVer] = mockModules[nameNoVer];
			});

			mockfs(mockFsContent.somedir);
			return Promise.resolve();
		};

		Promise.resolve()
			.then(() => promiseInstall({ moduleNames: ["dummy"], cwd: "./somedir", logger: logger, debugNpm: dummyNpm }))
			.then(() => cmn.ConfigurationFile.read("./somedir/game.json", logger))
			.then((content) => {
				const globalScripts = content.globalScripts;
				expect(globalScripts instanceof Array).toBe(true);
				expect(globalScripts.length).toBe(3);
				expect(globalScripts.indexOf("node_modules/dummy/main.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/foo.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/node_modules/dummyChild/main.js")).not.toBe(-1);
				const moduleMainScripts = content.moduleMainScripts;
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/main.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js"
				});
				expect(warnLogs.length).toBe(1);
				expect(warnLogs[0]).toBe(
					"Newly added the moduleMainScripts property to game.json." +
					"This property, introduced by akashic-cli@>=1.12.2, is NOT supported by older versions of Akashic Engine." +
					"Please ensure that you are using akashic-engine@>=2.0.2, >=1.12.7."
				);
				warnLogs = []; // 初期化
			})
			.then(() => promiseInstall({ moduleNames: ["dummy2@1.0.1"], cwd: "./somedir", plugin: 12, logger: logger, debugNpm: dummyNpm }))
			.then(() => cmn.ConfigurationFile.read("./somedir/game.json", logger))
			.then((content) => {
				expect(content.operationPlugins).toEqual([
					{
						code: 12,
						script: "dummy2"
					}
				]);
				const globalScripts = content.globalScripts;
				expect(globalScripts.length).toBe(5);
				expect(globalScripts.indexOf("node_modules/dummy/main.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/foo.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/node_modules/dummyChild/main.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy2/index.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy2/sub.js")).not.toBe(-1);
				const moduleMainScripts = content.moduleMainScripts;
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/main.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js"
				});
				expect(content.moduleMainPaths).toBeUndefined();
				warnLogs = []; // 初期化
			})
			.then(() => promiseInstall({ moduleNames: ["noOmitPackagejson@0.0.0"], cwd: "./somedir", logger: logger, debugNpm: dummyNpm, noOmitPackagejson: true, useMmp: true }))
			.then(() => cmn.ConfigurationFile.read("./somedir/game.json", logger))
			.then((content) => {
				const globalScripts = content.globalScripts;

				expect(warnLogs.length).toBe(0);
				expect(globalScripts.indexOf("node_modules/noOmitPackagejson/main.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/noOmitPackagejson/package.json")).not.toBe(-1);
				const moduleMainScripts = content.moduleMainScripts;
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/main.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js",
					"noOmitPackagejson": "node_modules/noOmitPackagejson/main.js"
				});
				const moduleMainPaths = content.moduleMainPaths;
				expect(moduleMainPaths).toEqual({
					"node_modules/noOmitPackagejson/package.json": "node_modules/noOmitPackagejson/main.js"
				});
				warnLogs = []; // 初期化
			})
			.then(() => {
				// dummyモジュールの定義を書き換えて反映されるか確認する
				mockModules = {
					"dummy": {
						"package.json": JSON.stringify({
							name: "dummy",
							version: "2.0.0",
							main: "index2.js",
							dependencies: {}
						}),
						"index2.js": "require('./sub2')",
						"sub2.js": ""
					}
				};
			})
			.then(() => cmn.ConfigurationFile.read("./somedir/game.json", logger))
			.then((content) => {
				// 存在しないファイルをgame.jsonに指定
				const globalScripts = content.globalScripts;
				globalScripts.push("node_modules/foo/foo.js");
				cmn.ConfigurationFile.write(content, "./somedir/game.json", logger);
			})
			.then(() => promiseInstall({ moduleNames: ["dummy@1.0.1"], cwd: "./somedir", logger: logger, debugNpm: dummyNpm, useMmp: true }))
			.then(() => cmn.ConfigurationFile.read("./somedir/game.json", logger))
			.then((content) => {
				const globalScripts = content.globalScripts;

				expect(warnLogs.length).toBe(0);
				expect(globalScripts.indexOf("node_modules/dummy/main.js")).toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/foo.js")).toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/node_modules/dummyChild/main.js")).toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/index2.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/sub2.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/foo/foo.js")).toBe(-1);
				const moduleMainScripts = content.moduleMainScripts;
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/index2.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js",
					"noOmitPackagejson": "node_modules/noOmitPackagejson/main.js"
				});
				const moduleMainPaths = content.moduleMainPaths;
				expect(moduleMainPaths).toEqual({
					"node_modules/noOmitPackagejson/package.json": "node_modules/noOmitPackagejson/main.js",
					"node_modules/dummy/package.json": "node_modules/dummy/index2.js"
				});

			})
			.then(done, done.fail);
	});

	it("rejects plugin option for multiple module installing", function (done) {
		mockfs({});
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		Promise.resolve()
			.then(() => promiseInstall({ moduleNames: ["dummy@1.0.1", "anotherdummy"], cwd: ".", plugin: 10, logger: logger }))
			.then(() => done.fail())
			.catch ((_err) => done());
	});

	it("just performs npm install unless moduleNames given", function (done) {
		mockfs({});
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		let installCallCount = 0;
		const dummyNpm = new cmn.PromisedNpm({});
		dummyNpm.install = function (names) {
			++installCallCount;
			// npm install (引数なし) が呼ばれることを確認するため、引数があったらreject。
			return names ? Promise.reject() : Promise.resolve();
		};
		Promise.resolve()
			.then(() => promiseInstall({ cwd: ".", logger: logger, debugNpm: dummyNpm }))
			.then(() => {
				expect(installCallCount).toBe(1);
			})
			.then(done, done.fail);
	});

	it("should import assets from the akashic-lib.json", async () => {
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });

		const mockModules: any = {
			"ui-library": {
				lib: {
					"index.js": "module.exports = {};"
				},
				"package.json": JSON.stringify({
					name: "ui-library",
					version: "0.0.0",
					main: "lib/index.js"
				}),
				"akashic-lib.json": JSON.stringify({
					assetList: [
						{
							type: "image",
							path: "assets/images/player.png",
							width: 100,
							height: 120
						},
						{
							type: "image",
							path: "assets/images/enemy.png",
							width: 100,
							height: 120
						},
						{
							type: "audio",
							path: "assets/audios/se_1",
							systemId: "sound",
							duration: 1270
						}
					]
				})
			},
			"audio-library": {
				lib: {
					"index.js": "module.exports = {};"
				},
				"package.json": JSON.stringify({
					name: "@akashic-extension/audio-library",
					version: "0.0.0",
					main: "lib/index.js"
				}),
				"akashic-lib.json": JSON.stringify({
					assetList: [
						{
							type: "audio",
							path: "assets/audios/bgm_1",
							systemId: "music",
							duration: 15364
						},
						{
							type: "audio",
							path: "assets/audios/bgm_2",
							systemId: "music",
							duration: 32412
						},
						{
							type: "audio",
							path: "assets/audios/bgm_3",
							systemId: "music",
							duration: 51214
						}
					]
				})
			}
		};

		const mockFsContent: any = {
			somedir: {
				node_modules: {},
				"game.json": JSON.stringify({
					width: 1280,
					height: 720,
					fps: 60,
					assets: {}
				})
			}
		};

		mockfs(mockFsContent);
		class dummyNpm extends cmn.PromisedNpm {
			async install(names: string[]) {
				names = (names instanceof Array) ? names : [names];
				names.forEach(name => {
					const nameNoVer = cmn.Util.makeModuleNameNoVer(name);
					mockFsContent.somedir.node_modules[nameNoVer] = mockModules[nameNoVer];
				});
				mockfs(mockFsContent.somedir);
			}
		};

		await promiseInstall({
			moduleNames: ["ui-library"],
			cwd: "./somedir",
			logger,
			debugNpm: new dummyNpm({})
		});
		let content = await cmn.ConfigurationFile.read("./somedir/game.json", logger);

		expect(Object.keys(content.assets).length).toBe(3);
		expect(content.assets["node_modules/ui-library/assets/audios/se_1"]).toEqual({
			type: "audio",
			path: "node_modules/ui-library/assets/audios/se_1",
			systemId: "sound",
			duration: 1270
		});
		expect(content.assets["node_modules/ui-library/assets/images/player.png"]).toEqual({
			type: "image",
			path: "node_modules/ui-library/assets/images/player.png",
			width: 100,
			height: 120
		});
		expect(content.assets["node_modules/ui-library/assets/images/enemy.png"]).toEqual({
			type: "image",
			path: "node_modules/ui-library/assets/images/enemy.png",
			width: 100,
			height: 120
		});

		await promiseInstall({
			moduleNames: ["audio-library"],
			cwd: "./somedir",
			logger,
			debugNpm: new dummyNpm({})
		});
		content = await cmn.ConfigurationFile.read("./somedir/game.json", logger);

		expect(Object.keys(content.assets).length).toBe(6);
		expect(content.assets["node_modules/audio-library/assets/audios/bgm_1"]).toEqual({
			type: "audio",
			path: "node_modules/audio-library/assets/audios/bgm_1",
			systemId: "music",
			duration: 15364
		});
		expect(content.assets["node_modules/audio-library/assets/audios/bgm_2"]).toEqual({
			type: "audio",
			path: "node_modules/audio-library/assets/audios/bgm_2",
			systemId: "music",
			duration: 32412
		});
		expect(content.assets["node_modules/audio-library/assets/audios/bgm_3"]).toEqual({
			type: "audio",
			path: "node_modules/audio-library/assets/audios/bgm_3",
			systemId: "music",
			duration: 51214
		});
	});

	it("no allow install @akashic/akashic-engine", function (done) {
		mockfs({});
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		Promise.resolve()
			.then(() => promiseInstall({ moduleNames: ["@akashic/akashic-engine"], cwd: ".", logger: logger }))
			.then(() => done.fail())
			.catch ((_err) => {/* do nothing */})
			.then(() => promiseInstall({ moduleNames: ["@akashic/akashic-engine@1.0.0"], cwd: ".", logger: logger }))
			.then(() => done.fail())
			.catch ((_err) => done());
		});
});
