import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import { promiseUninstall } from "../../uninstall/uninstall.js";
import * as testUtil from "../../../../akashic-cli-commons/src/__tests__/helpers/TestUtil.js";

describe("uninstall()", () => {
	const baseDir = path.resolve(__dirname, "..", "__tests__", "fixture-unistall-");
	let fixtureContents: testUtil.PrepareFsContentResult; 

	afterEach(() => {
		if (fixtureContents) {
			fixtureContents.dispose();
		}			
	});

	it("rejects multiple module names if plugin operation is given", async () => {
		await expect(
			promiseUninstall({ moduleNames: ["foo", "bar"], plugin: true })
		).rejects.toThrow();
	});

	it("handles npm failure", async () => {
		class DummyNpm extends cmn.PromisedNpm {
			uninstall(names?: string[]) { return Promise.reject("UninstallFail:" + names); }
		}
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		await expect(
			promiseUninstall({
				moduleNames: ["tee"],
				cwd: ".",
				logger: logger,
				debugNpm: new DummyNpm({ logger })
			})
		).rejects.toThrow();
	});

	it("removes declaration from globalScripts", async () => {
		const mockfsContent: any = {
			testdir: {
				foo: {
					node_modules: {
						foo: {
							lib: {
								"index.js": {},
								"sub.js": {}
							},
							node_modules: {
								bar: {
									"index.js": {}
								}
							},
							"package.json": JSON.stringify({
								name: "foo",
								version: "0.0.0",
								dependencies: "bar",
								main: "lib/index.js"
							})
						},
						buzz: {
							sub: {
								"foo.js": {}
							},
							"main.js": {},
							"package.json": JSON.stringify({
								name: "buzz",
								version: "0.0.0",
								dependencies: "sub",
								main: "main.js"
							})
						}
					},
					"game.json": JSON.stringify({
						width: 10,
						height: 20,
						fps: 30,
						globalScripts: [
							"node_modules/foo/lib/index.js",
							"node_modules/foo/lib/sub.js",
							"node_modules/foo/node_modules/bar/index.js",
							"node_modules/buzz/main.js",
							"node_modules/buzz/sub/foo.js"
						],
						moduleMainScripts: {
							"foo": "node_modules/foo/index.js",
							"buzz": "node_modules/buzz/main.js"
						},
						moduleMainPaths: {
							"node_modules/foo/package.json": "node_modules/foo/index.js",
							"node_modules/buzz/package.json": "node_modules/buzz/main.js"
						}
					})
				}
			}
		};
		fixtureContents = testUtil.prepareFsContent(mockfsContent, fs.mkdtempSync(baseDir));

		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		class DummyNpm extends cmn.PromisedNpm {
			uninstallLog: string[][];
			unlinkLog: string[][];
			constructor() {
				super({ logger });
				this.uninstallLog = [];
				this.unlinkLog = [];
			}
			uninstall(names: string[]) {
				this.uninstallLog.push(names);
				for(const name of names) {
					delete mockfsContent.testdir.foo.node_modules[name];
					const rmPath = path.join(fixtureContents.path, "testdir", "foo", "node_modules", name);
					fs.rmSync(rmPath, {recursive: true});
				};
				return Promise.resolve();
			}
			unlink(names: string[]) {
				this.unlinkLog.push(names);
				for(const name of names) {
					delete mockfsContent.testdir.foo.node_modules[name];
					const rmPath = path.join(fixtureContents.path, "testdir", "foo", "node_modules", name);
					fs.rmSync(rmPath, {recursive: true});
				};
				return Promise.resolve();
			}
		}
		const dummyNpm = new DummyNpm();

		const requireResolve = vi.spyOn(cmn.Util, "requireResolve");
		requireResolve.mockImplementation((id: string, opts?: { paths?: string[] | undefined }) => {
			const pkgJsonPath = path.join(opts!.paths![0], "package.json");
			const pkgData =  JSON.parse(fs.readFileSync(pkgJsonPath).toString("utf-8"));
			const mainScriptName = pkgData.main.split(".").pop() === "js" ? pkgData.main : pkgData.main + ".js";
			return path.join(path.resolve("."), path.dirname(pkgJsonPath), mainScriptName);
		});

		const uninstallAndReadConfig = async (moduleNames: string[], unlink: boolean = false) => {
			await promiseUninstall({
				moduleNames,
				cwd: path.join(fixtureContents.path, "/testdir/foo/"),
				plugin: true,
				unlink,
				debugNpm: dummyNpm,
				logger
			});
			return cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(fixtureContents.path, "/testdir/foo/game.json"));
		};

		let content = await uninstallAndReadConfig(["foo"]);
		expect(dummyNpm.uninstallLog).toEqual([["foo"]]);
		expect(content.globalScripts).toEqual([
			"node_modules/buzz/main.js",
			"node_modules/buzz/sub/foo.js"
		]);
		expect(content.moduleMainScripts).toEqual({
			"buzz": "node_modules/buzz/main.js"
		});
		expect(content.moduleMainPaths).toEqual({
			"node_modules/buzz/package.json": "node_modules/buzz/main.js"
		});

		content = await uninstallAndReadConfig(["buzz"], true);
		expect(dummyNpm.unlinkLog).toEqual([["buzz"]]);
		expect(content.globalScripts).toEqual([]);
		expect(content.moduleMainScripts).toEqual({});
		expect(content.moduleMainPaths).toEqual({});
	});

	describe("removes external from conf", () => {
		const mockfsContent: any = {
			testdir: {
				foo: {
					node_modules: {
						foo: {
							lib: {
								"index.js": {},
								"sub.js": {}
							},
							"package.json": JSON.stringify({
								name: "foo",
								version: "0.0.0",
								dependencies: "bar",
								main: "lib/index.js"
							}),
							"akashic-lib.json": JSON.stringify({
								gameConfigurationData: {
									environment: {
										external: {
											"fooEx": "100"
										}
									}
								}
							})
						},
						buzz: {
							sub: {
								"foo.js": {}
							},
							"main.js": {},
							"package.json": JSON.stringify({
								name: "buzz",
								version: "0.0.0",
								dependencies: "sub",
								main: "main.js"
							}),
							"akashic-lib.json": JSON.stringify({
								gameConfigurationData: {
									environment: {
										external: {
											"buzzEx": "10000"
										}
									}
								}
							})
						}
					},
					"game.json": JSON.stringify({
						width: 10,
						height: 20,
						fps: 30,
						globalScripts: [
							"node_modules/foo/lib/index.js",
							"node_modules/foo/lib/sub.js",
							"node_modules/foo/node_modules/bar/index.js",
							"node_modules/buzz/main.js",
							"node_modules/buzz/sub/foo.js"
						],
						moduleMainScripts: {
							"foo": "node_modules/foo/index.js",
							"buzz": "node_modules/buzz/main.js"
						},
						moduleMainPaths: {
							"node_modules/foo/package.json": "node_modules/foo/index.js",
							"node_modules/buzz/package.json": "node_modules/buzz/main.js"
						},
						environment: {
							external: {
								"fooEx": "100",
								"buzzEx": "10000"
							}
						}
					})
				}
			}
		};

		interface DummyPromisedNpmParameterObject extends cmn.PromisedNpmParameterObject {
			fsContent: any;
		}
		class DummyNpm extends cmn.PromisedNpm {
			fsContent: any;
			constructor(param: DummyPromisedNpmParameterObject) {
				super(param);
				this.fsContent = param.fsContent;
			}
			uninstall(names: string[]) {
				for(const name of names) {
					delete this.fsContent.testdir.foo.node_modules[name];
					const rmPath = path.join(fixtureContents.path, "testdir", "foo", "node_modules", name);
					fs.rmSync(rmPath, {recursive: true});
				};
				return Promise.resolve();
			}
		}
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });

		it("with uninstall akashic-lib.json, gameConfigurationData, environment", async () => {
			const fsContent = JSON.parse(JSON.stringify(mockfsContent));
			fixtureContents = testUtil.prepareFsContent(mockfsContent, fs.mkdtempSync(baseDir));

			await promiseUninstall({
				moduleNames: ["foo"],
				cwd: path.join(fixtureContents.path, "/testdir/foo"),
				logger: logger,
				debugNpm: new DummyNpm({ logger, fsContent })
			});
			const content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(fixtureContents.path, "/testdir/foo", "game.json"));
			expect(content.environment!.external!.fooEx).toBeUndefined();
			expect(content.environment!.external!.buzzEx).toBe("10000");
		});

		it("with uninstall akashic-lib.json, gameConfigurationData", async () => {
			const fsContent = JSON.parse(JSON.stringify(mockfsContent));
			const fooAkashicLib = JSON.parse(fsContent.testdir.foo.node_modules.foo["akashic-lib.json"]);
			delete fooAkashicLib.gameConfigurationData.environment;
			fsContent.testdir.foo.node_modules.foo["akashic-lib.json"] = JSON.stringify(fooAkashicLib);
			fixtureContents = testUtil.prepareFsContent(fsContent, fs.mkdtempSync(baseDir));

			await promiseUninstall({
				moduleNames: ["foo"],
				cwd: path.join(fixtureContents.path, "/testdir/foo"),
				logger: logger,
				debugNpm: new DummyNpm({ logger, fsContent })
			});
			const content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(fixtureContents.path, "/testdir/foo", "game.json"));
			expect(content.environment!.external!.fooEx).toBe("100");
			expect(content.environment!.external!.buzzEx).toBe("10000");
		});

		it("without uninstall akashic-lib.json", async () => {
			const fsContent = JSON.parse(JSON.stringify(mockfsContent));
			delete fsContent.testdir.foo.node_modules.foo["akashic-lib.json"];
			fixtureContents = testUtil.prepareFsContent(fsContent, fs.mkdtempSync(baseDir));

			await promiseUninstall({
				moduleNames: ["foo"],
				cwd: path.join(fixtureContents.path, "/testdir/foo"),
				logger: logger,
				debugNpm: new DummyNpm({ logger, fsContent })
			});
			const content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(fixtureContents.path, "/testdir/foo", "game.json"));
			expect(content.environment!.external!.fooEx).toBe("100");
			expect(content.environment!.external!.buzzEx).toBe("10000");
		});
	});

	describe("does not remove remaining external", function () {
		const mockfsContent: any = {
			testdir: {
				foo: {
					node_modules: {
						foo: {
							lib: {
								"index.js": {},
								"sub.js": {}
							},
							"package.json": JSON.stringify({
								name: "foo",
								version: "0.0.0",
								dependencies: "bar",
								main: "lib/index.js"
							}),
							"akashic-lib.json": JSON.stringify({
								gameConfigurationData: {
									environment: {
										external: {
											"fooEx": "100"
										}
									}
								}
							})
						},
						buzz: {
							sub: {
								"foo.js": {}
							},
							"main.js": {},
							"package.json": JSON.stringify({
								name: "buzz",
								version: "0.0.0",
								dependencies: "sub",
								main: "main.js"
							}),
							"akashic-lib.json": JSON.stringify({
								gameConfigurationData: {
									environment: {
										external: {
											"fooEx": "100", // buzz also has fooEx external
											"buzzEx": "10000"
										}
									}
								}
							})
						}
					},
					"game.json": JSON.stringify({
						width: 10,
						height: 20,
						fps: 30,
						globalScripts: [
							"node_modules/foo/lib/index.js",
							"node_modules/foo/lib/sub.js",
							"node_modules/foo/node_modules/bar/index.js",
							"node_modules/buzz/main.js",
							"node_modules/buzz/sub/foo.js"
						],
						moduleMainScripts: {
							"foo": "node_modules/foo/index.js",
							"buzz": "node_modules/buzz/main.js"
						},
						moduleMainPaths: {
							"node_modules/foo/package.json": "node_modules/foo/index.js",
							"node_modules/buzz/package.json": "node_modules/buzz/main.js"
						},
						environment: {
							external: {
								"fooEx": "100",
								"buzzEx": "10000"
							}
						}
					})
				}
			}
		};

		interface DummyPromisedNpmParameterObject extends cmn.PromisedNpmParameterObject {
			fsContent: any;
		}
		class DummyNpm extends cmn.PromisedNpm {
			fsContent: any;
			constructor(param: DummyPromisedNpmParameterObject) {
				super(param);
				this.fsContent = param.fsContent;
			}
			uninstall(names: string[]) {
				for(const name of names) {
					delete this.fsContent.testdir.foo.node_modules[name];
					const rmPath = path.join(fixtureContents.path, "testdir", "foo", "node_modules", name);
				};
				return Promise.resolve();
			}
		}
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });

		it("with uninstall akashic-lib.json, gameConfigurationData, environment", async () => {
			const fsContent = JSON.parse(JSON.stringify(mockfsContent));
			fixtureContents = testUtil.prepareFsContent(fsContent, fs.mkdtempSync(baseDir));

			await promiseUninstall({
				moduleNames: ["foo"],
				cwd: path.join(fixtureContents.path, "/testdir/foo"),
				logger: logger,
				debugNpm: new DummyNpm({ logger, fsContent })
			});
			const content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(fixtureContents.path, "/testdir/foo", "game.json"));
			expect(content.environment!.external!.fooEx).toBe("100");
			expect(content.environment!.external!.buzzEx).toBe("10000");
		});

		
		it("with uninstall akashic-lib.json, gameConfigurationData", async () => {
			const fsContent = JSON.parse(JSON.stringify(mockfsContent));
			fixtureContents = testUtil.prepareFsContent(fsContent, fs.mkdtempSync(baseDir));

			await promiseUninstall({
				moduleNames: ["foo"],
				cwd: path.join(fixtureContents.path, "/testdir/foo"),
				logger: logger,
				debugNpm: new DummyNpm({ logger, fsContent })
			});
			const content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(fixtureContents.path, "/testdir/foo", "game.json"));
			expect(content.environment!.external!.fooEx).toBe("100");
			expect(content.environment!.external!.buzzEx).toBe("10000");
		});

		
		it("with uninstall akashic-lib.json", async () => {
			const fsContent = JSON.parse(JSON.stringify(mockfsContent));
			fixtureContents = testUtil.prepareFsContent(fsContent, fs.mkdtempSync(baseDir));

			await promiseUninstall({
				moduleNames: ["foo"],
				cwd: path.join(fixtureContents.path, "/testdir/foo"),
				logger: logger,
				debugNpm: new DummyNpm({ logger, fsContent })
			});
			const content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(fixtureContents.path, "/testdir/foo", "game.json"));
			expect(content.environment!.external!.fooEx).toBe("100");
			expect(content.environment!.external!.buzzEx).toBe("10000");
		});

		it("without uninstall akashic-lib.json", async () => {
			const fsContent = JSON.parse(JSON.stringify(mockfsContent));
			delete fsContent.testdir.foo["akashic-lib.json"];

			fixtureContents = testUtil.prepareFsContent(fsContent, fs.mkdtempSync(baseDir));

			await promiseUninstall({
				moduleNames: ["foo"],
				cwd: path.join(fixtureContents.path, "/testdir/foo"),
				logger: logger,
				debugNpm: new DummyNpm({ logger, fsContent })
			});
			const content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(fixtureContents.path, "./testdir/foo", "game.json"));
			expect(content.environment!.external!.fooEx).toBe("100");
			expect(content.environment!.external!.buzzEx).toBe("10000");
		});
	});

	describe("should remove the assets written akashic-lib.json", function () {
		const mockfsContent: any = {
			testdir: {
				node_modules: {
					"@akashic-extension": {
						"ui-library": {
							lib: {
								"index.js": "module.exports = {};"
							},
							"package.json": JSON.stringify({
								name: "@akashic-extension/ui-library",
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
					}
				},
				"game.json": JSON.stringify({
					width: 1280,
					height: 720,
					fps: 60,
					globalScripts: [
						"node_modules/@akashic-extension/ui-library/lib/index.js",
						"node_modules/@akashic-extension/audio-library/lib/index.js"
					],
					moduleMainScripts: {
						"@akashic-extension/ui-library": "@akashic-extension/ui-library/lib/index.js",
						"@akashic-extension/audio-library": "@akashic-extension/audio-library/lib/index.js"
					},
					moduleMainPaths: {
						"node_modules/@akashic-extension/ui-library/packate.json": "@akashic-extension/ui-library/lib/index.js",
						"node_modules/@akashic-extension/audio-library/packate.json": "@akashic-extension/audio-library/lib/index.js"
					},
					assets: {
						"node_modules/@akashic-extension/ui-library/assets/images/player.png": {
							type: "image",
							path: "assets/images/player.png",
							width: 100,
							height: 120
						},
						"node_modules/@akashic-extension/ui-library/assets/images/enemy.png":{
							type: "image",
							path: "assets/images/enemy.png",
							width: 100,
							height: 120
						},
						"node_modules/@akashic-extension/ui-library/assets/audios/se_1": {
							type: "audio",
							path: "assets/audios/se_1",
							systemId: "sound",
							duration: 1270
						},
						"node_modules/@akashic-extension/audio-library/assets/audios/bgm_1": {
							type: "audio",
							path: "assets/audios/bgm_1",
							systemId: "music",
							duration: 15364
						},
						"node_modules/@akashic-extension/audio-library/assets/audios/bgm_2": {
							type: "audio",
							path: "assets/audios/bgm_2",
							systemId: "music",
							duration: 32412
						},
						"node_modules/@akashic-extension/audio-library/assets/audios/bgm_3": {
							type: "audio",
							path: "assets/audios/bgm_3",
							systemId: "music",
							duration: 51214
						}
					}
				})
			}
		};

		interface DummyPromisedNpmParameterObject extends cmn.PromisedNpmParameterObject {
			fsContent: any;
		}
		class DummyNpm extends cmn.PromisedNpm {
			fsContent: any;
			constructor(param: DummyPromisedNpmParameterObject) {
				super(param);
				this.fsContent = param.fsContent;
			}
			uninstall = async (names: string[]) => {
				for(const name of names) {
					delete this.fsContent.testdir.node_modules[name];
					const rmPath = path.join(fixtureContents.path, "testdir", "node_modules", name);
					fs.rmSync(rmPath, {recursive: true});
				};
			}
		}
		const logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });

		it("should remove the assets when uninstalled module with akashic-lib.json", async () => {
			const fsContent = JSON.parse(JSON.stringify(mockfsContent));
			fixtureContents = testUtil.prepareFsContent(fsContent, fs.mkdtempSync(baseDir));

			await promiseUninstall({
				moduleNames: ["@akashic-extension/ui-library"],
				cwd: path.join(fixtureContents.path, "testdir"),
				logger,
				debugNpm: new DummyNpm({ logger, fsContent })
			});
			const content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(fixtureContents.path, "/testdir", "game.json"));
			expect(Object.keys(content.assets).length).toBe(3);
			expect(content.assets["node_modules/@akashic-extension/ui-library/assets/images/player.png"]).toBeUndefined();
			expect(content.assets["node_modules/@akashic-extension/ui-library/assets/images/enemy.png"]).toBeUndefined();
			expect(content.assets["node_modules/@akashic-extension/ui-library/assets/images/se_1"]).toBeUndefined();
			expect(content.assets["node_modules/@akashic-extension/audio-library/assets/audios/bgm_1"]).toBeDefined();
			expect(content.assets["node_modules/@akashic-extension/audio-library/assets/audios/bgm_2"]).toBeDefined();
			expect(content.assets["node_modules/@akashic-extension/audio-library/assets/audios/bgm_3"]).toBeDefined();
		});

		it("should remove the assets when uninstalled multiple modules with akashic-lib.json", async () => {
			const fsContent = JSON.parse(JSON.stringify(mockfsContent));
			fixtureContents = testUtil.prepareFsContent(fsContent, fs.mkdtempSync(baseDir));

			await promiseUninstall({
				moduleNames: ["@akashic-extension/ui-library", "@akashic-extension/audio-library"],
				cwd: path.join(fixtureContents.path, "testdir"),
				logger,
				debugNpm: new DummyNpm({ logger, fsContent })
			});
			const content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(fixtureContents.path,  "/testdir", "game.json"));
			expect(Object.keys(content.assets).length).toBe(0);
			expect(content.assets["node_modules/@akashic-extension/ui-library/assets/images/player.png"]).toBeUndefined();
			expect(content.assets["node_modules/@akashic-extension/ui-library/assets/images/enemy.png"]).toBeUndefined();
			expect(content.assets["node_modules/@akashic-extension/ui-library/assets/images/se_1"]).toBeUndefined();
			expect(content.assets["node_modules/@akashic-extension/audio-library/assets/audios/bgm_1"]).toBeUndefined();
			expect(content.assets["node_modules/@akashic-extension/audio-library/assets/audios/bgm_2"]).toBeUndefined();
			expect(content.assets["node_modules/@akashic-extension/audio-library/assets/audios/bgm_3"]).toBeUndefined();
		});
	});
});
