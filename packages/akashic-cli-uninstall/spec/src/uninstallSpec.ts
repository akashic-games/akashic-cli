import * as mockfs from "mock-fs";
import * as cmn from "@akashic/akashic-cli-commons";
import { uninstall, promiseUninstall } from "../../lib/uninstall";


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
		var shrinkwrapCalled = false;
		class DummyNpm extends cmn.PromisedNpm {
			uninstall(names?: string[]) { return Promise.reject("UninstallFail:" + names); }
			shrinkwrap(names?: string[]) { shrinkwrapCalled = true; return Promise.resolve(); }
		}
		var logger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
		Promise.resolve()
			.then(() => promiseUninstall({
				moduleNames: ["tee"],
				cwd: ".",
				logger: logger,
				debugNpm: new DummyNpm({ logger })
			}))
			.then(done.fail, done);
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
			shrinkwrapCount: number;
			constructor() {
				super({ logger });
				this.uninstallLog = [];
				this.unlinkLog = [];
				this.shrinkwrapCount = 0;
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
			shrinkwrap(names?: string[]) { ++this.shrinkwrapCount; return Promise.resolve(); }
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
				expect(dummyNpm.shrinkwrapCount).toBe(1);
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
				expect(dummyNpm.shrinkwrapCount).toBe(1);  // unlink
				var globalScripts = content.globalScripts;
				expect(globalScripts).toEqual([]);
				var moduleMainScripts = content.moduleMainScripts;
				expect(moduleMainScripts).toBeUndefined();
			})
			.then(done, done.fail);
	});
});
