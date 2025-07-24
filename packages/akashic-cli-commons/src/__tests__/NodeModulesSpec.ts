import * as fs from "fs";
import * as path from "path";
import { vi } from "vitest";
import { ConsoleLogger } from "../ConsoleLogger.js";
import { Logger } from "../Logger.js";
import { NodeModules } from "../NodeModules.js";
import { Util } from "..";

describe("NodeModules", () => {
	const fixturesDir = path.resolve(__dirname, "..", "__tests__", "fixtures");
	const contentPath =  path.resolve(fixturesDir, "sample_nodemodules");

	let logger: Logger;
	beforeEach(() => {
		logger = new ConsoleLogger({ debugLogMethod: () => { /* do nothing */ } });
	});
	afterEach(() => {
	});

	describe(".listModulesFiles()", () => {
		it("lists the script files and all package.json", async () => {
			let pkgjsonPaths = await NodeModules.listModuleFiles(contentPath, ["dummy", "dummy2", "dummy3"], logger);
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

			pkgjsonPaths = await NodeModules.listModuleFiles(contentPath, "dummy2", logger);
			expect(pkgjsonPaths.sort((a, b) => ((a > b) ? 1 : (a < b) ? -1 : 0))).toEqual([
				"node_modules/dummy2/index.js",
				"node_modules/dummy2/sub.js"
			]);
		});
	});

	describe(".listPackageJsonsFromScriptsPath()", () => {
		it("lists the files named package.json", async () => {
			const filePaths = await NodeModules.listScriptFiles(contentPath, ["dummy", "dummy2", "dummy3"], logger);
			const pkgJsonPaths = NodeModules.listPackageJsonsFromScriptsPath(contentPath, filePaths);
			expect(pkgJsonPaths.sort()).toEqual([
				"node_modules/dummy/package.json",
				"node_modules/dummy/node_modules/dummyChild/package.json",
				"node_modules/dummy3/package.json"
			].sort());
			
			const filePathsDummy2 = await NodeModules.listScriptFiles(contentPath, "dummy2", logger);
			const pkgJsonPathsDummy2 = NodeModules.listPackageJsonsFromScriptsPath(contentPath, filePathsDummy2);
			
			expect(pkgJsonPathsDummy2).toEqual([]);
		});
	});

	describe(".listScriptFiles()", () => {
		it("lists the scripts in node_modules/ up", async () => {
			const filePaths = await NodeModules.listScriptFiles(contentPath, ["dummy", "dummy2", "dummy3"], logger);
			expect(filePaths.sort()).toEqual([
				"node_modules/dummy/foo.js",
				"node_modules/dummy/main.js",
				"node_modules/dummy/node_modules/dummyChild/main.js",
				"node_modules/dummy2/index.js",
				"node_modules/dummy2/sub.js",
				"node_modules/dummy3/index.js",
				"node_modules/dummy3/sub.js",
			]);
			
			const filePathsDummy = await NodeModules.listScriptFiles(contentPath, "dummy", logger);
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

			const filePaths = await NodeModules.listScriptFiles(contentPath, ["dummy", "dummy2", "dummy3"], logger);
			let packageJsonFiles = NodeModules.listPackageJsonsFromScriptsPath(contentPath, filePaths);
			// 本来はルート直下の ./node_modules のパスだが、テストで node_modules のパスがルート直下ではないためパスを生成
			packageJsonFiles = packageJsonFiles.map(p => path.resolve(contentPath, p));
			const moduleMainScripts = NodeModules.listModuleMainScripts(packageJsonFiles);

			expect(moduleMainScripts).toEqual({
				"dummy": path.resolve(contentPath,"node_modules/dummy/main.js").replace(/^\//, ""),
				"dummyChild": path.resolve(contentPath,"node_modules/dummy/node_modules/dummyChild/main.js").replace(/^\//, ""),
				"dummy3": path.resolve(contentPath,"node_modules/dummy3/index.js").replace(/^\//, "")
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

			const filePaths = await NodeModules.listScriptFiles(contentPath, ["dummy", "dummy2", "dummy3"], logger);
			let packageJsonFiles = NodeModules.listPackageJsonsFromScriptsPath(contentPath, filePaths);
			// 本来はルート直下の ./node_modules のパスだが、テストで node_modules のパスがルート直下ではないためパスを生成
			packageJsonFiles = packageJsonFiles.map(p => path.resolve(contentPath, p));
			const moduleMainPaths = NodeModules.listModuleMainPaths(packageJsonFiles);

			const pkgJsonKey1 = path.resolve(contentPath,"node_modules/dummy/package.json");
			const gameJsonKey = path.resolve(contentPath, "node_modules/dummy/node_modules/dummyChild/package.json");
			const pkgJsonKey3 = path.resolve(contentPath, "node_modules/dummy3/package.json");

			const expectObj: { [key: string]: string } = {};
			expectObj[pkgJsonKey1] =  path.resolve(contentPath,"node_modules/dummy/main.js").replace(/^\//, "");
			expectObj[gameJsonKey] =  path.resolve(contentPath, "node_modules/dummy/node_modules/dummyChild/main.js").replace(/^\//, "");
			expectObj[pkgJsonKey3] =  path.resolve(contentPath, "node_modules/dummy3/index.js").replace(/^\//, "");
			expect(moduleMainPaths).toEqual(expectObj);
		});
	});

	// モジュール名に node_modules を含むモジュールに依存しているケース
	describe(".listPackageJsonsFromScriptsPath() with failure-prone module name", () => {
		it("lists the files named package.json", async () => {
			const filePaths = await NodeModules.listScriptFiles(contentPath, ["@dummy/dummy_node_modules", "dummy_node_modules"], logger);
			const pkgJsonPaths = NodeModules.listPackageJsonsFromScriptsPath(contentPath, filePaths);


			expect(pkgJsonPaths.sort()).toEqual([
				"node_modules/@dummy/dummy_node_modules/package.json",
				"node_modules/@dummy/dummy_node_modules/node_modules/dummyChild/package.json",
				"node_modules/dummy_node_modules/package.json",
				"node_modules/dummy_node_modules/node_modules/dummyChild/package.json"
			].sort());
		});
	});

});
