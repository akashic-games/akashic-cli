import * as fs from "fs";
import * as path from "path";
import * as mockfs from "mock-fs";
import { ConsoleLogger } from "../../lib/ConsoleLogger";
import { Logger } from "../../lib/Logger";
import { NodeModules } from "../../lib/NodeModules";
import { Util } from "../../lib";

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
			},
			"dummy3": mockfs.symlink({ path: "../dummy3-original" })
		},
		"dummy3-original": {
			"index.js": "require('./sub')",
			"sub.js": "",
			"package.json": JSON.stringify({
				name: "dummy3",
				version: "0.0.0",
				main: "index.js"
			})
		}
	};

	let logger: Logger;
	beforeEach(() => {
		logger = new ConsoleLogger({ debugLogMethod: () => { /* do nothing */ } });
		mockfs(mockFsContent);
	});

	beforeEach(function () {
	});
	afterEach(function () {
		mockfs.restore();
	});

	describe(".listModulesFiles()", function () {
		it("list the script files and all package.json", function (done) {
			mockfs(mockFsContent);
			Promise.resolve()
				.then(() => NodeModules.listModuleFiles(".", ["dummy@1", "dummy2", "dummy3"], logger))
				.then((pkgjsonPaths) => {
					expect(pkgjsonPaths.sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0))).toEqual([
						"node_modules/dummy/foo.js",
						"node_modules/dummy/main.js",
						"node_modules/dummy/node_modules/dummyChild/main.js",
						"node_modules/dummy/node_modules/dummyChild/package.json",
						"node_modules/dummy/package.json",
						"node_modules/dummy2/index.js",
						"node_modules/dummy2/sub.js",
						"node_modules/dummy3/package.json",
						"node_modules/dummy3/index.js",
						"node_modules/dummy3/sub.js"
					].sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0)));
				})
				.then(() => NodeModules.listModuleFiles(".", "dummy2", logger))
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
				.then(() => NodeModules.listScriptFiles(".", ["dummy", "dummy2", "dummy3"], logger))
				.then((filePaths) => NodeModules.listPackageJsonsFromScriptsPath(".", filePaths))
				.then((pkgJsonPaths) => {
					expect(pkgJsonPaths.sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0))).toEqual([
						"node_modules/dummy/package.json",
						"node_modules/dummy/node_modules/dummyChild/package.json",
						"node_modules/dummy3/package.json"
					].sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0)))
				})
				.then(() => NodeModules.listScriptFiles(".", "dummy2", logger))
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
				.then(() => NodeModules.listScriptFiles(".", ["dummy", "dummy2", "dummy3"], logger))
				.then((filePaths) => {
					expect(filePaths.sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0))).toEqual([
						"node_modules/dummy/foo.js",
						"node_modules/dummy/main.js",
						"node_modules/dummy/node_modules/dummyChild/main.js",
						"node_modules/dummy2/index.js",
						"node_modules/dummy2/sub.js",
						"node_modules/dummy3/index.js",
						"node_modules/dummy3/sub.js",
					]);
				})
				.then(() => NodeModules.listScriptFiles(".", "dummy", logger))
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
			jest.spyOn(Util, "requireResolve").mockImplementation((id: string, opts: { paths?: string[] | undefined }): string => {
				const pkgJsonPath = path.join(opts.paths[0], "package.json");
				const pkgData =  JSON.parse(fs.readFileSync(pkgJsonPath).toString("utf-8"));
				const mainScriptName = pkgData.main.split(".").pop() === "js" ? pkgData.main : pkgData.main + ".js";
				return path.join(path.resolve("."), path.dirname(pkgJsonPath), mainScriptName);
			});

			mockfs(mockFsContent);
			Promise.resolve()
				.then(() => NodeModules.listScriptFiles(".", ["dummy", "dummy2", "dummy3"], logger))
				.then((filePaths) => NodeModules.listPackageJsonsFromScriptsPath(".", filePaths))
				.then((packageJsonFiles) => NodeModules.listModuleMainScripts(packageJsonFiles))
				.then((moduleMainScripts) => {
					expect(moduleMainScripts).toEqual({
						"dummy": "node_modules/dummy/main.js",
						"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js",
						"dummy3": "node_modules/dummy3/index.js"
					});
				})
				.then(done)
				.catch(() => done.fail());
		});
	});

	describe(".listModuleMainPaths()", function () {
		it("key is the path of package.json.", function (done) {
			jest.spyOn(Util, "requireResolve").mockImplementation((id: string, opts: { paths?: string[] | undefined }): string => {
				const pkgJsonPath = path.join(opts.paths[0], "package.json");
				const pkgData =  JSON.parse(fs.readFileSync(pkgJsonPath).toString("utf-8"));
				const mainScriptName = pkgData.main.split(".").pop() === "js" ? pkgData.main : pkgData.main + ".js";
				return path.join(path.resolve("."), path.dirname(pkgJsonPath), mainScriptName);
			});

			mockfs(mockFsContent);
			Promise.resolve()
				.then(() => NodeModules.listScriptFiles(".", ["dummy", "dummy2", "dummy3"], logger))
				.then((filePaths) => NodeModules.listPackageJsonsFromScriptsPath(".", filePaths))
				.then((packageJsonFiles) => NodeModules.listModuleMainPaths(packageJsonFiles))
				.then((moduleMainPaths) => {
					expect(moduleMainPaths).toEqual({
						"node_modules/dummy/package.json": "node_modules/dummy/main.js",
						"node_modules/dummy/node_modules/dummyChild/package.json": "node_modules/dummy/node_modules/dummyChild/main.js",
						"node_modules/dummy3/package.json": "node_modules/dummy3/index.js"
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
				.then(() => NodeModules.listScriptFiles(".", ["@dummy/dummy_node_modules", "dummy_node_modules"], logger))
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
