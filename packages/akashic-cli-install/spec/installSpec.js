var path = require("path");
var mockfs = require("mock-fs");
var cmn = require("@akashic/akashic-cli-commons");
var promiseInstall = require("../lib/install").promiseInstall;

describe("install()", function () {
	afterEach(function () {
		mockfs.restore();
	});

	it("handles npm install failure", function (done) {
		mockfs({});
		var logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		var shrinkwrapCalled = false;
		var dummyNpm = {
			install: function (names) { return Promise.reject("InstallFail:" + names); },
			shrinkwrap: function (names) { shrinkwrapCalled = true; return Promise.resolve(); }
		};
		Promise.resolve()
			.then(() => promiseInstall({ moduleNames: ["bar"], logger: logger, debugNpm: dummyNpm }))
			.then(done.fail)
			.catch((err) => {
				expect(err).toBe("InstallFail:bar");
				expect(shrinkwrapCalled).toBe(false);
			})
			.then(() => cmn.ConfigurationFile.read("./game.json", logger))
			.then((content) => {
				expect(content.globalScripts).toBeUndefined();
			})
			.then(done, done.fail);
	});

	it("handles npm link failure", function (done) {
		mockfs({});
		var logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		var dummyNpm = {
			link: function (names) { return Promise.reject("LinkFail:" + names); },
		};
		Promise.resolve()
			.then(() => promiseInstall({ moduleNames: ["bar"], link: true, logger: logger, debugNpm: dummyNpm }))
			.then(done.fail)
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
		var warnLogs = [];
		var logger = {
			warn: function(message) {
				warnLogs.push(message);
			},
			info: function(message) {
				// do nothing
			}
		};

		var mockModules = {
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
		var mockFsContent = {
			"somedir": {
				"node_modules": {}
			}
		};

		mockfs(mockFsContent);
		var resolvedOriginalPath = path.resolve(process.cwd());
		var shrinkwrapCalled = false;
		var dummyNpm = {
			install: function (names) {
				names = (names instanceof Array) ? names : [names];
				names.forEach(function (name) {
					var nameNoVer = cmn.Util.makeModuleNameNoVer(name);
					mockFsContent.somedir.node_modules[nameNoVer] = mockModules[nameNoVer];
				});

				// 一時的にもともとのカレントディレクトリに戻してから、新しい内容でmockfs()することでnpm installを模擬する。
				// このパスに来る段階、つまりこのテストでnpmが叩かれる時は、./somedir に移動してしまっている。
				// 戻してからmockfs()しないと変なところをモックしてしまう。
				var restoreDir = cmn.Util.chdir(resolvedOriginalPath);
				mockfs(mockFsContent);
				return restoreDir();
			},
			shrinkwrap: function () {
				shrinkwrapCalled = true;
				return Promise.resolve();
			}
		};

		Promise.resolve()
			.then(() => promiseInstall({ moduleNames: ["dummy"], cwd: "./somedir", logger: logger, debugNpm: dummyNpm }))
			.then(() => cmn.ConfigurationFile.read("./somedir/game.json", logger))
			.then((content) => {
				var globalScripts = content.globalScripts;
				expect(globalScripts instanceof Array).toBe(true);
				expect(globalScripts.length).toBe(3);
				expect(globalScripts.indexOf("node_modules/dummy/main.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/foo.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/node_modules/dummyChild/main.js")).not.toBe(-1);
				var moduleMainScripts = content.moduleMainScripts;
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
				expect(shrinkwrapCalled).toBe(true);
				shrinkwrapCalled = false;
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
				var globalScripts = content.globalScripts;
				expect(globalScripts.length).toBe(5);
				expect(globalScripts.indexOf("node_modules/dummy/main.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/foo.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/node_modules/dummyChild/main.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy2/index.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy2/sub.js")).not.toBe(-1);
				var moduleMainScripts = content.moduleMainScripts;
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/main.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js"
				});
				expect(shrinkwrapCalled).toBe(true);
				warnLogs = []; // 初期化
			})
			.then(() => promiseInstall({ moduleNames: ["noOmitPackagejson@0.0.0"], cwd: "./somedir", logger: logger, debugNpm: dummyNpm, noOmitPackagejson: true }))
			.then(() => cmn.ConfigurationFile.read("./somedir/game.json", logger))
			.then((content) => {
				var globalScripts = content.globalScripts;

				expect(warnLogs.length).toBe(0);
				expect(globalScripts.indexOf("node_modules/noOmitPackagejson/main.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/noOmitPackagejson/package.json")).not.toBe(-1);
				var moduleMainScripts = content.moduleMainScripts;
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/main.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js",
					"noOmitPackagejson": "node_modules/noOmitPackagejson/main.js"
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
				var globalScripts = content.globalScripts;
				globalScripts.push("node_modules/foo/foo.js");
				cmn.ConfigurationFile.write(content, "./somedir/game.json", logger);
			})
			.then(() => promiseInstall({ moduleNames: ["dummy@1.0.1"], cwd: "./somedir", logger: logger, debugNpm: dummyNpm }))
			.then(() => cmn.ConfigurationFile.read("./somedir/game.json", logger))
			.then((content) => {
				var globalScripts = content.globalScripts;

				expect(warnLogs.length).toBe(0);
				expect(globalScripts.indexOf("node_modules/dummy/main.js")).toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/foo.js")).toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/node_modules/dummyChild/main.js")).toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/index2.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/dummy/sub2.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/foo/foo.js")).toBe(-1);
				var moduleMainScripts = content.moduleMainScripts;
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/index2.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js",
					"noOmitPackagejson": "node_modules/noOmitPackagejson/main.js"
				});
			})
			.then(done, done.fail);
	});

	it("rejects plugin option for multiple module installing", function (done) {
		mockfs({});
		var logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		Promise.resolve()
			.then(() => promiseInstall({ moduleNames: ["dummy@1.0.1", "anotherdummy"], cwd: ".", plugin: 10, logger: logger }))
			.then(done.fail)
			.catch ((err) => done());
	});

	it("just performs npm install unless moduleNames given", function (done) {
		mockfs({});
		var logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		var installCallCount = 0;
		var dummyNpm = {
			install: function (names) {
				++installCallCount;
				// npm install (引数なし) が呼ばれることを確認するため、引数があったらreject。
				return names ? Promise.reject() : Promise.resolve();
			},
			shrinkwrap: function () { return Promise.resolve(); }
		};
		Promise.resolve()
			.then(() => promiseInstall({ cwd: ".", logger: logger, debugNpm: dummyNpm }))
			.then(() => {
				expect(installCallCount).toBe(1);
			})
			.then(done, done.fail);
	});
});
