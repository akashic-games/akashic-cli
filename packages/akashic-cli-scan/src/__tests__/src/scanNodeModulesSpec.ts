import * as fs from "fs";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger.js";
import mockfs from "mock-fs";
import { MockInstance, vi } from "vitest";
import { scanNodeModules } from "../../scanNodeModules.js";
import { Util } from "@akashic/akashic-cli-commons";
import { MockPromisedNpm } from "./helpers/MockPromisedNpm.js";
import { ScanNodeModulesParameterObject } from "../../scanNodeModules.js";

describe("scanNodeModules", () => {
	const nullLogger = new ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
	let requireResolve: MockInstance;

	beforeAll(() => {
		requireResolve = vi.spyOn(Util, "requireResolve");
		requireResolve.mockImplementation((id: string, opts?: { paths?: string[] | undefined }) => {
			const pkgJsonPath = path.join(opts!.paths![0], "package.json");
			const pkgData = JSON.parse(fs.readFileSync(pkgJsonPath).toString("utf-8"));
			if (!pkgData.name) return "";
			const mainScriptName = pkgData.main.split(".").pop() === "js" ? pkgData.main : pkgData.main + ".js";
			return path.join(path.resolve("."), path.dirname(pkgJsonPath), mainScriptName);
		});
	});
	afterEach(() => {
		mockfs.restore();
	});
	afterAll(() => {
		requireResolve.mockClear();
	});

	describe("scan globalScripts field based on node_modules/", () => {
		const prepareMock = (gamejson: object) => {
			mockfs({
				"game.json": JSON.stringify(gamejson),
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
		};

		const scan = async (param?: ScanNodeModulesParameterObject) => {
			return scanNodeModules({
				logger: nullLogger,
				debugNpm: new MockPromisedNpm({
					expectDependencies: {
						"dummy": {
							dependencies: { "dummyChild": {} }
						},
						"dummy2": {}
					}
				}),
				...param,
			});
		};

		const readConfig = () => JSON.parse(fs.readFileSync("./game.json").toString());

		const expectedPaths = [
			"node_modules/dummy/main.js",
			"node_modules/dummy/foo.js",
			"node_modules/dummy/node_modules/dummyChild/index.js",
			"node_modules/dummy2/index.js",
			"node_modules/dummy2/sub.js"
		];

		const assertGlobalScripts = (conf: any) => {
			const globalScripts = conf.globalScripts;
			expect(conf.globalScripts.length).toBe(expectedPaths.length);
			for (const expectedPath of expectedPaths) {
				expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
			}
		};

		const assertModuleMainScripts = (conf: any) => {
			const moduleMainScripts = conf.moduleMainScripts;
			expect(moduleMainScripts).toEqual({
				"dummy": "node_modules/dummy/main.js"
			});
		};

		const assertModuleMainPaths = (conf: any) => {
			const moduleMainPaths = conf.moduleMainPaths;
			expect(moduleMainPaths).toEqual({
				"node_modules/dummy/package.json": "node_modules/dummy/main.js"
			});
		};

		test.each(["1", "2", undefined])("should be used `moduleMainScripts` if `sandbox-runtime` is `%s`", async sandboxRuntime => {
			prepareMock({ environment: { "sandbox-runtime": sandboxRuntime } });
			await scan({ useMmp: true });
			const conf = readConfig();
			assertGlobalScripts(conf);
			assertModuleMainScripts(conf);
			expect(conf.moduleMainPaths).toBeUndefined();
		});

		test("should be used `moduleMainPaths` and be removed `moduleMainScripts` if `useMmp` is specified", async () => {
			prepareMock({
				moduleMainPaths: {},
				moduleMainScripts: {},
				environment: { "sandbox-runtime": "3" },
			});
			await scan({ useMmp: true });
			const conf = readConfig();
			assertGlobalScripts(conf);
			assertModuleMainPaths(conf);
			expect(conf.moduleMainScripts).toBeUndefined();
		});

		test("should be used `moduleMainScripts` and be removed `moduleMainPaths` if `useMms` is specified", async () => {
			prepareMock({
				moduleMainPaths: {},
				moduleMainScripts: {},
				environment: { "sandbox-runtime": "3" },
			});
			await scan({ useMms: true });
			const conf = readConfig();
			assertGlobalScripts(conf);
			assertModuleMainScripts(conf);
			expect(conf.moduleMainPaths).toBeUndefined();
		});

		test("should be used `moduleMainPaths` and be removed `moduleMainScripts` if `moduleMainPaths` exists", async () => {
			prepareMock({
				moduleMainPaths: {},
				moduleMainScripts: {},
				environment: { "sandbox-runtime": "3" },
			});
			await scan();
			const conf = readConfig();
			assertGlobalScripts(conf);
			assertModuleMainPaths(conf);
			expect(conf.moduleMainScripts).toBeUndefined();
		});

		test("should be used `moduleMainScripts` if only `moduleMainScripts` exists", async () => {
			prepareMock({
				moduleMainScripts: {},
				environment: { "sandbox-runtime": "3" },
			});
			await scan();
			const conf = readConfig();
			assertGlobalScripts(conf);
			assertModuleMainScripts(conf);
			expect(conf.moduleMainPaths).toBeUndefined();
		});

		test("should be used `moduleMainScripts` if neither `moduleMainPaths` nor `moduleMainScripts` exist", async () => {
			prepareMock({
				environment: { "sandbox-runtime": "3" },
			});
			await scan();
			const conf = readConfig();
			assertGlobalScripts(conf);
			assertModuleMainScripts(conf);
			expect(conf.moduleMainPaths).toBeUndefined();
		});
	});

	it("scan globalScripts field based on node_modules/ with npm3(flatten)", async () => {
		mockfs({
			"game.json": `{ "environment": { "sandbox-runtime": "3" } }`,
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
			"game.json": `{ "environment": { "sandbox-runtime": "3" } }`,
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
			"game.json": `{ "environment": { "sandbox-runtime": "3" } }`,
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
			"game.json": `{ "environment": { "sandbox-runtime": "3" } }`,
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
			"game.json": `{ "environment": { "sandbox-runtime": "3" } }`,
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
			"game.json": `{ "environment": { "sandbox-runtime": "3" } }`,
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
			"game.json": `{ "environment": { "sandbox-runtime": "3" } }`,
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
			"game.json": `{ "environment": { "sandbox-runtime": "3" } }`,
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
			omitPackagejson: false
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
				},
				environment: {
					"sandbox-runtime": "3"
				},
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
				},
				environment: {
					"sandbox-runtime": "3"
				},
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
				},
				environment: {
					"sandbox-runtime": "3"
				},
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

	it("apply gameConfigurationData from akashic-lib.json to game.json", async () => {
		mockfs({
			"game.json": JSON.stringify({
				assets: {},
				globalScripts: [],
				environment: {
					"sandbox-runtime": 3,
				}
			}),
			"node_modules": {
				"foo": {
					"package.json": JSON.stringify({
						name: "foo",
						version: "1.0.0",
						main: "index.js"
					}),
					"index.js": "module.exports = 1;",
					"akashic-lib.json": JSON.stringify({
						gameConfigurationData: {
							"environment": {
								"external": {
									"fooPlugin": "0"
								}
							}
						}
					})
				}
			}
		});

		await scanNodeModules({
			logger: nullLogger,
			forceUpdate: true, // forceUpdate が false の場合は gameConfigurationData を反映しない (後方互換の挙動)
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"foo": {}
				}
			}),
		});

		const conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.environment).toEqual({
			"sandbox-runtime": 3,
			external: {
				fooPlugin: '0',
			},
		});
	});

	it("clear environment.external when module not in package.json with --force", async () => {
		mockfs({
			"game.json": JSON.stringify({
				assets: {},
				globalScripts: [],
				environment: {
					"sandbox-runtime": 3,
					external: {
						fooPlugin: "0"
					}
				}
			}),
		});

		const warnLogs: string[] = [];
		class Logger extends ConsoleLogger {
			info(_message: any) {
				// do nothing
			}
			warn(message: any) {
				warnLogs.push(message);
			}
		}
		const logger = new Logger();

		await scanNodeModules({
			logger,
			forceUpdate: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: {}
			}),
		});

		const conf = JSON.parse(fs.readFileSync("./game.json").toString());

		// external が削除されていることを確認
		expect(conf.environment).toEqual({
			"sandbox-runtime": 3,
		});

		// 既存設定があれば警告を出すことを確認
		expect(warnLogs.length).toBe(1);
		expect(warnLogs[0]).toMatch(/environment\.external/);
	});
});
