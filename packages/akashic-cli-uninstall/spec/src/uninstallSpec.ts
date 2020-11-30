import * as mockfs from "mock-fs";
import * as cmn from "@akashic/akashic-cli-commons";
import { uninstall, promiseUninstall } from "../../lib/uninstall";
import path = require("path");


describe("uninstall()", function () {
	afterEach(function () {
		mockfs.restore();
	});

	it("rejects multiple module names if plugin opetion is given",  function (done: any) {
		mockfs({});
		uninstall({ moduleNames: ["foo", "bar"], plugin: true }, (err) => (err ? done() : done.fail()));
	});

	it("handles npm failure", (done: any) => {
		mockfs({});
		class DummyNpm extends cmn.PromisedNpm {
			uninstall(names?: string[]) { return Promise.reject("UninstallFail:" + names); }
		}
		var logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		Promise.resolve()
			.then(() => promiseUninstall({
				moduleNames: ["tee"],
				cwd: ".",
				logger: logger,
				debugNpm: new DummyNpm({ logger })
			}))
			.then(done.fail)
			.catch(e => done());
	});

	it("removes declaration from globalScripts", function (done: any) {
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
						}
					})
				}
			}
		};
		mockfs(mockfsContent);

		var logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		class DummyNpm extends cmn.PromisedNpm {
			uninstallLog: string[][];
			unlinkLog: string[][];
			constructor() {
				super({ logger });
				this.uninstallLog = [];
				this.unlinkLog = [];
			}
			uninstall(names?: string[]) {
				this.uninstallLog.push(names);
				names.forEach((name) => {
					mockfsContent.testdir.foo.node_modules[name] = null;
				});
				mockfs(mockfsContent.testdir.foo);
				return Promise.resolve();
			}
			unlink(names?: string[]) {
				this.unlinkLog.push(names);
				names.forEach((name) => {
					mockfsContent.testdir.foo.node_modules[name] = null;
				});
				mockfs(mockfsContent.testdir.foo);
				return Promise.resolve();
			}
		}
		var dummyNpm = new DummyNpm();

		Promise.resolve()
			.then(() => promiseUninstall({
				moduleNames: ["foo"],
				cwd: "./testdir/foo/",
				plugin: true,
				debugNpm: dummyNpm,
				logger: logger
			}))
			.then(() => cmn.ConfigurationFile.read("./testdir/foo/game.json", logger))
			.then((content: cmn.GameConfiguration) => {
				expect(dummyNpm.uninstallLog).toEqual([["foo"]]);
				var globalScripts = content.globalScripts;
				expect(globalScripts).toEqual([
					"node_modules/buzz/main.js",
					"node_modules/buzz/sub/foo.js"
				]);
				var moduleMainScripts = content.moduleMainScripts;
				expect(moduleMainScripts).toEqual({
					"buzz": "node_modules/buzz/main.js"
				});
			})
			.then(() => promiseUninstall({
				moduleNames: ["buzz"],
				cwd: "./testdir/foo/",
				plugin: true,
				unlink: true,
				debugNpm: dummyNpm,
				logger: logger
			}))
			.then(() => cmn.ConfigurationFile.read("./testdir/foo/game.json", logger))
			.then((content: cmn.GameConfiguration) => {
				expect(dummyNpm.uninstallLog).toEqual([["foo"]]);
				expect(dummyNpm.unlinkLog).toEqual([["buzz"]]);
				var globalScripts = content.globalScripts;
				expect(globalScripts).toEqual([]);
				var moduleMainScripts = content.moduleMainScripts;
				expect(moduleMainScripts).toBeUndefined();
			})
			.then(done, done.fail);
	});

	it("removes external from conf", function (done: any) {
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
		mockfs(mockfsContent);

		class DummyNpm extends cmn.PromisedNpm {
			uninstall(names?: string[]) {
				names.forEach((name) => {
					mockfsContent.testdir.foo.node_modules[name] = null;
				});
				mockfs(mockfsContent.testdir.foo);
				return Promise.resolve();
			}
		}

		var logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		promiseUninstall({
			moduleNames: ["foo"],
			cwd: "./testdir/foo",
			logger: logger,
			debugNpm: new DummyNpm({ logger })
		}).then(() => cmn.ConfigurationFile.read(path.join("./testdir/foo", "game.json"), logger))
		.then((content: cmn.GameConfiguration) => {
			expect(content.environment.external.fooEx).toBe(undefined);
			expect(content.environment.external.buzzEx).toBe("10000");
			done();
		}).then(done, done.fail)
	});

	it("dont remove remaining external", function (done: any) {
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
											"fooEx": "100",
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
		mockfs(mockfsContent);
	
		class DummyNpm extends cmn.PromisedNpm {
			uninstall(names?: string[]) {
				names.forEach((name) => {
					mockfsContent.testdir.foo.node_modules[name] = null;
				});
				mockfs(mockfsContent.testdir.foo);
				return Promise.resolve();
			}
		}
	
		var logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		promiseUninstall({
			moduleNames: ["foo"],
			cwd: "./testdir/foo",
			logger: logger,
			debugNpm: new DummyNpm({ logger })
		}).then(() => cmn.ConfigurationFile.read(path.join("./testdir/foo", "game.json"), logger))
		.then((content: cmn.GameConfiguration) => {
			expect(content.environment.external.fooEx).toBe("100");
			expect(content.environment.external.buzzEx).toBe("10000");
			done();
		}).then(done, done.fail)
	});
});
