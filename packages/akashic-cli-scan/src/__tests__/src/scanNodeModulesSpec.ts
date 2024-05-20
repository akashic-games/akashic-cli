import * as fs from "fs";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import * as mockfs from "mock-fs";
import { scanNodeModules } from "../../../lib/scanNodeModules";
import { Util } from "@akashic/akashic-cli-commons";
import { MockPromisedNpm } from "./helpers/MockPromisedNpm";

describe("scanNodeModules", () => {
	const nullLogger = new ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
	let spy: jest.SpyInstance;
	let fsSpy: jest.SpyInstance;
	beforeAll(() => {
		spy = jest.spyOn(Util, "requireResolve").mockImplementation((id: string, opts: { paths?: string[] | undefined }): string => {
			const pkgJsonPath = path.join(opts.paths[0], "package.json");
			const pkgData =  JSON.parse(fs.readFileSync(pkgJsonPath).toString("utf-8"));
			if (!pkgData.name) return "";
			const mainScriptName = pkgData.main.split(".").pop() === "js" ? pkgData.main : pkgData.main + ".js";
			return path.join(path.resolve("."), path.dirname(pkgJsonPath), mainScriptName);
		});
		// node@20 で mock-fs 利用時に fs.existsSync() が機能していないため、spy で statSync() で存在判定をしている。
		fsSpy = jest.spyOn(fs, "existsSync").mockImplementation((path: fs.PathLike): boolean => {
			try { 
				return !!fs.statSync(path);
			} catch (e) {
				return false;
			}
		});
	});
	afterEach(() => {
		mockfs.restore();
	});
	afterAll(() => {
		spy.mockClear();
		fsSpy.mockClear()
	});

	it("scan globalScripts field based on node_modules/", async () => {
		mockfs({
			"game.json": "{}",
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
		});

		await scanNodeModules({
			logger: nullLogger,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {
						dependencies: { "dummyChild": {} }
					},
					"dummy2": {}
				}
			})
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		const globalScripts = conf.globalScripts;
		const moduleMainScripts = conf.moduleMainScripts;
		const moduleMainPaths = conf.moduleMainPaths;

		const expectedPaths = [
			"node_modules/dummy/main.js",
			"node_modules/dummy/foo.js",
			"node_modules/dummy/node_modules/dummyChild/index.js",
			"node_modules/dummy2/index.js",
			"node_modules/dummy2/sub.js"
		];
		expect(globalScripts.length).toBe(expectedPaths.length);

		for (const expectedPath of expectedPaths) {
			expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
		}

		expect(moduleMainScripts).toEqual({
			"dummy": "node_modules/dummy/main.js"
		});
		expect(moduleMainPaths).toBeUndefined();
	});

	it("scan globalScripts field based on node_modules/ with npm3(flatten)", async () => {
		mockfs({
			"game.json": "{}",
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
					"foo.js": "module.exports = 1;"
				},
				"dummy2": {
					"index.js": "require('./sub')",
					"sub.js": "",
				},
				"dummyChild": {
					"index.js": "module.exports = 'dummyChild';"
				}
			}
		});

		await scanNodeModules({
			logger: nullLogger,
			useMmp: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {
						dependencies: { "dummyChild": {} }
					},
					"dummy2": {}
				}
			})
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		const globalScripts = conf.globalScripts;
		const moduleMainScripts = conf.moduleMainScripts;
		const moduleMainPaths = conf.moduleMainPaths;

		const expectedPaths = [
			"node_modules/dummy/main.js",
			"node_modules/dummy/foo.js",
			"node_modules/dummyChild/index.js",
			"node_modules/dummy2/index.js",
			"node_modules/dummy2/sub.js"
		];
		expect(globalScripts.length).toBe(expectedPaths.length);

		for (const expectedPath of expectedPaths) {
			expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
		}

		expect(moduleMainScripts).toBeUndefined();
		expect(moduleMainPaths).toEqual({
			"node_modules/dummy/package.json": "node_modules/dummy/main.js"
		});
	});

	it("scan globalScripts field based on node_modules/ with @scope", async () => {
		mockfs({
			"game.json": "{}",
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
				},
				".bin": {
					"shouldBeIgnored.js": ""
				},
				"@scope": {
					"scoped": {
						"package.json": JSON.stringify({
							name: "dummy",
							version: "0.0.0",
							main: "root.js",
						}),
						"root.js": "require('./lib/nonroot.js');",
						"lib": {
							"nonroot.js": "",
						}
					}
				}
			}
		});

		await scanNodeModules({
			logger: nullLogger,
			useMmp: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: { "dummy": {}, "dummy2": {}, "@scope/scoped": {} }
			})
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		const globalScripts = conf.globalScripts;
		const moduleMainScripts = conf.moduleMainScripts;
		const moduleMainPaths = conf.moduleMainPaths;

		const expectedPaths = [
			"node_modules/dummy/main.js",
			"node_modules/dummy/foo.js",
			"node_modules/dummy/node_modules/dummyChild/index.js",
			"node_modules/dummy2/index.js",
			"node_modules/dummy2/sub.js",
			"node_modules/@scope/scoped/root.js",
			"node_modules/@scope/scoped/lib/nonroot.js"
		];
		expect(globalScripts.length).toBe(expectedPaths.length);

		for (const expectedPath of expectedPaths) {
			expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
		}

		expect(moduleMainScripts).toBeUndefined();
		expect(moduleMainPaths).toEqual({
			"node_modules/dummy/package.json": "node_modules/dummy/main.js",
			"node_modules/@scope/scoped/package.json": "node_modules/@scope/scoped/root.js"
		});
	});

	it("scan globalScripts If main in package.json has no extension", async () => {
		mockfs({
			"game.json": "{}",
			"node_modules": {
				"dummy": {
					"package.json": JSON.stringify({
						name: "dummy",
						version: "0.0.0",
						main: "noExtension",
						dependencies: { "dummyChild": "*" }
					}),
					"noExtension.js": [
						"require('./foo');",
						"require('dummyChild');",
					].join("\n"),
					"foo.js": "module.exports = 1;",
					"node_modules": {
						"dummyChild": {
							"index.js": "module.exports = 'dummyChild';"
						}
					}
				}
			}
		});

		await scanNodeModules({
			logger: nullLogger,
			useMmp: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {
						dependencies: { "dummyChild": {} }
					}
				}
			})
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		const globalScripts = conf.globalScripts;
		const moduleMainScripts = conf.moduleMainScripts;
		const moduleMainPaths = conf.moduleMainPaths;

		const expectedPaths = [
			"node_modules/dummy/noExtension.js",
			"node_modules/dummy/foo.js",
			"node_modules/dummy/node_modules/dummyChild/index.js",
		];
		expect(globalScripts.length).toBe(expectedPaths.length);

		expect(moduleMainScripts).toBeUndefined();
		expect(moduleMainPaths).toEqual({
			"node_modules/dummy/package.json": "node_modules/dummy/noExtension.js"
		});
	});

	it("scan globalScripts empty node_modules/", async () => {
		mockfs({
			"game.json": "{}",
			"node_modules": {}
		});

		await scanNodeModules({
			logger: nullLogger,
			useMmp: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {}
			})
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		const globalScripts = conf.globalScripts;
		const moduleMainScripts = conf.moduleMainScripts;
		const moduleMainPaths = conf.moduleMainPaths;
		expect(globalScripts.length).toBe(0);

		const expectedPaths: string[] = [];
		for (const expectedPath of expectedPaths) {
			expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
		}

		expect(moduleMainScripts).toBeUndefined();
		expect(moduleMainPaths).toBeUndefined();
	});

	it("scan globalScripts field based on node_modules/, multiple versions in dependencies and devDependencies", async () => {
		let mockFsContent: { [key: string]: any } = {
			"game.json": "{}",
			"node_modules": {
				"dummy": {
					"package.json": JSON.stringify({
						name: "dummy",
						version: "0.0.0",
						main: "main.js",
						dependencies: { "dummyChild": "1.0.0" }
					}),
					"main.js": [
						"require('./foo');",
						"require('dummyChild');",
					].join("\n"),
					"foo.js": "module.exports = 1;",
					"node_modules": {
						"dummyChild": {
							"package.json": JSON.stringify({
								name: "dummyChild",
								version: "1.0.0",
								main: "index.js",
							}),
							"index.js": "module.exports = 'dummyChild';"
						}
					}
				},
				"dummy2": {
					"index.js": "require('./sub')",
					"sub.js": "",
				},
				"devDummy": {
					"package.json": JSON.stringify({
						name: "devDummy",
						version: "0.0.0",
						main: "main.js",
						dependencies: { "dummyChild": "2.0.0" }
					}),
					"main.js": [
						"require('./foo');",
						"require('dummyChild');",
					].join("\n"),
					"foo.js": "module.exports = 1;",
					"node_modules": {
					}
				},
				"dummyChild": {
					"package.json": JSON.stringify({
						name: "dummyChild",
						version: "2.0.0",
						main: "main.js",
					}),
					"main.js": "module.exports = 'dummyChild';"
				}
			}
		};
		mockfs(mockFsContent);

		await scanNodeModules({
			logger: nullLogger,
			useMmp: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {
						dependencies: { "dummyChild": {} }
					},
					"dummy2": {}
				}
			})
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		let globalScripts = conf.globalScripts;
		let moduleMainScripts = conf.moduleMainScripts;
		let moduleMainPaths = conf.moduleMainPaths;

		let expectedPaths = [
			"node_modules/dummy/main.js",
			"node_modules/dummy/foo.js",
			"node_modules/dummy/node_modules/dummyChild/index.js",
			"node_modules/dummy2/index.js",
			"node_modules/dummy2/sub.js"
		];
		expect(globalScripts.length).toBe(expectedPaths.length);

		for (const expectedPath of expectedPaths) {
			expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
		}

		expect(moduleMainScripts).toBeUndefined();
		expect(moduleMainPaths).toEqual({
			"node_modules/dummy/package.json": "node_modules/dummy/main.js",
			"node_modules/dummy/node_modules/dummyChild/package.json": "node_modules/dummy/node_modules/dummyChild/index.js"
		});

		// nodeModules/dummyChild と modeModules/dummy/nodeModules/dummyChildを入れ替える
		delete mockFsContent.node_modules.dummy.node_modules.dummyChild;
		mockFsContent.node_modules.dummyChild = {
			"package.json": JSON.stringify({
				name: "dummyChild",
				version: "1.0.0",
				main: "index.js",
			}),
			"index.js": "module.exports = 'dummyChild';"
		};

		mockFsContent.node_modules.devDummy.node_modules = {
			"dummyChild": {
				"package.json": JSON.stringify({
					name: "dummyChild",
					version: "2.0.0",
					main: "main.js",
				}),
				"main.js": "module.exports = 'dummyChild';"
			}
		};

		mockfs(mockFsContent);

		await scanNodeModules({
			logger: nullLogger,
			useMmp: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {
						dependencies: { "dummyChild": {} }
					},
					"dummy2": {}
				}
			})
		});

		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		globalScripts = conf.globalScripts;
		moduleMainScripts = conf.moduleMainScripts;
		moduleMainPaths = conf.moduleMainPaths;

		expectedPaths = [
			"node_modules/dummy/main.js",
			"node_modules/dummy/foo.js",
			"node_modules/dummyChild/index.js",
			"node_modules/dummy2/index.js",
			"node_modules/dummy2/sub.js"
		];
		expect(globalScripts.length).toBe(expectedPaths.length);

		for (const expectedPath of expectedPaths) {
			expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
		}

		expect(moduleMainScripts).toBeUndefined();
		expect(moduleMainPaths).toEqual({
			"node_modules/dummy/package.json": "node_modules/dummy/main.js",
			"node_modules/dummyChild/package.json": "node_modules/dummyChild/index.js"
		});
	});

	it("scan invalid package.json - no name", async () => {
		mockfs({
			"game.json": "{}",
			"node_modules": {
				"invalidDummy": {
					"package.json": JSON.stringify({
						// no name
						version: "0.0.0",
						main: "main.js"
					}),
					"main.js": [
						"require('./foo');"
					].join("\n"),
					"foo.js": "module.exports = 1;"
				}
			}
		});

		await scanNodeModules({
			logger: nullLogger,
			useMmp: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"invalidDummy": {}
				}
			})
		});

		const conf = JSON.parse(fs.readFileSync("./game.json").toString());
		const globalScripts = conf.globalScripts;
		const moduleMainScripts = conf.moduleMainScripts;
		const moduleMainPaths = conf.moduleMainPaths;

		const expectedPaths = [
			"node_modules/invalidDummy/main.js",
			"node_modules/invalidDummy/foo.js"
		];
		expect(globalScripts.length).toBe(expectedPaths.length);

		for (const expectedPath of expectedPaths) {
			expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
		}

		expect(moduleMainScripts).toBeUndefined();
		expect(moduleMainPaths).toEqual({});
	});

	it("scan all moduleMainScripts", async () => {
		mockfs({
			"game.json": "{}",
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
							"package.json": JSON.stringify({
								name: "dummyChild",
								version: "0.0.0",
								main: "index.js",
								dependencies: { "dummy2": "*" }
							}),
							"index.js": "module.exports = 'dummyChild';"
						}
					}
				},
				"dummy2": {
					"package.json": JSON.stringify({
						name: "dummy2",
						version: "0.0.0",
						main: "index.js",
						dependencies: { "@scope/scoped": "*" }
					}),
					"index.js": "require('./sub')",
					"sub.js": "",
				},
				".bin": {
					"shouldBeIgnored.js": ""
				},
				"@scope": {
					"scoped": {
						"package.json": JSON.stringify({
							name: "@scope/scoped",
							version: "0.0.0",
							main: "root.js",
						}),
						"root.js": "require('./lib/nonroot.js');",
						"lib": {
							"nonroot.js": "",
						}
					}
				}
			}
		});

		await scanNodeModules({
			logger: nullLogger,
			useMmp: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {}, "dummy2": {}, "@scope/scoped": {}
				}
			})
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		let globalScripts = conf.globalScripts;
		let moduleMainScripts = conf.moduleMainScripts;
		let moduleMainPaths = conf.moduleMainPaths;

		let expectedPaths = [
			"node_modules/dummy/main.js",
			"node_modules/dummy/foo.js",
			"node_modules/dummy/node_modules/dummyChild/index.js",
			"node_modules/dummy2/index.js",
			"node_modules/dummy2/sub.js",
			"node_modules/@scope/scoped/root.js",
			"node_modules/@scope/scoped/lib/nonroot.js"
		];
		expect(globalScripts.length).toBe(expectedPaths.length);

		for (const expectedPath of expectedPaths) {
			expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
		}

		expect(moduleMainScripts).toBeUndefined();
		expect(moduleMainPaths).toEqual({
			"node_modules/dummy/package.json": "node_modules/dummy/main.js",
			"node_modules/dummy/node_modules/dummyChild/package.json": "node_modules/dummy/node_modules/dummyChild/index.js",
			"node_modules/dummy2/package.json": "node_modules/dummy2/index.js",
			"node_modules/@scope/scoped/package.json": "node_modules/@scope/scoped/root.js"
		});
	});

	it("scan globalScripts: given --no-omit-packagejson property", async () => {
		mockfs({
			"game.json": "{}",
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
							"package.json": JSON.stringify({
								name: "dummyChild",
								version: "0.0.0",
								main: "index.js",
								dependencies: { "dummy2": "*" }
							}),
							"index.js": "module.exports = 'dummyChild';"
						}
					}
				},
				"dummy2": {
					"package.json": JSON.stringify({
						name: "dummy2",
						version: "0.0.0",
						main: "index.js",
						dependencies: { "@scope/scoped": "*" }
					}),
					"index.js": "require('./sub')",
					"sub.js": "",
				},
				".bin": {
					"shouldBeIgnored.js": ""
				},
				"@scope": {
					"scoped": {
						"package.json": JSON.stringify({
							name: "@scope/scoped",
							version: "0.0.0",
							main: "root.js",
						}),
						"root.js": "require('./lib/nonroot.js');",
						"lib": {
							"nonroot.js": "",
						}
					}
				}
			}
		});

		await scanNodeModules({
			logger: nullLogger,
			useMmp: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {}, "dummy2": {}, "@scope/scoped": {}
				}
			}),
			noOmitPackagejson: true
		});

		const conf = JSON.parse(fs.readFileSync("./game.json").toString());
		const globalScripts = conf.globalScripts;
		const moduleMainScripts = conf.moduleMainScripts;
		const moduleMainPaths = conf.moduleMainPaths;

		const expectedPaths = [
			"node_modules/dummy/main.js",
			"node_modules/dummy/foo.js",
			"node_modules/dummy/node_modules/dummyChild/index.js",
			"node_modules/dummy2/index.js",
			"node_modules/dummy2/sub.js",
			"node_modules/@scope/scoped/root.js",
			"node_modules/@scope/scoped/lib/nonroot.js",
			"node_modules/@scope/scoped/package.json",
			"node_modules/dummy2/package.json",
			"node_modules/dummy/package.json",
			"node_modules/dummy/node_modules/dummyChild/package.json"
		];
		expect(globalScripts.length).toBe(expectedPaths.length);

		for (const expectedPath of expectedPaths) {
			expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
		}

		expect(moduleMainScripts).toBeUndefined();
		expect(moduleMainPaths).toEqual({
			"node_modules/dummy/package.json": "node_modules/dummy/main.js",
			"node_modules/dummy/node_modules/dummyChild/package.json": "node_modules/dummy/node_modules/dummyChild/index.js",
			"node_modules/dummy2/package.json": "node_modules/dummy2/index.js",
			"node_modules/@scope/scoped/package.json": "node_modules/@scope/scoped/root.js"
		});
	});


	it("scans globalScripts from the entry point script", async () => {
		mockfs({
			"game.json": JSON.stringify({
				main: "./script/main.js",
				assets: {
					main: {
						type: "script",
						path: "script/main.js",
						global: true
					},
					anAsset: {
						type: "script",
						path: "script/subdir/anAsset.js",
						global: true
					}
				}
			}),
			"script": {
				"main.js": [
					"require('dummy2/sub');",
					"require('./subdir/anAsset');"
				].join("\n"),
				"subdir": {
					"anAsset.js": [
						"require('dummyChild');"
					].join("\n")
				}
			},
			"node_modules": {
				"dummy": {
					"package.json": JSON.stringify({
						name: "dummy",
						version: "0.0.0",
						main: "main.js",
						dependencies: { "dummyChild": "1.0.0" }
					}),
					"main.js": [
						"require('./foo');",
						"require('dummyChild');",
					].join("\n"),
					"foo.js": "module.exports = 1;",
					"node_modules": {
						"dummyChild": {
							"package.json": JSON.stringify({
								name: "dummyChild",
								version: "1.0.0",
								main: "index.js",
							}),
							"index.js": "module.exports = 'dummyChild';"
						}
					}
				},
				"dummy2": {
					"index.js": "require('./sub')",
					"sub.js": "",
				},
				"devDummy": {
					"package.json": JSON.stringify({
						name: "devDummy",
						version: "0.0.0",
						main: "main.js",
						dependencies: { "dummyChild": "2.0.0" }
					}),
					"main.js": [
						"require('./foo');",
						"require('dummyChild');",
					].join("\n"),
					"foo.js": "module.exports = 1;",
					"node_modules": {
					}
				},
				"dummyChild": {
					"package.json": JSON.stringify({
						name: "dummyChild",
						version: "2.0.0",
						main: "main.js",
					}),
					"main.js": "module.exports = 'dummyChild';"
				}
			}
		});

		await scanNodeModules({
			logger: nullLogger,
			useMmp: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {
						dependencies: { "dummyChild": {} }
					},
					"dummy2": {}
				}
			}),
			fromEntryPoint: true
		});

		const conf = JSON.parse(fs.readFileSync("./game.json").toString());
		const globalScripts = conf.globalScripts;
		const moduleMainScripts = conf.moduleMainScripts;
		const moduleMainPaths = conf.moduleMainPaths;

		const expectedPaths = [
			"node_modules/dummyChild/main.js",
			"node_modules/dummy2/sub.js"
		];
		expect(globalScripts.length).toBe(expectedPaths.length);

		for (const expectedPath of expectedPaths) {
			expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
		}

		expect(moduleMainScripts).toBeUndefined();
		expect(moduleMainPaths).toEqual({
			"node_modules/dummyChild/package.json": "node_modules/dummyChild/main.js"
		});
	});

	it("doesn't delete registered and existing globalScripts when scan globalScripts again", async () => {
		mockfs({
			"game.json": JSON.stringify({
				main: "./script/main.js",
				assets: {
					main: {
						type: "script",
						path: "script/main.js",
						global: true
					},
					anAsset: {
						type: "script",
						path: "script/subdir/anAsset.js",
						global: true
					}
				},
				globalScripts: [
					"node_modules/dummy/main.js",
					"node_modules/dummy/non-required-from-module-root.js",
					"node_modules/dummy/non-exist.js"
				],
				moduleMainScripts: {
					"dummy": "node_modules/dummy/main.js"
				}
			}),
			"script": {
				"main.js": [
					"require('dummy2/sub');",
				].join("\n")
			},
			"node_modules": {
				"dummy": {
					"package.json": JSON.stringify({
						name: "dummy",
						version: "0.0.0",
						main: "main.js",
						dependencies: { "dummyChild": "1.0.0" }
					}),
					"main.js": [
						"require('./foo');",
						"require('dummyChild');",
					].join("\n"),
					"foo.js": "module.exports = 1;",
					"non-required-from-module-root.js": "module.exports = 2;",
					"node_modules": {
						"dummyChild": {
							"package.json": JSON.stringify({
								name: "dummyChild",
								version: "1.0.0",
								main: "index.js",
							}),
							"index.js": "module.exports = 'dummyChild';"
						}
					}
				},
				"dummy2": {
					"index.js": "require('./sub')",
					"sub.js": "",
				}
			}
		});

		await scanNodeModules({
			logger: nullLogger,
			useMmp: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {
						dependencies: { "dummyChild": {} }
					},
					"dummy2": {}
				}
			})
		});

		const conf = JSON.parse(fs.readFileSync("./game.json").toString());
		const globalScripts = conf.globalScripts;
		const moduleMainScripts = conf.moduleMainScripts;
		const moduleMainPaths = conf.moduleMainPaths;

		const expectedPaths = [
			"node_modules/dummy/foo.js",
			"node_modules/dummy/main.js",
			"node_modules/dummy/node_modules/dummyChild/index.js",
			"node_modules/dummy/non-required-from-module-root.js",
			"node_modules/dummy2/index.js",
			"node_modules/dummy2/sub.js",
		];
		expect(globalScripts).toEqual(expectedPaths);

		expect(moduleMainScripts).toBeUndefined();
		expect(moduleMainPaths).toEqual({
			"node_modules/dummy/package.json": "node_modules/dummy/main.js",
			"node_modules/dummy/node_modules/dummyChild/package.json": "node_modules/dummy/node_modules/dummyChild/index.js",
		});
	});

	it("doesn't output warning message when moduleMainScript exist in game.json", async () => {
		mockfs({
			"game.json": JSON.stringify({
				assets: {
				},
				globalScripts: [
					"node_modules/dummy/main.js"
				],
				moduleMainScripts: {
					"dummy": "node_modules/dummy/main.js"
				}
			}),
			"node_modules": {
				"dummy": {
					"package.json": JSON.stringify({
						name: "dummy",
						version: "0.0.0",
						main: "main.js"
					}),
					"main.js": [
						"module.exports = 1;"
					].join("\n")
				}
			}
		});

		const warnLogs: string[] = [];
		class Logger extends ConsoleLogger {
			info(message: any) {
				// do nothing
			}
			warn(message: any) {
				warnLogs.push(message);
			}
		}
		const logger = new Logger();

		await scanNodeModules({
			logger,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {}
				}
			})
		});

		expect(warnLogs.length).toBe(0);
	});

	it("output warning message when moduleMainScript doesn't existed in game.json", async () => {
		mockfs({
			"game.json": JSON.stringify({
				assets: {
				},
				globalScripts: [
					"node_modules/dummy/main.js",
					"node_modules/dummy/package.json"
				]
			}),
			"node_modules": {
				"dummy": {
					"package.json": JSON.stringify({
						name: "dummy",
						version: "0.0.0",
						main: "main.js"
					}),
					"main.js": [
						"module.exports = 1;"
					].join("\n")
				}
			}
		});

		const warnLogs: string[] = [];
		class Logger extends ConsoleLogger {
			info(message: any) {
				// do nothing
			}
			warn(message: any) {
				warnLogs.push(message);
			}
		}
		const logger = new Logger();

		await scanNodeModules({
			logger,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {}
				}
			})
		});

		expect(warnLogs.length).toBe(1);
		expect(warnLogs[0]).toBe(
			"Newly added the moduleMainScripts property to game.json." +
			"This property, introduced by akashic-cli@>=1.12.2, is NOT supported by older versions of Akashic Engine." +
			"Please ensure that you are using akashic-engine@>=2.0.2, >=1.12.7."
		);
	});
});
