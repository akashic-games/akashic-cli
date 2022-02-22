import * as path from "path";
import * as mockfs from "mock-fs";
import * as fs from "fs";
import * as Util from "../../lib/Util";
import * as Renamer from "../../lib/Renamer";
import { ConfigurationFile } from "../../lib/ConfigurationFile";
import { AssetConfigurationMap } from "@akashic/game-configuration";

describe("Renamer", function () {
	afterEach(() => {
		mockfs.restore();
	});

	it(".hashFilepath()", function () {
		var arr = ["script/mainScene.js", "node_modules/foo/bar/index.js", "image/hoge.png"];
		expect(arr.map((v) => Util.makeUnixPath(Renamer.hashFilepath(v, 256)))).toEqual([
			"files/04ef22b752657e08b66fe185c9f9592944afe6ab0ba51380f04d33f42d6a409c.js",
			"files/825a514c9ba0f7565c0bc4415451ee2350476c9c18abf970a98cdd62113617ce.js",
			"files/a70844aefe0a5ceb64eb6b4ed23be19ab98eed26a43059802cd6a2b51e066e21.png"
		]);
		expect(arr.map((v) => Renamer.hashFilepath(v, 5))).toEqual([
			"files/04ef2.js",
			"files/825a5.js",
			"files/a7084.png"
		]);
	});

	describe(".hashFilePaths()", function () {
		beforeEach(function () {
			mockfs({
				srcDir: {
					"game.json": JSON.stringify({
						main: "./script/mainScene",
						assets: {
							mainScene: {
								type: "script",
								path: "script/mainScene.js",
								global: true
							},
							sub: {
								type: "script",
								path: "script/sub.js",
								virtualPath: "script/virtualSub.js",
								global: true
							},
							hoge: {
								type: "image",
								path: "image/hoge.png",
								global: true
							},
							foo: {
								type: "audio",
								path: "audio/foo",
								global: true
							}
						},
						globalScripts: [
							"node_modules/foo/bar/index.js"
						],
						moduleMainScripts: {
							foo: "node_modules/foo/bar/index.js"
						}
					}),
					script: {
						"mainScene.js": "require('./sub');",
						"sub.js": "console.log('sub');"
					},
					image: {
						"hoge.png": ""
					},
					audio: {
						"foo.mp4": "",
						"foo.ogg": "",
					},
					node_modules: {
						foo: {
							bar: {
								"index.js": "console.log('foo');"
							}
						}
					}
				},
				destDir: {}
			});
		});
		afterEach(function () {
			mockfs.restore();
		});

		it("hash game.json", function (done) {
			Promise.resolve()
			.then(() => ConfigurationFile.read(path.join("./srcDir", "game.json"), undefined))
			.then((gamejson) => {
				Renamer.renameAssetFilenames(gamejson, "./srcDir");

				expect(gamejson.main).toBe("./script/mainScene");
				const assets = gamejson.assets as AssetConfigurationMap;
				expect(assets["mainScene"]).toEqual({
					type: "script",
					path: "files/04ef22b752657e08b66f.js",
					virtualPath: "script/mainScene.js",
					global: true
				});
				expect(assets["sub"]).toEqual({
					type: "script",
					path: "files/ec09c6fef46489affb10.js",
					virtualPath: "script/virtualSub.js", // 最初から指定されていた virtualPath は保存される。
					global: true
				});
				expect(assets["hoge"]).toEqual({
					type: "image",
					path: "files/a70844aefe0a5ceb64eb.png",
					virtualPath: "image/hoge.png",
					global: true
				});
				expect(assets["foo"]).toEqual({
					type: "audio",
					path: "files/47acba638f0bcfc681d7",
					virtualPath: "audio/foo",
					global: true
				});
				// globalScripts は scriptAsset に変換される
				expect(assets["a_e_z_0"]).toEqual({
					type: "script",
					path: "files/825a514c9ba0f7565c0b.js",
					virtualPath: "node_modules/foo/bar/index.js",
					global: true
				});
				// moduleMainScripts はvirtualPathで扱うのでリネームされていてはならない
				expect(gamejson.moduleMainScripts["foo"]).toBe("node_modules/foo/bar/index.js");
				expect(fs.statSync(path.join("srcDir", "files/a70844aefe0a5ceb64eb.png")).isFile()).toBe(true);
				expect(fs.statSync(path.join("srcDir", "files/04ef22b752657e08b66f.js")).isFile()).toBe(true);
				expect(fs.statSync(path.join("srcDir", "files/47acba638f0bcfc681d7.mp4")).isFile()).toBe(true);
				expect(fs.statSync(path.join("srcDir", "files/47acba638f0bcfc681d7.ogg")).isFile()).toBe(true);
				expect(fs.statSync(path.join("srcDir", "files/825a514c9ba0f7565c0b.js")).isFile()).toBe(true);
				done();
			})
			.catch(done.fail)
		});

		// アセットの path が重複している場合、重複するアセットでハッシュ化後のファイルを共有する
		it("hash game.json - throw error", function (done) {
			Promise.resolve()
			.then(() => ConfigurationFile.read(path.join("./srcDir", "game.json"), undefined))
			.then((gamejson) => {
				gamejson.assets = {
					hoge: {
						type: "image",
						path: "image/hoge.png",
						width: 100,
						height: 111,
						global: true
					},
					hoge2: {
						type: "image",
						path: "image/hoge.png",
						width: 50,
						height: 55,
						global: true
					}
				};
				gamejson.globalScripts = [];
				expect(() => {
					Renamer.renameAssetFilenames(gamejson, "./srcDir");
					expect(fs.statSync(path.join("srcDir", "files/04ef22b752657e08b66f.js")).isFile()).toBe(true);
					const assets = gamejson.assets as AssetConfigurationMap;
					expect(assets["hoge"]).toEqual({
						type: "image",
						path: "files/a70844aefe0a5ceb64eb.png",
						virtualPath: "image/hoge.png",
						width: 100,
						height: 111,
						global: true
					});
					expect(assets["hoge2"]).toEqual({
						type: "image",
						path: "files/a70844aefe0a5ceb64eb.png",
						virtualPath: "image/hoge.png",
						width: 50,
						height: 55,
						global: true
					});

				});
				done();
			})
			.catch(done.fail);
		});
	});
	describe("renameAssetFilenames()", function () {
		var content = {
			main: "./script/a/b/c.js",
			assets: {
				c: {
					type: "script",
					path: "script/a/b/c.js",
					global: true
				},
				e: {
					type: "script",
					path: "script/d/e.js",
					global: true
				}
			},
		};
		beforeEach(function () {
			mockfs({
				srcDir: {
					"game.json": JSON.stringify(content),
					script: {
						a: {
							b: {
								"c.js": ""
							}
						},
						d: {
							"e.js": ""
						}
					}
				},
				destDir: {}
			});
		});
		afterEach(function () {
			mockfs.restore();
		});
		it("save file included dirs", function (done) {
			fs.writeFileSync("./srcDir/script/a/b/c2.js", "hello");
			Renamer.renameAssetFilenames(JSON.parse(JSON.stringify(content)), "./srcDir", 20);
			expect(fs.statSync("./srcDir/script/a/b/c2.js").isFile()).toBe(true);
			done();
		});
	});

	describe("_removeDirectoryIfEmpty()", function () {
		var content = {
			main: "./script/a/b/c.js",
			assets: {
				c: {
					type: "script",
					path: "script/a/b/c.js",
					global: true
				},
				e: {
					type: "script",
					path: "script/d/e.js",
					global: true
				}
			},
		};
		beforeEach(function () {
			mockfs({
				srcDir: {
					"game.json": JSON.stringify(content),
					script: {
						a: {
							b: {
							}
						},
						d: {
						}
					}
				},
				destDir: {}
			});
		});
		afterEach(function () {
			mockfs.restore();
		});
		it("delete empty dirs", function (done) {
			// ファイルへのパスが含まれるケースは想定しない
			var ancestors = [
				'srcDir/script/a/b',
				'srcDir/script/a',
				'srcDir/script',
				'srcDir/script/d'
			];
			Renamer._removeDirectoryIfEmpty(ancestors, "./");
			ancestors.forEach((ancestor) => {
				try {
					fs.statSync(ancestor);
					done.fail();
				} catch (error) {
					expect(error.code).toBe("ENOENT");
					done();
				}
			});
		});

		it("not sorted dirnames", function (done) {
			// パス長さ順にソートされていないパスを渡した場合
			var ancestors = [
				'srcDir/script/d',
				'srcDir/script',
				'srcDir/script/a',
				'srcDir/script/a/b',
			];
			Renamer._removeDirectoryIfEmpty(ancestors, "./");
			ancestors.forEach((ancestor) => {
				try {
					fs.statSync(ancestor);
					done.fail();
				} catch (error) {
					expect(error.code).toBe("ENOENT");
					done();
				}
			});
		});

		it("include ancenstor path", function (done) {
			var ancestors = [
				'../otherAncenstorsrcDir/script/d',
				'../otherAncenstorsrcDir/script',
				'../otherAncenstorsrcDir/script/a',
				'../otherAncenstorsrcDir/script/a/b',
			];
			try {
				Renamer._removeDirectoryIfEmpty(ancestors, "./");
				done.fail();
			} catch (error) {
				expect(error.message).toBe("ERROR_PATH_INCLUDE_ANCESTOR");
				done();
			}
		});
	});

	describe("_listAncestorDirNames()", function () {
		it("return ancestor paths", function (done) {
			var ancestors = Renamer._listAncestorDirNames(["./srcDir/script/a/b/c.js"]).sort((a, b) => (b.length - a.length));
			expect(ancestors).toEqual([
				'./srcDir/script/a/b/c.js',
				'./srcDir/script/a/b',
				'./srcDir/script/a',
				'./srcDir/script',
				'./srcDir'
			].map((ancestorPath) => path.normalize(ancestorPath)));
			done();
		});

		it("2 paths", function (done) {
			var ancestors = Renamer._listAncestorDirNames(["./srcDir/script/a/b/c.js", "./srcDir/script/d/e/f.js"])
				.sort((a, b) => (a === b) ? 0 : (a < b) ? 1 : -1);
			expect(ancestors).toEqual([
				'./srcDir/script/d/e/f.js',
				'./srcDir/script/d/e',
				'./srcDir/script/d',
				'./srcDir/script/a/b/c.js',
				'./srcDir/script/a/b',
				'./srcDir/script/a',
				'./srcDir/script',
				'./srcDir'
			].map((ancestorPath) => path.normalize(ancestorPath)));
			done();
		});

		it("include ancenstor path", function (done) {
			var ancestors = Renamer._listAncestorDirNames(["../otherAncenstorsrcDir/script/a/b/c.js"]).sort((a, b) => (b.length - a.length));
			expect(ancestors).toEqual([
				'../otherAncenstorsrcDir/script/a/b/c.js',
				'../otherAncenstorsrcDir/script/a/b',
				'../otherAncenstorsrcDir/script/a',
				'../otherAncenstorsrcDir/script',
				'../otherAncenstorsrcDir'
			].map((ancestorPath) => path.normalize(ancestorPath)));
			done();
		});
	});
});
