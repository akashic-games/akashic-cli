var mockfs = new require("mock-fs");
var NodeModules = require("../lib/NodeModules").NodeModules;

describe("NodeModules", function () {

	var mockFsContent = {
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
			}
		}
	};

	beforeEach(function () {
	});
	afterEach(function () {
		mockfs.restore();
	});

	describe(".listModulesFiles()", function () {
		it("list the script files and all package.json", function (done) {
			mockfs(mockFsContent);
			Promise.resolve()
				.then(() => NodeModules.listModuleFiles(".", ["dummy@1", "dummy2"]))
				.then((pkgjsonPaths) => {
					expect(pkgjsonPaths.sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0))).toEqual([
						"node_modules/dummy/foo.js",
						"node_modules/dummy/main.js",
						"node_modules/dummy/node_modules/dummyChild/main.js",
						"node_modules/dummy/node_modules/dummyChild/package.json",
						"node_modules/dummy/package.json",
						"node_modules/dummy2/index.js",
						"node_modules/dummy2/sub.js"
					].sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0)));
				})
				.then(() => NodeModules.listModuleFiles(".", "dummy2"))
				.then((pkgjsonPaths) => {
					expect(pkgjsonPaths.sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0))).toEqual([
						"node_modules/dummy2/index.js",
						"node_modules/dummy2/sub.js"
					]);
				})
				.then(done)
				.catch(() => done.fail());
		});
	});

	describe(".listPackageJsonsFromScriptsPath()", function () {
		it("list the files named package.json", function (done) {
			mockfs(mockFsContent);
			Promise.resolve()
				.then(() => NodeModules.listScriptFiles(".", ["dummy", "dummy2"]))
				.then((filePaths) => NodeModules.listPackageJsonsFromScriptsPath(".", filePaths))
				.then((pkgJsonPaths) => {
					expect(pkgJsonPaths.sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0))).toEqual([
						"node_modules/dummy/package.json",
						"node_modules/dummy/node_modules/dummyChild/package.json"
					].sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0)))
				})
				.then(() => NodeModules.listScriptFiles(".", "dummy2"))
				.then((filePaths) => NodeModules.listPackageJsonsFromScriptsPath(".", filePaths))
				.then((pkgJsonPaths) => {
					expect(pkgJsonPaths).toEqual([]);
				})
				.then(done)
				.catch(() => done.fail());
		});
	});

	describe(".listScriptFiles()", function () {
		it("list the scripts in node_modules/ up", function (done) {
			mockfs(mockFsContent);
			Promise.resolve()
				.then(() => NodeModules.listScriptFiles(".", ["dummy", "dummy2"]))
				.then((filePaths) => {
					expect(filePaths.sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0))).toEqual([
						"node_modules/dummy/foo.js",
						"node_modules/dummy/main.js",
						"node_modules/dummy/node_modules/dummyChild/main.js",
						"node_modules/dummy2/index.js",
						"node_modules/dummy2/sub.js"
					]);
				})
				.then(() => NodeModules.listScriptFiles(".", "dummy"))
				.then((filePaths) => {
					expect(filePaths.sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0))).toEqual([
						"node_modules/dummy/foo.js",
						"node_modules/dummy/main.js",
						"node_modules/dummy/node_modules/dummyChild/main.js"
					]);
				})
				.then(done)
				.catch(() => done.fail());
		});
	});

	describe(".listModuleMainScripts()", function () {
		it("list the files named package.json", function (done) {
			mockfs(mockFsContent);
			Promise.resolve()
				.then(() => NodeModules.listScriptFiles(".", ["dummy", "dummy2"]))
				.then((filePaths) => NodeModules.listPackageJsonsFromScriptsPath(".", filePaths))
				.then((packageJsonFiles) => NodeModules.listModuleMainScripts(packageJsonFiles))
				.then((moduleMainScripts) => {
					expect(moduleMainScripts).toEqual({
						"dummy": "node_modules/dummy/main.js",
						"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js"
					});
				})
				.then(done)
				.catch(() => done.fail());
		});
	});

	// モジュール名に node_modules を含むモジュールに依存しているケース
	describe(".listPackageJsonsFromScriptsPath() with failure-prone module name", function () {
		it("list the files named package.json", function (done) {
			// このテストではmockFsContentの中身を変えるので、mockFsContentは使い回せない。使い回した場合タイミングによりエラーとなる。
			var mockFsContent2 = {
				"node_modules": {
					"@dummy": {
						"dummy_node_modules": {
							"package.json": JSON.stringify({
								name: "dummy_node_modules",
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
						}
					},
					"dummy_node_modules": {
						"package.json": JSON.stringify({
							name: "dummy_node_modules",
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
					}
				}
			};
			mockfs(mockFsContent2);
			Promise.resolve()
				.then(() => NodeModules.listScriptFiles(".", ["@dummy/dummy_node_modules", "dummy_node_modules"]))
				.then((filePaths) => NodeModules.listPackageJsonsFromScriptsPath(".", filePaths))
				.then((pkgJsonPaths) => {
					expect(pkgJsonPaths.sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0))).toEqual([
						"node_modules/@dummy/dummy_node_modules/package.json",
						"node_modules/@dummy/dummy_node_modules/node_modules/dummyChild/package.json",
						"node_modules/dummy_node_modules/package.json",
						"node_modules/dummy_node_modules/node_modules/dummyChild/package.json"
					].sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0)))
				})
				.then(done)
				.catch(() => done.fail());
		});
	});

});
