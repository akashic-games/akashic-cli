import * as path from "path";
import * as fs from "fs";
import * as cmn from "@akashic/akashic-cli-commons";
import * as cnf from "../../lib/Configuration";
import { MockPromisedNpm } from "./helpers/MockPromisedNpm";

// mock-fs の import は akashic-cli-commons より後でないといけない。
// これはakashic-cli-commonsが間接的に参照するgraceful-fsが(v4.1.6現在)の実装がおかしく、
// fs.createReadStream()のオーバーライドに失敗しているため。
// mock-fsが先にオーバーライドすると空オブジェクトしか返ってこなくなる。
import * as mockfs from "mock-fs";

describe("Utilities for Configuration", function () {
	afterEach(() => {
		mockfs.restore();
	});

	it("can check image file path", function() {
		expect(cnf._isImageFilePath("hoge.png")).toBe(true);
		expect(cnf._isImageFilePath("hoge.gif")).toBe(true);
		expect(cnf._isImageFilePath("hoge.jpg")).toBe(true);
		expect(cnf._isImageFilePath("hoge.jpeg")).toBe(true);
		expect(cnf._isImageFilePath("hoge.txt.png")).toBe(true);
		expect(cnf._isImageFilePath("hoge.txt")).toBe(false);
		expect(cnf._isImageFilePath("hoge.png.txt")).toBe(false);
		expect(cnf._isImageFilePath("hoge")).toBe(false);
	});

	it("can check audio file path", function() {
		expect(cnf._isAudioFilePath("hoge.ogg")).toBe(true);
		expect(cnf._isAudioFilePath("hoge.wav")).toBe(false);
		expect(cnf._isAudioFilePath("hoge.aac")).toBe(true);
		expect(cnf._isAudioFilePath("hoge.mp4")).toBe(true);
		expect(cnf._isAudioFilePath("hoge.txt.ogg")).toBe(true);
		expect(cnf._isAudioFilePath("hoge.txt")).toBe(false);
		expect(cnf._isAudioFilePath("hoge.ogg.txt")).toBe(false);
		expect(cnf._isAudioFilePath("hoge")).toBe(false);
	});

	it("can check script file path", function() {
		expect(cnf._isScriptAssetPath("hoge.js")).toBe(true);
		expect(cnf._isScriptAssetPath("hoge.json")).toBe(true);
		expect(cnf._isScriptAssetPath("hoge.txt.js")).toBe(true);
		expect(cnf._isScriptAssetPath("hoge.txt")).toBe(false);
		expect(cnf._isScriptAssetPath("hoge.js.txt")).toBe(false);
		expect(cnf._isScriptAssetPath("hoge")).toBe(false);
	});

	it("can check text file path", function() {
		expect(cnf._isTextAssetPath("hoge.txt")).toBe(true);
		expect(cnf._isTextAssetPath("hoge.txt.js")).toBe(true);
		expect(cnf._isTextAssetPath("hoge.png")).toBe(true);
		expect(cnf._isTextAssetPath("hoge.wav")).toBe(true);
		expect(cnf._isTextAssetPath("hoge")).toBe(true);
	});

	it("can check package.json path", function() {
		expect(cnf._isPackageJsonPath("foo/bar/package.json")).toBe(true);
		expect(cnf._isPackageJsonPath("package.json")).toBe(true);
		expect(cnf._isPackageJsonPath("foo/barpackage.json")).toBe(false);
		expect(cnf._isPackageJsonPath("barpackage.json")).toBe(false);
		expect(cnf._isPackageJsonPath("package.json/")).toBe(false);
	});

	describe("._listDirectoryContents()", function () {
		it("lists directory contents up", function () {
			mockfs({
				"somedir": {
					"insideDir": {
						"foo.txt": "Content of Foo"
					},
					"emptyDir": {},
					"emptyFile": "",
					"bar.txt": "Content of Bar"
				},
				"another": {
					"zoo.txt": "ZOO"
				}
			});
			expect(cnf._listDirectoryContents("./somedir")).toEqual([
				"bar.txt",
				"emptyDir",
				"emptyFile",
				"insideDir"
			]);
		});

		it("skips non-directory", function () {
			mockfs({
				"somedir": {
					"insideDir": {
						"foo.txt": "Content of Foo"
					},
					"emptyDir": {},
					"emptyFile": "",
					"bar.txt": "Content of Bar"
				},
				"another": {
					"zoo.txt": "ZOO"
				}
			});
			expect(cnf._listDirectoryContents("./somedir/emptyFile")).toEqual([]);
		});
	});

	it("can detect asset name conflict", function () {
		expect(() => cnf._assertAssetNameNoConflict({ foo: null, bar: null }, "foo", "./dummy")).toThrow();
		expect(() => cnf._assertAssetNameNoConflict({ foo: null, bar: null }, "tee", "./dummy")).not.toThrow();
	});

	it("can detect asset type conflict", function () {
		expect(() => cnf._assertAssetTypeNoConflict("dummy", "./dummy", "image", "audio")).toThrow();
		expect(() => cnf._assertAssetTypeNoConflict("dummy", "./dummy", "text", "text")).not.toThrow();
	});

	it("can detect invalid asset name", function () {
		expect(() => cnf._assertAssetFilenameValid("foo-t")).toThrow();
		expect(() => cnf._assertAssetFilenameValid("1foo")).toThrow();
		expect(() => cnf._assertAssetFilenameValid("fo*o")).toThrow();
		expect(() => cnf._assertAssetFilenameValid("foo0x")).not.toThrow();
		expect(() => cnf._assertAssetFilenameValid("Bar1")).not.toThrow();
		expect(() => cnf._assertAssetFilenameValid("Some_LONG_Name1")).not.toThrow();
	});
});

describe("Configuration", function () {
	var nullLogger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
	var DUMMY_1x1_PNG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy1x1.png"));
	var DUMMY_OGG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.ogg"));
	var DUMMY_AAC_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.aac"));
	var DUMMY_MP4_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.mp4"));

	afterEach(function () {
		mockfs.restore();
	});

	it("can be instantiated", function () {
		var gamejson: any = { width: 320, height: 15, fps: 60 };
		var conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: "./foo" });
		expect(conf.getContent().width).toBe(gamejson.width);
		expect(conf._basepath).toBe("./foo");
	});

	it("scan assets valid file name", function(done) {
		var gamejson: any = {
			width: 320,
			height: 34,
			fps: 30,
			assets: {
				"d": {
					type: "image",
					path: "image/foo/d.png"
				},
				"$": {
					type: "text",
					path: "text/foo/$.txt"
				},
				"_": {
					type: "audio",
					path: "audio/foo/_"
				},
				"_1": {
					type: "script",
					path: "script/foo/_1.js"
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"image": {
				"foo": {
					"d.png": DUMMY_1x1_PNG_DATA,
				},
			},
			"text": {
				"foo": {
					"$.txt": "dummy",
				},
			},
			"audio": {
				"foo": {
					"_.ogg": DUMMY_OGG_DATA,
				},
			},
			"script": {
				"foo": {
					"_1.js": "var x = 1;",
				},
			},
		});
		var conf = new cnf.Configuration({
			content: gamejson,
			logger: nullLogger,
			basepath: "./"
		});
		conf.scanAssetsImage();
		expect(conf.getContent().assets["d"].type).toBe("image");
		conf.scanAssetsScript();
		expect(conf.getContent().assets["_1"].type).toBe("script");
		conf.scanAssetsText();
		expect(conf.getContent().assets["$"].type).toBe("text");
		conf.scanAssetsAudio().then(() => {
			expect(conf.getContent().assets["_"].type).toBe("audio");
			done();
		}, done.fail);
	});

	it("scan image assets info", function () {
		var gamejson: any = {
			assets: {
				"dummyImage": {
					"type": "image",
					"path": "image/foo/dummy.png",
					"width": 100,
					"height": 90,
					"global": true,
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"image": {
				"foo": {
					"dummy.png": DUMMY_1x1_PNG_DATA,
				},
				"bar.png": DUMMY_1x1_PNG_DATA
			},
		});
		var conf = new cnf.Configuration({
			content: gamejson,
			logger: nullLogger,
			basepath: process.cwd()
		});

		expect(conf.getContent().assets["dummyImage"].type).toBe("image");
		expect(conf.getContent().assets["dummyImage"].width).toBe(100);
		expect(conf.getContent().assets["dummyImage"].height).toBe(90);
		expect(conf.getContent().assets["dummyImage"].global).toBe(true);
		expect(conf.getContent().assets["bar"]).toBeUndefined();
		conf.scanAssetsImage();
		expect(conf.getContent().assets["dummyImage"].type).toBe("image");
		expect(conf.getContent().assets["dummyImage"].width).toBe(1);
		expect(conf.getContent().assets["dummyImage"].height).toBe(1);
		expect(conf.getContent().assets["dummyImage"].global).toBe(true);
		expect(conf.getContent().assets["bar"].type).toBe("image");
		expect(conf.getContent().assets["bar"].width).toBe(1);
		expect(conf.getContent().assets["bar"].height).toBe(1);
		expect(conf.getContent().assets["bar"].global).toBeUndefined();

		gamejson = {
			assets: {
				"dummyImage": {
					"type": "text",
					"path": "image/foo/dummy.png",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"image": {
				"foo": {
					"dummy.png": DUMMY_1x1_PNG_DATA,
				},
			},
		});
		var conf = new cnf.Configuration({
			content: gamejson,
			logger: nullLogger,
			basepath: process.cwd()
		});
		expect(function(){conf.scanAssetsImage()}).toThrow();
	});

	it("scan image assets invalid file name", function() {
		var conf = new cnf.Configuration({ content: <any>{}, logger: nullLogger, basepath: process.cwd() });
		var gamejson: any = {
			assets: {
				"dummy-test": {
					"type": "image",
					"path": "image/foo/dummy-test.png",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"image": {
				"foo": {
					"dummy-test.png": DUMMY_1x1_PNG_DATA,
				},
			},
		});
		expect(function(){conf.scanAssetsImage()}).toThrow();

		conf = new cnf.Configuration({ content: <any>{}, logger: nullLogger, basepath: process.cwd() });
		gamejson = {
			assets: {
				"1dummyTest": {
					"type": "image",
					"path": "image/foo/1dummyTest.png",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"image": {
				"foo": {
					"1dummyTest.png": DUMMY_1x1_PNG_DATA,
				},
			},
		});
		expect(function(){conf.scanAssetsImage()}).toThrow();
	});

	it("scan audio assets info - ogg", function (done) {
		var gamejson: any = {
			assets: {
				"dummyAudio": {
					"type": "audio",
					"path": "audio/foo/dummy",
					"global": true,
				},
				"dummyAudio2": {
					"type": "audio",
					"path": "audio/foo/z",
					"global": true,
				}
			}
		};

		mockfs({
			"game.json": JSON.stringify(gamejson),
			"audio": {
				"foo": {
					"dummy.ogg": DUMMY_OGG_DATA,
					"newDummy.ogg": DUMMY_OGG_DATA,
					"z.ogg": DUMMY_OGG_DATA,
				},
			},
		});

		var conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: process.cwd() });

		expect(conf.getContent().assets["dummyAudio"].type).toBe("audio");
		expect(conf.getContent().assets["newDummy"]).toBe(undefined);
		conf.scanAssetsAudio().then(() => {
			expect(conf.getContent().assets["dummyAudio"].type).toBe("audio");
			expect(conf.getContent().assets["newDummy"].type).toBe("audio");
			expect(conf.getContent().assets["newDummy"].systemId).toBe("sound");
			expect(conf.getContent().assets["newDummy"].duration).toBe(1250);
			done();
		});
	});

	it("scan audio assets info - mp4(aac)", function (done) {
		var gamejson: any = {
			assets: {
				"dummyAudio": {
					"type": "audio",
					"path": "audio/foo/dummy",
					"global": true,
				},
				"dummyAudio2": {
					"type": "audio",
					"path": "audio/foo/z",
					"global": true,
				}
			}
		};

		mockfs({
			"game.json": JSON.stringify(gamejson),
			"audio": {
				"foo": {
					"dummy.mp4": DUMMY_MP4_DATA,
					"newDummy.mp4": DUMMY_MP4_DATA,
					"z.mp4": DUMMY_MP4_DATA,
				},
			},
		});

		var conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: process.cwd() });

		expect(conf.getContent().assets["dummyAudio"].type).toBe("audio");
		expect(conf.getContent().assets["newDummy"]).toBe(undefined);
		conf.scanAssetsAudio().then(() => {
			expect(conf.getContent().assets["dummyAudio"].type).toBe("audio");
			expect(conf.getContent().assets["newDummy"].type).toBe("audio");
			expect(conf.getContent().assets["newDummy"].systemId).toBe("sound");
			expect(conf.getContent().assets["newDummy"].duration).toBe(302);
			done();
		});
	});

	it("scan audio assets info with conflicted asset type", function (done) {
		var gamejson: any = {
			assets: {
				"dummyAudio": {
					"type": "text",
					"path": "audio/bar/dummy2",
					"global": true,
				}
			}
		};

		mockfs({
			"game.json": JSON.stringify(gamejson),
			"audio": {
				"bar": {
					"dummy.ogg": DUMMY_OGG_DATA,
					"dummy2.ogg": DUMMY_OGG_DATA,
				},
			}
		});
		var conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: "." });
		conf.scanAssetsAudio().then((done.fail as () => void)).catch((err: any) => {
			expect(err.message.indexOf("Conflicted Asset Type") >= 0).toBe(true);
			done();
		});
	});

	it("scan audio assets info with different duration", function (done) {
		mockfs({
			"audio": {
				"dummy.ogg": DUMMY_OGG_DATA,
				"dummy.mp4": DUMMY_MP4_DATA,
				"dummy.aac": DUMMY_AAC_DATA
			}
		});
		var loggedCount = 0;
		var logger = new cmn.ConsoleLogger({ quiet: false, debugLogMethod: () => ++loggedCount });
		var conf = new cnf.Configuration({ content: <any>{}, logger: logger, basepath: process.cwd() });
		conf.scanAssetsAudio().then(() => {
			// アセット追加のログが1つ + duration差のwarnが1つ + AAC利用のwarnが1つ
			expect(loggedCount).toBe(3);
			done();
		}, done.fail);
	});

	it("scan audio assets info with not supported ext", function (done) {
		var gamejson: any = {
			assets: {
				"dummyAudio": {
					"type": "audio",
					"path": "audio/bar/dummy",
					"global": true,
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"audio": {
				"bar": {
					"dummy.aac": new Buffer(0),
				},
			},
		});
		var conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: process.cwd() });
		conf.scanAssetsAudio().then((done.fail as () => void), (err: any) => {
			expect(err).toEqual(new Error("not aac"));
			done();
		});
	});

	it("scan script assets info", function () {
		var gamejson: any = {
			assets: {
				"dummyCode": {
					"type": "script",
					"path": "script/foo/dummy.js",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"script": {
				"foo": {
					"dummy.js": "",
					"newDummy.json": "",
				},
			},
		});
		var conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: process.cwd() });

		expect(conf.getContent().assets["dummyCode"].type).toBe("script");
		expect(conf.getContent().assets["newDummy"]).toBe(undefined);
		conf.scanAssetsScript();
		expect(conf.getContent().assets["dummyCode"].type).toBe("script");
		expect(conf.getContent().assets["newDummy"].type).toBe("script");

		gamejson = {
			assets: {
				"dummyCode": {
					"type": "audio",
					"path": "script/foo/dummy.js",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"script": {
				"foo": {
					"dummy.js": "",
				},
			},
		});
		conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: process.cwd() });
		expect(function(){conf.scanAssetsScript()}).toThrow();
	});

	it("scan script assets invalid file name", function() {
		var conf = new cnf.Configuration({ content: <any>{}, logger: nullLogger, basepath: process.cwd() });
		var gamejson: any = {
			assets: {
				"dummy-test": {
					"type": "script",
					"path": "script/foo/dummy-test.js",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"script": {
				"foo": {
					"dummy-test.js": "",
				},
			},
		});
		expect(function(){conf.scanAssetsScript()}).toThrow();
		var conf = new cnf.Configuration({ content: <any>{}, logger: nullLogger, basepath: process.cwd() });
		gamejson = {
			assets: {
				"1dummyTest": {
					"type": "script",
					"path": "script/foo/1dummyTest.js",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"script": {
				"foo": {
					"1dummyTest.js": "",
				},
			},
		});
		expect(function(){conf.scanAssetsScript()}).toThrow();
	});

	it("scan text assets info", function () {
		var gamejson: any = {
			assets: {
				"dummyText": {
					"type": "text",
					"path": "text/foo/dummy.txt",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"text": {
				"foo": {
					"dummy.txt": "",
					"newDummy.txt": "",
				},
			},
		});
		var conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: process.cwd() });

		expect(conf.getContent().assets["dummyText"].type).toBe("text");
		expect(conf.getContent().assets["newDummy"]).toBe(undefined);
		conf.scanAssetsText();
		expect(conf.getContent().assets["dummyText"].type).toBe("text");
		expect(conf.getContent().assets["newDummy"].type).toBe("text");

		gamejson = {
			assets: {
				"dummyText": {
					"type": "audio",
					"path": "text/foo/dummy.txt",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"text": {
				"foo": {
					"dummy.txt": "",
				},
			},
		});
		conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: process.cwd() });
		expect(function(){conf.scanAssetsText()}).toThrow();
	});

	it("scan text assets invalid file name", function() {
		var conf = new cnf.Configuration({ content: <any>{}, logger: nullLogger, basepath: process.cwd() });
		var gamejson: any = {
			assets: {
				"dummy-test": {
					"type": "text",
					"path": "text/foo/dummy-test.txt",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"text": {
				"foo": {
					"dummy-test.txt": "",
				},
			},
		});
		expect(function(){conf.scanAssetsText()}).toThrow();
		var conf = new cnf.Configuration({ content: <any>{}, logger: nullLogger, basepath: process.cwd() });
		gamejson = {
			assets: {
				"1dummyTest": {
					"type": "text",
					"path": "text/foo/1dummyTest.txt",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"text": {
				"foo": {
					"1dummyTest.txt": "",
				},
			},
		});
		expect(function(){conf.scanAssetsText()}).toThrow();
	});

	it("handles a path appeared multiple time", function () {
		var gamejson: any = {
			assets: {
				"a1": {
					"type": "text",
					"path": "text/foo/dummy.txt",
					"global": true,
				},
				"a2": {
					"type": "image",   // wrong type!
					"path": "text/foo/dummy.txt",
				},
				"a3": {
					"type": "text",
					"path": "text/foo/dummy.txt",
				},
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"text": {
				"foo": {
					"dummy.txt": "Lorem ipsum dolor sit amet, consectetur...",
				},
			},
		});
		var conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: process.cwd() });
		expect(function(){conf.scanAssetsText()}).toThrow();
	});

	it("vacuums obsolete declarations", function () {
		var gamejson: any = {
			assets: {
				"chara": {
					"type": "image",
					"path": "image/foo/dummy.png",
					"width": 1,
					"height": 1,
				},
				"deletedChara": {
					"type": "image",
					"path": "image/foo/deletedChara.png",
					"width": 1,
					"height": 1,
				},
				"deletedSe": {
					"type": "audio",
					"path": "audio/some/deletedSe",
				},
				"se": {
					"type": "audio",
					"path": "audio/some/se",
				},
				"txt": {
					"type": "text",
					"path": "text/foo/textdata.txt",
				},
				"deletedTxt": {
					"type": "text",
					"path": "text/foo/deletedTextdata.txt",
				},
				"script": {
					"type": "script",
					"path": "script/foo/script.js",
				},
				"deletedScript": {
					"type": "script",
					"path": "script/foo/deletedScript.js",
				},
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"image": {
				"foo": {
					"dummy.png": DUMMY_1x1_PNG_DATA,
				},
			},
			"audio": {
				"some": {
					"se.ogg": "", // invalid data
				},
			},
			"text": {
				"foo": {
					"textdata.txt": "Lorem ipsum dolor sit amet, consectetur...",
				},
			},
			"script": {
				"foo": {
					"script.js": "var x = 1;",
				},
			},
		});
		var conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: process.cwd() });

		expect(conf.getContent().assets["chara"]).not.toBe(undefined);
		expect(conf.getContent().assets["se"]).not.toBe(undefined);
		expect(conf.getContent().assets["txt"]).not.toBe(undefined);
		expect(conf.getContent().assets["script"]).not.toBe(undefined);
		expect(conf.getContent().assets["deletedChara"]).not.toBe(undefined);
		expect(conf.getContent().assets["deletedSe"]).not.toBe(undefined);
		expect(conf.getContent().assets["deletedTxt"]).not.toBe(undefined);
		expect(conf.getContent().assets["deletedScript"]).not.toBe(undefined);
		conf.vacuum();
		expect(conf.getContent().assets["chara"]).not.toBe(undefined);
		expect(conf.getContent().assets["se"]).not.toBe(undefined);
		expect(conf.getContent().assets["txt"]).not.toBe(undefined);
		expect(conf.getContent().assets["script"]).not.toBe(undefined);
		expect(conf.getContent().assets["deletedChara"]).toBe(undefined);
		expect(conf.getContent().assets["deletedSe"]).toBe(undefined);
		expect(conf.getContent().assets["deletedTxt"]).toBe(undefined);
		expect(conf.getContent().assets["deletedScript"]).toBe(undefined);
	});

	it("scan globalScripts field based on node_modules/", function (done) {
		var mockFsContent: any = {
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
		};
		mockfs(mockFsContent);

		var conf = new cnf.Configuration({
			content: <any>{},
			logger: nullLogger,
			basepath: process.cwd(),
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {
						dependencies: { "dummyChild": {} }
					},
					"dummy2": {}
				}
			})
		});

		conf.scanGlobalScripts().then(() => {
			var globalScripts = conf.getContent().globalScripts;
			var moduleMainScripts = conf.getContent().moduleMainScripts;
			var expectedPaths = [
				"node_modules/dummy/main.js",
				"node_modules/dummy/foo.js",
				"node_modules/dummy/node_modules/dummyChild/index.js",
				"node_modules/dummy2/index.js",
				"node_modules/dummy2/sub.js"
			];
			expect(globalScripts.length).toBe(expectedPaths.length);
			expectedPaths.forEach((expectedPath) => {
				expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
			});
			expect(moduleMainScripts).toEqual({
				"dummy": "node_modules/dummy/main.js"
			});
			done();

		}, done.fail);
	});

	it("scan globalScripts field based on node_modules/ with npm3(flatten)", function (done) {
		var mockFsContent: any = {
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
		};
		mockfs(mockFsContent);

		var conf = new cnf.Configuration({
			content: <any>{},
			logger: nullLogger,
			basepath: process.cwd(),
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {
						dependencies: { "dummyChild": {} }
					},
					"dummy2": {}
				}
			})
		});

		conf.scanGlobalScripts().then(() => {
			var globalScripts = conf.getContent().globalScripts;
			var moduleMainScripts = conf.getContent().moduleMainScripts;
			var expectedPaths = [
				"node_modules/dummy/main.js",
				"node_modules/dummy/foo.js",
				"node_modules/dummyChild/index.js",
				"node_modules/dummy2/index.js",
				"node_modules/dummy2/sub.js"
			];
			expect(globalScripts.length).toBe(expectedPaths.length);
			expectedPaths.forEach((expectedPath) => {
				expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
			});
			expect(moduleMainScripts).toEqual({
				"dummy": "node_modules/dummy/main.js"
			});
			done();

		}, done.fail);
	});

	it("scan globalScripts field based on node_modules/ with @scope", function (done) {
		var mockFsContent: any = {
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
		};
		mockfs(mockFsContent);

		var conf = new cnf.Configuration({
			content: <any>{},
			logger: nullLogger,
			basepath: process.cwd(),
			debugNpm: new MockPromisedNpm({
				expectDependencies: { "dummy": {}, "dummy2": {}, "@scope/scoped": {} }
			})});

			conf.scanGlobalScripts().then(() => {
				var globalScripts = conf.getContent().globalScripts;
				var moduleMainScripts = conf.getContent().moduleMainScripts;
				var expectedPaths = [
					"node_modules/dummy/main.js",
					"node_modules/dummy/foo.js",
					"node_modules/dummy/node_modules/dummyChild/index.js",
					"node_modules/dummy2/index.js",
					"node_modules/dummy2/sub.js",
					"node_modules/@scope/scoped/root.js",
					"node_modules/@scope/scoped/lib/nonroot.js"
				];
				expect(globalScripts.length).toBe(expectedPaths.length);
				expectedPaths.forEach((expectedPath) => {
					expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
				});
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/main.js"
				});
				done();
			}, done.fail);
	});

	it("scan globalScripts empty node_modules/", function (done) {
		var mockFsContent: any = {
			"node_modules": {}
		}
		mockfs(mockFsContent);

		var conf = new cnf.Configuration({
			content: <any>{},
			logger: nullLogger,
			basepath: process.cwd(),
			debugNpm: new MockPromisedNpm({
				expectDependencies: {}
			})
		});
		conf.scanGlobalScripts().then(() => {
			var globalScripts = conf.getContent().globalScripts;
			var moduleMainScripts = conf.getContent().moduleMainScripts;
			expect(globalScripts.length).toBe(0);
			var expectedPaths: string[] = [];
			expectedPaths.forEach((expectedPath) => {
				expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
			});
			expect(moduleMainScripts).toBeUndefined();
			done();
		}, done.fail);
	});

	it("scan globalScripts field based on node_modules/, multiple versions in depdencdencies and devDependencies", function (done) {
		var mockFsContent: any = {
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

		var conf = new cnf.Configuration({
			content: <any>{},
			logger: nullLogger,
			basepath: process.cwd(),
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {
						dependencies: { "dummyChild": {} }
					},
					"dummy2": {}
				}
			})
		});

		conf.scanGlobalScripts().then(() => {
			var globalScripts = conf.getContent().globalScripts;
			var moduleMainScripts = conf.getContent().moduleMainScripts;
			var expectedPaths = [
				"node_modules/dummy/main.js",
				"node_modules/dummy/foo.js",
				"node_modules/dummy/node_modules/dummyChild/index.js",
				"node_modules/dummy2/index.js",
				"node_modules/dummy2/sub.js"
			];
			expect(globalScripts.length).toBe(expectedPaths.length);
			expectedPaths.forEach((expectedPath) => {
				expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
			});
			expect(moduleMainScripts).toEqual({
				"dummy": "node_modules/dummy/main.js",
				"dummyChild": "node_modules/dummy/node_modules/dummyChild/index.js"
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

			conf.scanGlobalScripts().then(() => {
				var globalScripts = conf.getContent().globalScripts;
				var moduleMainScripts = conf.getContent().moduleMainScripts;
				var expectedPaths = [
					"node_modules/dummy/main.js",
					"node_modules/dummy/foo.js",
					"node_modules/dummyChild/index.js",
					"node_modules/dummy2/index.js",
					"node_modules/dummy2/sub.js"
				];
				expect(globalScripts.length).toBe(expectedPaths.length);
				expectedPaths.forEach((expectedPath) => {
					expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
				});
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/main.js",
					"dummyChild": "node_modules/dummyChild/index.js"
				});
				done();
			}, done.fail);
		}, done.fail);
	});

	it("scan invalid package.json - no name", function (done) {
		var mockFsContent: any = {
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
		};
		mockfs(mockFsContent);

		var conf = new cnf.Configuration({
			content: <any>{},
			logger: nullLogger,
			basepath: process.cwd(),
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"invalidDummy": {}
				}
			})
		});

		conf.scanGlobalScripts().then((e: any) => {
			var globalScripts = conf.getContent().globalScripts;
			var moduleMainScripts = conf.getContent().moduleMainScripts;
			var expectedPaths = [
				"node_modules/invalidDummy/main.js",
				"node_modules/invalidDummy/foo.js"
			];
			expect(globalScripts.length).toBe(expectedPaths.length);
			expectedPaths.forEach((expectedPath) => {
				expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
			});
			expect(moduleMainScripts).toBeUndefined();
			done();
		}, done.fail);
	});

	it("scan all moduleMainScripts", function (done) {
		var mockFsContent: any = {
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
		};
		mockfs(mockFsContent);

		var conf = new cnf.Configuration({
			content: <any>{},
			logger: nullLogger,
			basepath: process.cwd(),
			debugNpm: new MockPromisedNpm({
				expectDependencies: { "dummy": {}, "dummy2": {}, "@scope/scoped": {} }
			})});

			conf.scanGlobalScripts().then(() => {
				var globalScripts = conf.getContent().globalScripts;
				var moduleMainScripts = conf.getContent().moduleMainScripts;
				var expectedPaths = [
					"node_modules/dummy/main.js",
					"node_modules/dummy/foo.js",
					"node_modules/dummy/node_modules/dummyChild/index.js",
					"node_modules/dummy2/index.js",
					"node_modules/dummy2/sub.js",
					"node_modules/@scope/scoped/root.js",
					"node_modules/@scope/scoped/lib/nonroot.js"
				];
				expect(globalScripts.length).toBe(expectedPaths.length);
				expectedPaths.forEach((expectedPath) => {
					expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
				});
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/main.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/index.js",
					"dummy2": "node_modules/dummy2/index.js",
					"@scope/scoped": "node_modules/@scope/scoped/root.js"
				});
				done();
			}, done.fail);
	});

	it("scan globalScripts: given --no-omit-packagejson property", function (done) {
		var mockFsContent: any = {
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
		};
		mockfs(mockFsContent);

		var conf = new cnf.Configuration({
			content: <any>{},
			logger: nullLogger,
			basepath: process.cwd(),
			noOmitPackagejson: true,
			debugNpm: new MockPromisedNpm({
				expectDependencies: { "dummy": {}, "dummy2": {}, "@scope/scoped": {} }
			})});

			conf.scanGlobalScripts().then(() => {
				var globalScripts = conf.getContent().globalScripts;
				var moduleMainScripts = conf.getContent().moduleMainScripts;
				var expectedPaths = [
					"node_modules/dummy/main.js",
					"node_modules/dummy/foo.js",
					"node_modules/dummy/node_modules/dummyChild/index.js",
					"node_modules/dummy2/index.js",
					"node_modules/dummy2/sub.js",
					"node_modules/@scope/scoped/root.js",
					"node_modules/@scope/scoped/lib/nonroot.js",
					'node_modules/@scope/scoped/package.json',
					'node_modules/dummy2/package.json',
					'node_modules/dummy/package.json',
					'node_modules/dummy/node_modules/dummyChild/package.json'
				];
				expect(globalScripts.length).toBe(expectedPaths.length);
				expectedPaths.forEach((expectedPath) => {
					expect(globalScripts.indexOf(expectedPath)).not.toBe(-1);
				});
				expect(moduleMainScripts).toEqual({
					"dummy": "node_modules/dummy/main.js",
					"dummyChild": "node_modules/dummy/node_modules/dummyChild/index.js",
					"dummy2": "node_modules/dummy2/index.js",
					"@scope/scoped": "node_modules/@scope/scoped/root.js"
				});
				done();
			}, done.fail);
	});

	it("scans globalScripts from the entry point script", function (done) {
		var mockFsContent: any = {
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
		};
		mockfs(mockFsContent);

		var conf = new cnf.Configuration({
			content: <any>{
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
			},
			logger: nullLogger,
			basepath: process.cwd(),
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {
						dependencies: { "dummyChild": {} }
					},
					"dummy2": {}
				}
			})
		});

		conf.scanGlobalScriptsFromEntryPoint().then(() => {
			var globalScripts = conf.getContent().globalScripts;
			var moduleMainScripts = conf.getContent().moduleMainScripts;
			var expectedPaths = [
				"node_modules/dummyChild/main.js",
				"node_modules/dummy2/sub.js"
			];
			expect(globalScripts.length).toBe(expectedPaths.length);
			expectedPaths.forEach((expectedPath) => {
				expect(expectedPath + " is at " + globalScripts.indexOf(expectedPath)).not.toBe(expectedPath + " is at -1");
			});
			expect(moduleMainScripts).toEqual({
				"dummyChild": "node_modules/dummyChild/main.js"
			});
			done();
		}, done.fail);
	});

	it("doesn't output warning message when moduleMainScript exist in game.json", function (done) {
		var gamejson: any = {
			assets: {
			},
			globalScripts: [
				"node_modules/dummy/main.js"
			],
			moduleMainScripts: {
				"dummy": "node_modules/dummy/main.js"
			}
		};

		var mockFsContent: any = {
			"game.json": JSON.stringify(gamejson),
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
		};
		mockfs(mockFsContent);

		var warnLogs: string[] = [];
		class Logger extends cmn.ConsoleLogger {
			warn(message: any) {
				warnLogs.push(message);
			}
		}
		var logger = new Logger();

		var conf = new cnf.Configuration({
			content: gamejson,
			logger,
			basepath: process.cwd(),
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {}
				}
			})
		});
		conf.scanGlobalScripts().then((e: any) => {
			expect(warnLogs.length).toBe(0);
			done();
		}, done.fail);
	});

	it("output warning message when moduleMainScript doesn't existed in game.json", function (done) {
		var gamejson: any = {
			assets: {
			},
			globalScripts: [
				"node_modules/dummy/main.js",
				"node_modules/dummy/package.json"
			]
		};
		var mockFsContent: any = {
			"game.json": JSON.stringify(gamejson),
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
		};
		mockfs(mockFsContent);

		var warnLogs: string[] = [];
		class Logger extends cmn.ConsoleLogger {
			warn(message: any) {
				warnLogs.push(message);
			}
		}
		var logger = new Logger();

		var conf = new cnf.Configuration({
			content: <any>{},
			logger,
			basepath: process.cwd(),
			debugNpm: new MockPromisedNpm({
				expectDependencies: {
					"dummy": {}
				}
			})
		});

		conf.scanGlobalScripts().then((e: any) => {
			expect(warnLogs.length).toBe(1);
			expect(warnLogs[0]).toBe(
				"Newly added the moduleMainScripts property to game.json." +
				"This property, introduced by akashic-cli@>=1.12.2, is NOT supported by older versions of Akashic Engine." +
				"Please ensure that you are using akashic-engine@>=2.0.2, >=1.12.7."
			);
			done();
		}, done.fail);
	});

	it("regression: scan asset with zero audio assets", function(done) {
		var gamejson: any = {
			width: 320,
			height: 320,
			assets: {
				"dummyAudio": {
					"type": "audio",
					"path": "audio/foo/dummy",
					"global": true,
					"duration": 100
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"image": {
				"foo": {
					"dummy.png": DUMMY_1x1_PNG_DATA,
				},
			},
		});
		var conf = new cnf.Configuration({ content: gamejson, logger: nullLogger, basepath: process.cwd() });

		conf.scanAssets().then(() => {
			conf.vacuum();
			expect(conf.getContent()).toEqual({
				width: 320,
				height: 320,
				assets:{
					dummy: {
						type: "image",
						path: "image/foo/dummy.png",
						width: 1,
						height: 1,
					}
				}
			});
			done();
		}, done.fail);
	});
});

