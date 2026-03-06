import type * as cmn from "@akashic/akashic-cli-commons";
import type { AssetConfigurationBase } from "@akashic/game-configuration";
import { fs, vol } from "memfs";
import * as gcu from "../GameConfigurationUtil.js";

vi.mock("node:fs", async () => {
  const memfs: { fs: typeof fs } = await vi.importActual("memfs");
  return memfs.fs;
});

describe("GameConfigurationUtil", () => {
	let gamejson: cmn.GameConfiguration;
	let gamejsonNoGlobalScripts: cmn.GameConfiguration;

	beforeEach(() => {
		gamejson = {
			width: 120,
			height: 120,
			fps: 40,
			main: "main.js",
			assets: {
				"main": {
					type: "script",
					global: true,
					path: "script/main.js"
				},
				"sub": {
					type: "script",
					global: true,
					path: "script/sub.js"
				}
			},
			globalScripts: [
				"node_modules/foobar/lib/x.js",
				"node_modules/foobar/package.json"
			]
		};
		gamejsonNoGlobalScripts = {
			width: 120,
			height: 120,
			fps: 40,
			main: "main.js",
			assets: {
				"main": {
					type: "script",
					global: true,
					path: "script/main.js"
				},
				"sub": {
					type: "script",
					global: true,
					path: "script/sub.js"
				}
			}
		};
	});

	afterEach(() => {
		vol.reset();
	});

	describe("removeAssets", () => {
		it("remove script assets", () => {
			const filter = (asset: AssetConfigurationBase): boolean => {
				return ["node_modules/foobar/package.json", "script/main.js"].indexOf(asset.path) !== -1;
			};
			gcu.removeAssets(gamejson, filter);
			expect(gamejson).toEqual({
				width: 120,
				height: 120,
				fps: 40,
				main: "main.js",
				assets: {
					"main": {
						type: "script",
						global: true,
						path: "script/main.js"
					}
				},
				globalScripts: [
					"node_modules/foobar/lib/x.js",
					"node_modules/foobar/package.json"
				]
			});
		});
	});

	describe("removeGlobalScripts", () => {
		const filter = (filePath: string): boolean => {
			return ["node_modules/foobar/package.json", "script/main.js"].indexOf(filePath) !== -1;
		};
		it("remove scripts from globalScripts", () => {
			gcu.removeGlobalScripts(gamejson, filter);
			expect(gamejson).toEqual({
				width: 120,
				height: 120,
				fps: 40,
				main: "main.js",
				assets: {
					"main": {
						type: "script",
						global: true,
						path: "script/main.js"
					},
					"sub": {
						type: "script",
						global: true,
						path: "script/sub.js"
					}
				},
				globalScripts: [
					"node_modules/foobar/package.json"
				]
			});
		});
	});

	describe("findUniqueScriptAssetName", () => {
		it("uses the given prefix if can be used", () => {
			expect(gcu.findUniqueScriptAssetName(gamejson, "foo")).toBe("foo");
		});

		it("detects confliction", () => {
			const gamejson: cmn.GameConfiguration = {
				width: 120,
				height: 120,
				fps: 40,
				main: "main.js",
				assets: {
					"main": {
						type: "script",
						global: true,
						path: "script/main.js"
					},
					"sub": {
						type: "script",
						global: true,
						path: "script/sub.js"
					},
					"sub0": {
						type: "script",
						global: true,
						path: "script/sub0.js"
					}
				},
				globalScripts: [
					"node_modules/foobar/lib/x.js",
					"node_modules/foobar/package.json"
				]
			};
			expect(gcu.findUniqueScriptAssetName(gamejson, "sub")).toBe("sub1");
		});

		it("detects confliction from globalScripts", () => {
			const gamejson: cmn.GameConfiguration = {
				width: 120,
				height: 120,
				fps: 40,
				main: "main.js",
				assets: {
					"main": {
						type: "script",
						global: true,
						path: "script/main.js"
					}
				},
				globalScripts: [  // エッジケース。通常globalScriptsに拡張子なし・node_modules以外のファイルを書くことはまずない
					"zoo",
					"zoo0"
				]
			};
			expect(gcu.findUniqueScriptAssetName(gamejson, "zoo")).toBe("zoo1");
		});
	});

	describe("addScriptAsset", () => {
		it("adds unique script asset", () => {
			gcu.addScriptAsset(gamejson, "sub");
			expect(gamejson).toEqual({
				width: 120,
				height: 120,
				fps: 40,
				main: "main.js",
				assets: {
					"main": {
						type: "script",
						global: true,
						path: "script/main.js"
					},
					"sub": {
						type: "script",
						global: true,
						path: "script/sub.js"
					},
					"sub0": {
						type: "script",
						global: true,
						path: "script/sub0.js"
					}
				},
				globalScripts: [
					"node_modules/foobar/lib/x.js",
					"node_modules/foobar/package.json"
				]
			});
		});
	});

	describe("extractFilePaths", () => {
		it("lists paths", () => {
			expect(gcu.extractFilePaths(gamejson, ".")).toEqual([
				"script/main.js",
				"script/sub.js",
				"node_modules/foobar/lib/x.js",
				"node_modules/foobar/package.json"
			]);
		});

		it("completes audio extensions", () => {
			gamejson.assets.sound = {
				type: "audio",
				systemId: "sound",
				path: "audio/foo",
				duration: 100
			};
			vol.fromNestedJSON({
				gamejson: "",
				audio: {
					"foo.ogg": "",
					"foo.aac": "",
					"foo.m4a": "",
					"foo.invalid": "",
					"foo.mp4": {  // ファイルでなければ無視されねばならない
						"foo.mustbeignored.aac": ""
					}
				},
				script: {
					"main.js": "",
					"sub.js": ""
				},
				node_modules: {
					foobar: {
						lib: {
							"x.js": ""
						},
						"package.json": ""
					}
				}
			});

			expect(gcu.extractFilePaths(gamejson, ".")).toEqual([
				"script/main.js",
				"script/sub.js",
				"audio/foo.ogg",
				"audio/foo.aac",
				"audio/foo.m4a",
				"node_modules/foobar/lib/x.js",
				"node_modules/foobar/package.json"
			]);
		});

		it("completes preserve packagejson", () => {
			gamejson.globalScripts = ["node_modules/foobar/lib/x.js"];
			vol.fromNestedJSON({
				gamejson: "",
				script: {
					"main.js": "",
					"sub.js": ""
				},
				node_modules: {
					foobar: {
						lib: {
							"x.js": ""
						},
						"package.json": ""
					}
				}
			});

			expect(gcu.extractFilePaths(gamejson, ".", false)).toEqual([
				"script/main.js",
				"script/sub.js",
				"node_modules/foobar/lib/x.js",
			]);
			expect(gcu.extractFilePaths(gamejson, ".", true)).toEqual([
				"script/main.js",
				"script/sub.js",
				"node_modules/foobar/lib/x.js",
				"node_modules/foobar/package.json"
			]);
		});
	});

	describe("extractScriptAssetFilePaths", () => {
		it("extracts script assets", () => {
			expect(gcu.extractScriptAssetFilePaths(gamejsonNoGlobalScripts)).toEqual(["script/main.js", "script/sub.js"]);
		});
		it("extracts script assets from globalScripts", () => {
			expect(gcu.extractScriptAssetFilePaths(gamejson)).toEqual([
				"script/main.js",
				"script/sub.js",
				"node_modules/foobar/lib/x.js"
			]);
		});
	});

	describe("makeUniqueAssetPath", () => {
		it("can get asset path not used in game.json", () => {
			gamejson.assets.main0 = {
				type: "script",
				global: true,
				path: "script/main0.js"
			};
			gamejson.assets.main2 = {
				type: "script",
				global: true,
				path: "script/main2.js"
			};
			const result = gcu.makeUniqueAssetPath(gamejson, "script/main.js");
			expect(result).toBe("script/main1.js");
		});
	});

	describe("isScriptJsFile", () => {
		it("when filepath prefix is script, true is returned", () => {
			const ret = gcu.isScriptJsFile("script/somewhere/test.js");
			expect(ret).toBeTruthy();
		});
		it("when filepath prefix is not script, false is returned", () => {
			const ret = gcu.isScriptJsFile("node_module/somewhere/test.js");
			expect(ret).toBeFalsy();
		});
	});
});
