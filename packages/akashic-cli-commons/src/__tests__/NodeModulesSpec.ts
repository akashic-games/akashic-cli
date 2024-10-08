import * as fs from "fs";
import * as path from "path";
import mockfs from "mock-fs";
import { vi } from "vitest";
import { ConsoleLogger } from "../ConsoleLogger.js";
import { Logger } from "../Logger.js";
import { NodeModules } from "../NodeModules.js";
import { Util } from "..";

describe("NodeModules", () => {
	const mockFsContent = {
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
	afterEach(() => {
		mockfs.restore();
	});

	describe(".listModulesFiles()", () => {
		it("lists the script files and all package.json", async () => {
			mockfs(mockFsContent);

			let pkgjsonPaths = await NodeModules.listModuleFiles(".", ["dummy@1", "dummy2", "dummy3"], logger);
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

			pkgjsonPaths = await NodeModules.listModuleFiles(".", "dummy2", logger);
			expect(pkgjsonPaths.sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0))).toEqual([
				"node_modules/dummy2/index.js",
				"node_modules/dummy2/sub.js"
			]);
		});
	});

	describe(".listPackageJsonsFromScriptsPath()", () => {
		it("lists the files named package.json", async () => {
			mockfs(mockFsContent);
			const filePaths = await NodeModules.listScriptFiles(".", ["dummy", "dummy2", "dummy3"], logger);
			const pkgJsonPaths = NodeModules.listPackageJsonsFromScriptsPath(".", filePaths);
			
			expect(pkgJsonPaths.sort()).toEqual([
				"node_modules/dummy/package.json",
				"node_modules/dummy/node_modules/dummyChild/package.json",
				"node_modules/dummy3/package.json"
			].sort());
			
			const filePathsDummy2 = await NodeModules.listScriptFiles(".", "dummy2", logger);
			const pkgJsonPathsDummy2 = NodeModules.listPackageJsonsFromScriptsPath(".", filePathsDummy2);
			
			expect(pkgJsonPathsDummy2).toEqual([]);
		});
	});

	describe(".listScriptFiles()", () => {
		it("lists the scripts in node_modules/ up", async () => {
			mockfs(mockFsContent);
			const filePaths = await NodeModules.listScriptFiles(".", ["dummy", "dummy2", "dummy3"], logger);
			expect(filePaths.sort()).toEqual([
				"node_modules/dummy/foo.js",
				"node_modules/dummy/main.js",
				"node_modules/dummy/node_modules/dummyChild/main.js",
				"node_modules/dummy2/index.js",
				"node_modules/dummy2/sub.js",
				"node_modules/dummy3/index.js",
				"node_modules/dummy3/sub.js",
			]);
			
			const filePathsDummy = await NodeModules.listScriptFiles(".", "dummy", logger);
			expect(filePathsDummy.sort()).toEqual([
				"node_modules/dummy/foo.js",
				"node_modules/dummy/main.js",
				"node_modules/dummy/node_modules/dummyChild/main.js"
			]);
		});
	});

	describe(".listModuleMainScripts()", () => {
		it("lists the files named package.json", async () => {
			vi.spyOn(Util, "requireResolve").mockImplementation((id: string, opts?: { paths?: string[] | undefined }): string => {
				const pkgJsonPath = path.join(opts!.paths![0], "package.json");
				const pkgData =  JSON.parse(fs.readFileSync(pkgJsonPath).toString("utf-8"));
				const mainScriptName = pkgData.main.split(".").pop() === "js" ? pkgData.main : pkgData.main + ".js";
				return path.join(path.resolve("."), path.dirname(pkgJsonPath), mainScriptName);
			});

			mockfs(mockFsContent);
			const filePaths = await NodeModules.listScriptFiles(".", ["dummy", "dummy2", "dummy3"], logger);
			const packageJsonFiles = NodeModules.listPackageJsonsFromScriptsPath(".", filePaths);
			const moduleMainScripts = NodeModules.listModuleMainScripts(packageJsonFiles);

			expect(moduleMainScripts).toEqual({
				"dummy": "node_modules/dummy/main.js",
				"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js",
				"dummy3": "node_modules/dummy3/index.js"
			});
		});
	});

	describe(".listModuleMainPaths()", () => {
		it("keys are the path of package.json.", async () => {
			vi.spyOn(Util, "requireResolve").mockImplementation((id: string, opts?: { paths?: string[] | undefined }): string => {
				const pkgJsonPath = path.join(opts!.paths![0], "package.json");
				const pkgData =  JSON.parse(fs.readFileSync(pkgJsonPath).toString("utf-8"));
				const mainScriptName = pkgData.main.split(".").pop() === "js" ? pkgData.main : pkgData.main + ".js";
				return path.join(path.resolve("."), path.dirname(pkgJsonPath), mainScriptName);
			});

			mockfs(mockFsContent);
			const filePaths = await NodeModules.listScriptFiles(".", ["dummy", "dummy2", "dummy3"], logger);
			const packageJsonFiles = NodeModules.listPackageJsonsFromScriptsPath(".", filePaths);
			const moduleMainPaths = NodeModules.listModuleMainPaths(packageJsonFiles);

			expect(moduleMainPaths).toEqual({
				"node_modules/dummy/package.json": "node_modules/dummy/main.js",
				"node_modules/dummy/node_modules/dummyChild/package.json": "node_modules/dummy/node_modules/dummyChild/main.js",
				"node_modules/dummy3/package.json": "node_modules/dummy3/index.js"
			});
		});
	});

	// モジュール名に node_modules を含むモジュールに依存しているケース
	describe(".listPackageJsonsFromScriptsPath() with failure-prone module name", () => {
		it("lists the files named package.json", async () => {
			// このテストではmockFsContentの中身を変えるので、mockFsContentは使い回せない。使い回した場合タイミングによりエラーとなる。
			const mockFsContent2 = {
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

			const filePaths = await NodeModules.listScriptFiles(".", ["@dummy/dummy_node_modules", "dummy_node_modules"], logger);
			const pkgJsonPaths = NodeModules.listPackageJsonsFromScriptsPath(".", filePaths);

			expect(pkgJsonPaths.sort()).toEqual([
				"node_modules/@dummy/dummy_node_modules/package.json",
				"node_modules/@dummy/dummy_node_modules/node_modules/dummyChild/package.json",
				"node_modules/dummy_node_modules/package.json",
				"node_modules/dummy_node_modules/node_modules/dummyChild/package.json"
			].sort());
		});
	});

});
