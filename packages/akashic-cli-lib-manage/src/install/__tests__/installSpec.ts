import * as fs from "fs";
import * as path from "path";
import { vi } from "vitest";
import * as cmn from "@akashic/akashic-cli-commons";
import { InstallParameterObject, promiseInstall } from "../install.js";
import * as testUtil from "../../../../akashic-cli-commons/src/__tests__/helpers/TestUtil.js";

describe("install()", () => {

	const baseDir = path.resolve(__dirname, "..", "__tests__", "fixture-install-");
	let fixtureContents: testUtil.PrepareFsContentResult;
	
	afterAll(() => {
		fixtureContents.dispose();
	});

	it("handles npm install failure", async () => {
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		const dummyNpm = new cmn.PromisedNpm({});
		dummyNpm.install = (names) => Promise.reject("InstallFail:" + names);

		await expect(
			promiseInstall({ moduleNames: ["bar"], logger: logger, debugNpm: dummyNpm })
		).rejects.toThrow("InstallFail:bar");
	});

	it("handles npm link failure", async () => {
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		const dummyNpm = new cmn.PromisedNpm({});
		dummyNpm.link = (names) => Promise.reject("LinkFail:" + names);

		await expect(
			promiseInstall({ moduleNames: ["bar"], link: true, logger: logger, debugNpm: dummyNpm })
		).rejects.toThrow("LinkFail:bar")
	});

	it("installs modules and updates globalScripts", async () => {
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });

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

		const requireResolve = vi.spyOn(cmn.Util, "requireResolve");
		requireResolve.mockImplementation((id: string, opts?: { paths?: string[] | undefined }) => {
			const pkgJsonPath = path.join(opts!.paths![0], "package.json");
			const pkgData = JSON.parse(fs.readFileSync(pkgJsonPath).toString("utf-8"));
			const mainScriptName = pkgData.main.split(".").pop() === "js" ? pkgData.main : pkgData.main + ".js";
			return path.join(path.resolve("."), path.dirname(pkgJsonPath), mainScriptName);
		});

		fixtureContents = testUtil.prepareFsContent(mockFsContent, baseDir);
		const somedir = path.join(fixtureContents.path, "somedir");

		const dummyNpm = new cmn.PromisedNpm({});
		dummyNpm.install = (names: string[]) => {
			names = Array.isArray(names) ? names : [names];
			names.forEach((name) => {
				const nameNoVer = cmn.Util.makeModuleNameNoVer(name);
				mockFsContent.somedir.node_modules[nameNoVer] = mockModules[nameNoVer];
			});
			testUtil.prepareFsContent(mockFsContent.somedir.node_modules, baseDir, path.join(somedir, "node_modules"));
			return Promise.resolve();
		};

		return Promise.resolve()
			.then(() => promiseInstall({ moduleNames: ["dummy"], cwd: somedir, logger: logger, debugNpm: dummyNpm }))
			.then(async () => {
				const ret = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(somedir, "game.json"))
				return ret;
			})
			.then((content) => {
				const globalScripts = content.globalScripts!;
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
				expect(content.moduleMainPaths).toBeUndefined();
			})
			.then(() => promiseInstall({ moduleNames: ["dummy2"], cwd: somedir, plugin: 12, logger: logger, debugNpm: dummyNpm }))
			.then(() => cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(somedir, "game.json")))
			.then((content) => {
				expect(content.operationPlugins).toEqual([
					{
						code: 12,
						script: "dummy2"
					}
				]);
				const globalScripts = content.globalScripts!;
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
			})
			.then(() => promiseInstall({ moduleNames: ["noOmitPackagejson"], cwd: somedir, logger: logger, debugNpm: dummyNpm, noOmitPackagejson: true }))
			.then(() => cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(somedir, "game.json")))
			.then((content) => {
				const globalScripts = content.globalScripts!;

				expect(globalScripts.indexOf("node_modules/noOmitPackagejson/main.js")).not.toBe(-1);
				expect(globalScripts.indexOf("node_modules/noOmitPackagejson/package.json")).not.toBe(-1);
				const moduleMainScripts = content.moduleMainScripts;
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/main.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js",
					"noOmitPackagejson": "node_modules/noOmitPackagejson/main.js"
				});
				expect(content.moduleMainPaths).toBeUndefined();
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
				testUtil.prepareFsContent(mockModules, baseDir, path.join(somedir, "node_modules"));
			})
			.then(() => cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(somedir, "game.json")))
			.then(async (content) => {
				// 存在しないファイルをgame.jsonに指定
				const globalScripts = content.globalScripts!;
				globalScripts.push("node_modules/foo/foo.js");
				await cmn.FileSystem.writeJSON<cmn.GameConfiguration>(path.join(somedir, "game.json"), content);
			})
			.then(async () => {
				// moduleMainPaths の動作確認
				const install = (param?: InstallParameterObject) => promiseInstall({ moduleNames: ["dummy"], cwd: somedir, logger: logger, debugNpm: dummyNpm, ...param });
				const readConfig = () => cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(somedir, "game.json"));
				const writeConfig = () => cmn.FileSystem.writeJSON<cmn.GameConfiguration>(path.join(somedir, "game.json"), content);
				const defaultConfig = (config?: any) => ({...config});

				let content: any;

				// 1-1. sandbox-runtime が 3 ではない場合は useMmp は無視される
				content = defaultConfig({
					moduleMainPaths: {},
					environment: { "sandbox-runtime": "2" },
				});
				await writeConfig();
				await install({ useMmp: true });
				content = await readConfig();
				expect(content.moduleMainScripts).toEqual({ 
					"dummy": "node_modules/dummy/index2.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js"
				});

				// 1-2. sandbox-runtime 3 にて moduleMainPaths のみ存在した場合は moduleMainPaths に追加
				content = defaultConfig({
					moduleMainPaths: {},
					environment: { "sandbox-runtime": "3" },
				});
				await writeConfig();
				await install();
				content = await readConfig();
				expect(content.moduleMainScripts).toBeUndefined();
				expect(content.moduleMainPaths).toEqual({ 
					"node_modules/dummy/package.json": "node_modules/dummy/index2.js" ,
					'node_modules/dummy/node_modules/dummyChild/package.json': 'node_modules/dummy/node_modules/dummyChild/main.js'
				});

				// 1-3. sandbox-runtime 3 にて moduleMainScripts のみ存在した場合は moduleMainScripts に追加
				content = defaultConfig({
					moduleMainScripts: {},
					environment: { "sandbox-runtime": "3" },
				});
				await writeConfig();
				await install();
				content = await readConfig();
				expect(content.moduleMainScripts).toEqual({ 
					"dummy": "node_modules/dummy/index2.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js" 
				});
				expect(content.moduleMainPaths).toBeUndefined();

				// 1-4. sandbox-runtime 3 にて useMmp が有効なことを確認
				content = defaultConfig({
					environment: { "sandbox-runtime": "3" },
				});
				await writeConfig();
				await install({ useMmp: true });
				content = await readConfig();
				expect(content.moduleMainScripts).toBeUndefined();
				expect(content.moduleMainPaths).toEqual({ 
					"node_modules/dummy/package.json": "node_modules/dummy/index2.js",
					"node_modules/dummy/node_modules/dummyChild/package.json": "node_modules/dummy/node_modules/dummyChild/main.js"
				});

				// 1-5. sandbox-runtime 3 にて useMms が有効なことを確認
				content = defaultConfig({
					environment: { "sandbox-runtime": "3" },
				});
				await writeConfig();
				await install({ useMms: true });
				content = await readConfig();
				expect(content.moduleMainScripts).toEqual({ 
					"dummy": "node_modules/dummy/index2.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/main.js",
				});
				expect(content.moduleMainPaths).toBeUndefined();

				// 2-1. sandbox-runtime 3 にて moduleMainPaths と moduleMainScripts が両方とも存在した場合はエラー
				content = defaultConfig({
					moduleMainScripts: {},
					moduleMainPaths: {},
					environment: { "sandbox-runtime": "3" },
				});
				await writeConfig();
				await expect(install()).rejects.toThrow();

				// 2-2. sandbox-runtime 3 にて moduleMainScripts が存在する場合に useMmp を有効にするとエラー
				content = defaultConfig({
					moduleMainScripts: {},
					environment: { "sandbox-runtime": "3" },
				});
				await writeConfig();
				await expect(install({ useMmp: true })).rejects.toThrow();

				// 2-3. sandbox-runtime 3 にて moduleMainPaths が存在する場合に useMms を有効にするとエラー
				content = defaultConfig({
					moduleMainPaths: {},
					environment: { "sandbox-runtime": "3" },
				});
				await writeConfig();
				await expect(install({ useMms: true })).rejects.toThrow();
			})
	});

	it("rejects plugin option for multiple module installing", async () => {
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		await expect(
			promiseInstall({ moduleNames: ["dummy@1.0.1", "anotherdummy"], cwd: ".", plugin: 10, logger: logger })
		).rejects.toThrow();
	});

	it("just performs npm install unless moduleNames given", async () => {
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		let installCallCount = 0;
		const dummyNpm = new cmn.PromisedNpm({});
		dummyNpm.install = (names: string[]) => {
			++installCallCount;
			// npm install (引数なし) が呼ばれることを確認するため、引数があったらreject。
			return names ? Promise.reject() : Promise.resolve();
		};

		await promiseInstall({ cwd: ".", logger: logger, debugNpm: dummyNpm });
		expect(installCallCount).toBe(1);
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

		fixtureContents.dispose();
		fixtureContents = testUtil.prepareFsContent(mockFsContent, baseDir);
		const somedir = path.join(fixtureContents.path, "somedir");
		class dummyNpm extends cmn.PromisedNpm {
			async install(names: string[]) {
				names = (names instanceof Array) ? names : [names];
				names.forEach(name => {
					const nameNoVer = cmn.Util.makeModuleNameNoVer(name);
					mockFsContent.somedir.node_modules[nameNoVer] = mockModules[nameNoVer];
				});
				testUtil.prepareFsContent(mockModules, baseDir, path.join(somedir, "node_modules"));
			}
		};

		await promiseInstall({
			moduleNames: ["ui-library"],
			cwd: somedir,
			logger,
			debugNpm: new dummyNpm({})
		});
		let content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(somedir, "game.json"));

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
			cwd: somedir,
			logger,
			debugNpm: new dummyNpm({})
		});
		content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(somedir, "game.json"));

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

	it("no allow install @akashic/akashic-engine", async () => {
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		const cwdPath = fixtureContents.path;
		await expect(
			promiseInstall({ moduleNames: ["@akashic/akashic-engine"], cwd: cwdPath, logger: logger })
		).rejects.toThrow();

		await expect(
			promiseInstall({ moduleNames: ["@akashic/akashic-engine@1.0.0"], cwd: cwdPath, logger: logger })
		).rejects.toThrow();
	});
});
