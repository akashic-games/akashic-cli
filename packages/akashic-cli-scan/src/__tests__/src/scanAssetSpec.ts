import * as path from "path";
import * as fs from "fs";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import type { AssetConfiguration, AssetConfigurationMap, AudioAssetConfigurationBase, GameConfiguration } from "@akashic/game-configuration";
import * as mockfs from "mock-fs";
import { scanAsset } from "../../../lib/scanAsset";
import { workaroundMockFsExistsSync } from "./testUtils";
import * as getAudioDuration from "../../../lib/getAudioDuration";
import { mockGetDuration } from "./helpers/MockGetDuration";

describe("scanAsset()", () => {
	const nullLogger = new ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
	const DUMMY_OGG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.ogg"));
	const DUMMY_AAC_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.aac"));
	const DUMMY_MP4_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.mp4"));
	const DUMMY_M4A_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.m4a"));
	const DUMMY_OGG_DATA2 = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy2.ogg"));
	const DUMMY_1x1_PNG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy1x1.png"));
	const DUMMY_300x200_SVG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy_300x200.svg"));
	const DUMMY_300x200_SUBPX_SVG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy_300x200_subpx.svg"));
	const DUMMY_NO_SIZE_SVG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy_no_size.svg"));
	const DUMMY_NO_PIXEL_SVG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy_no_px.svg"));
	const DUMMY_WASM_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.wasm"));

	workaroundMockFsExistsSync();

	// FIXME: ES Module 移行時に削除
	beforeAll(() => {
		jest.spyOn(getAudioDuration, "getAudioDuration").mockImplementation((filepath, logger?: any) => {
			return mockGetDuration(filepath, logger);
		});
	});

	afterAll(() => {
		jest.resetAllMocks();
	});
	// FIXME: ES Module 移行時に削除ここまで

	afterEach(() => {
		mockfs.restore();
	});

	describe("basic", () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {}
		};
		const mockFsContent = {
			"game": {
				"game.json": JSON.stringify(gamejson),
				"text": {
					"foo": {
						"$.txt": "dummy",
					},
				},
				"audio": {
					"foo": {
						"_.ogg": DUMMY_OGG_DATA2,
					},
				},
				"script": {
					"foo": {
						"_1.js": "var x = 1;",
					},
				},
			},
			"hoge.txt": "bbbb"
		};

		it("scan assets", async () => {
			mockfs(mockFsContent);

			await scanAsset({ cwd: "./game", target: "text", logger: nullLogger });
			await scanAsset({ cwd: "./game", target: "audio", logger: nullLogger });

			const conf: GameConfiguration = JSON.parse(fs.readFileSync("./game/game.json").toString());
			const assets = conf.assets as AssetConfigurationMap;
			expect(assets["$"]).toEqual({ type: "text", path: "text/foo/$.txt" });
			expect(assets["_"]).toEqual({ type: "audio", path: "audio/foo/_", systemId: "sound", duration: 8000, hint: { extensions: [".ogg"] } });
			expect(assets["_1"]).toBeUndefined();
			expect(fs.existsSync("./game/akashic-lib.json")).toBe(false)
		});

		it("scan all assets by default", async () => {
			mockfs(mockFsContent);

			await scanAsset({ cwd: "./game", logger: nullLogger });
			const conf = JSON.parse(fs.readFileSync("./game/game.json").toString());
			const assets = conf.assets as AssetConfigurationMap;
			expect(assets["$"]).toEqual({ type: "text", path: "text/foo/$.txt" });
			expect(assets["_"]).toEqual({ type: "audio", path: "audio/foo/_", systemId: "sound", duration: 8000, hint: { "extensions": [".ogg"] } });
			expect(assets["_1"]).toEqual({ type: "script", path: "script/foo/_1.js", global: true });
		});

		it("scan asset ids from these path", async () => {
			mockfs(mockFsContent);

			await scanAsset({ cwd: "./game", logger: nullLogger, resolveAssetIdsFromPath: true });
			const conf: GameConfiguration = JSON.parse(fs.readFileSync("./game/game.json").toString());
			const assets = conf.assets as AssetConfigurationMap;
			expect(assets["text/foo/$"]).toEqual({ type: "text", path: "text/foo/$.txt" });
			expect(assets["audio/foo/_"]).toEqual({ type: "audio", path: "audio/foo/_", systemId: "sound", duration: 8000, hint: { "extensions": [".ogg"] }  });
			expect(assets["script/foo/_1"]).toEqual({ type: "script", path: "script/foo/_1.js", global: true });
		});

		it("rejects unknown target", async () => {
			mockfs(mockFsContent);

			try {
				await scanAsset({ cwd: "./game", target: "INVALID_TARGET" as any, logger: nullLogger });
				throw new Error("must throw error")
			} catch (err) {
				expect(!!err).toBe(true);
				expect(path.relative("./", process.cwd())).toBe("");
			}
		});
	});

	describe("scanAsset() - with akashic-lib.json", () => {
		const mockFsContent = {
			"dir": {
				"akashic-lib.json": JSON.stringify({}),
				"assets": {
					"image": {
						"$$$.svg": DUMMY_300x200_SVG_DATA,
						"@__.svg": DUMMY_300x200_SUBPX_SVG_DATA,
					},
					"text": {
						"foo": {
							"$.txt": "dummy",
						},
					},
					"script": {
						"foo": {
							"_1.js": "var x = 1;",
						},
					},
					"binary": {
						"foo": {
							"_$.bin": DUMMY_WASM_DATA
						}
					}
				},
				"image": {
					"foo": {
						"_$.png": DUMMY_1x1_PNG_DATA
					},
					"bar": {
						"_$_.svg": DUMMY_300x200_SVG_DATA
					}
				},
				"audio": {
					"foo": {
						"_.ogg": DUMMY_OGG_DATA2,
					},
				},
			}
		};

		it("scan assets", async () => {
			mockfs(mockFsContent);
			await scanAsset({
				cwd: "./dir",
				target: "all",
				assetScanDirectoryTable: {
					image: ["image"],
					audio: ["audio"]
				},
				logger: nullLogger
			});
			let conf = JSON.parse(fs.readFileSync("./dir/akashic-lib.json").toString());

			// NOTE: アセットのスキャン順は仕様としては明記されていない。
			expect(conf.assetList[0]).toEqual({
				type: "audio",
				path: "audio/foo/_",
				systemId: "sound",
				duration: 8000,
				hint: { extensions: [".ogg"] }
			});
			expect(conf.assetList[1]).toEqual({
				type: "image",
				path: "image/foo/_$.png",
				width: 1,
				height: 1
			});
			expect(conf.assetList[2]).toEqual({
				type: "vector-image",
				path: "image/bar/_$_.svg",
				width: 300,
				height: 200
			});
			// NOTE: target = "all" であるので assets ディレクトリの他アセットもスキャン対象
			expect(conf.assetList[3]).toEqual({
				type: "vector-image",
				path: "assets/image/$$$.svg",
				width: 300,
				height: 200
			});
			expect(conf.assetList[4]).toEqual({
				type: "vector-image",
				path: "assets/image/@__.svg",
				width: 300,
				height: 200
			});
			expect(conf.assetList[5]).toEqual({
				type: "script",
				path: "assets/script/foo/_1.js",
				global: true
			});
			expect(conf.assetList[6]).toEqual({
				type: "binary",
				path: "assets/binary/foo/_$.bin"
			});
			expect(conf.assetList[7]).toEqual({
				type: "text",
				path: "assets/text/foo/$.txt"
			});

			// remove image asset
			fs.unlinkSync("./dir/image/foo/_$.png");
			fs.unlinkSync("./dir/image/bar/_$_.svg");

			await scanAsset({
				cwd: "./dir",
				target: "image",
				assetScanDirectoryTable: {
					image: ["image"]
				},
				logger: nullLogger
			});
			conf = JSON.parse(fs.readFileSync("./dir/akashic-lib.json").toString());

			expect(conf.assetList[0]).toEqual({
				type: "audio",
				path: "audio/foo/_",
				systemId: "sound",
				duration: 8000,
				hint: { "extensions": [".ogg"] }
			});
			expect(conf.assetList[1]).toEqual({
				type: "vector-image",
				path: "assets/image/$$$.svg",
				width: 300,
				height: 200
			});
			expect(conf.assetList[2]).toEqual({
				type: "vector-image",
				path: "assets/image/@__.svg",
				width: 300,
				height: 200
			});
			expect(conf.assetList[3]).toEqual({
				type: "script",
				path: "assets/script/foo/_1.js",
				global: true
			});
			expect(conf.assetList[4]).toEqual({
				type: "binary",
				path: "assets/binary/foo/_$.bin"
			});
			expect(conf.assetList[5]).toEqual({
				type: "text",
				path: "assets/text/foo/$.txt"
			});
		});
	});

	it("scan assets valid file name", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {
				"d": {
					type: "image",
					path: "image/foo/d.png",
					width: 10,
					height: 20
				},
				"$": {
					type: "text",
					path: "text/foo/$.txt"
				},
				"_": {
					type: "audio",
					path: "audio/foo/_",
					duration: 1200,
					systemId: "sound"
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

		await scanAsset({
			target: "image",
			assetScanDirectoryTable: {
				image: ["image"]
			},
			logger: nullLogger
		});
		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["d"].type).toBe("image");

		await scanAsset({
			target: "script",
			assetScanDirectoryTable: {
				script: ["script"]
			},
			logger: nullLogger
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["_1"].type).toBe("script");

		await scanAsset({
			target: "text",
			assetScanDirectoryTable: {
				text: ["text"]
			},
			assetExtension: {
				text: []
			},
			logger: nullLogger
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["$"].type).toBe("text");

		await scanAsset({
			target: "audio",
			assetScanDirectoryTable: {
				audio: ["audio"]
			},
			logger: nullLogger
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["_"].type).toBe("audio");
	});

	it("scan assets as array if 'assets' filed of the game.json defined as array", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 240,
			fps: 30,
			main: "",
			assets: []
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
			"assets": {
				"assets_d.png": DUMMY_1x1_PNG_DATA,
				"assets_#.yml": "dummy",
				"assets_$.conf": "dummy",
				"assets_.ogg": DUMMY_OGG_DATA,
				"assets_1.js": "var x = 1;",
			},
		});

		await scanAsset({
			logger: nullLogger,
			cwd: "./",
			assetScanDirectoryTable: {
				audio: ["audio"],
				image: ["image"],
				script: ["script"],
				text: ["text"]
			},
			assetExtension: {
				text: []
			}
		});

		let conf: GameConfiguration = JSON.parse(fs.readFileSync("./game.json").toString());
		let assets = conf.assets as AssetConfiguration[];

		// NOTE: 要素の順番は実装に依存する
		expect(assets).toEqual([
			{
				"type": "audio",
				"path": "audio/foo/_",
				"systemId": "sound",
				"duration": 1250,
				"hint": { extensions: [ ".ogg" ] }
			},
			{
				"type": "audio",
				"path": "assets/assets_",
				"systemId": "sound",
				"duration": 1250,
				"hint": { extensions: [ ".ogg" ] }
			},
			{
				"type": "image",
				"path": "image/foo/d.png",
				"width": 1,
				"height": 1
			},
			{
				"type": "image",
				"path": "assets/assets_d.png",
				"width": 1,
				"height": 1
			},
			{
				"type": "script",
				"path": "script/foo/_1.js",
				"global": true
			},
			{
				"type": "script",
				"path": "assets/assets_1.js",
				"global": true
			},
			{
				"type": "text",
				"path": "text/foo/$.txt"
			},
			{
				"type": "text",
				"path": "assets/assets_#.yml"
			},
			{
				"type": "text",
				"path": "assets/assets_$.conf"
			},
		]);

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"],
				image: ["image"],
				script: ["script"],
				text: ["text"]
			},
			assetExtension: {
				text: ["txt", "yml"]
			}
		});

		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		assets = conf.assets as AssetConfiguration[];

		// NOTE: 要素の順番は実装に依存する
		expect(assets).toEqual([
			{
				"type": "audio",
				"path": "audio/foo/_",
				"systemId": "sound",
				"duration": 1250,
				"hint": { extensions: [ ".ogg" ] }
			},
			{
				"type": "audio",
				"path": "assets/assets_",
				"systemId": "sound",
				"duration": 1250,
				"hint": { extensions: [ ".ogg" ] }
			},
			{
				"type": "image",
				"path": "image/foo/d.png",
				"width": 1,
				"height": 1
			},
			{
				"type": "image",
				"path": "assets/assets_d.png",
				"width": 1,
				"height": 1
			},
			{
				"type": "script",
				"path": "script/foo/_1.js",
				"global": true
			},
			{
				"type": "script",
				"path": "assets/assets_1.js",
				"global": true
			},
			{
				"type": "text",
				"path": "text/foo/$.txt"
			},
			{
				"type": "text",
				"path": "assets/assets_#.yml"
			},
		]);
	});

	it("scan image assets info", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
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

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				image: ["image"]
			}
		});
		let conf = JSON.parse(fs.readFileSync("./game.json").toString());

		expect(conf.assets["dummyImage"].type).toBe("image");
		expect(conf.assets["dummyImage"].width).toBe(1);
		expect(conf.assets["dummyImage"].height).toBe(1);
		expect(conf.assets["dummyImage"].global).toBe(true);
		expect(conf.assets["bar"].type).toBe("image");
		expect(conf.assets["bar"].width).toBe(1);
		expect(conf.assets["bar"].height).toBe(1);
		expect(conf.assets["bar"].global).toBeUndefined();

		gamejson.assets = {
			"dummyImage": {
				"type": "text", // invalid type
				"path": "image/foo/dummy.png",
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

		try {
			await scanAsset({
				logger: nullLogger,
				assetScanDirectoryTable: {
					image: ["image"]
				}
			});
			throw new Error("must throw error");
		} catch (e) {}
	});

	it("scan SVG assets without width or height", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"image": {
				"dummy.svg": DUMMY_NO_SIZE_SVG_DATA
			}
		});

		let loggedCount = 0;
		const logger = new ConsoleLogger({ quiet: false, debugLogMethod: () => ++loggedCount });

		await scanAsset({
			logger,
			assetScanDirectoryTable: {
				audio: ["image"]
			}
		});

		// サイズが取得できない旨のwarnが1つ + Done!のログが1つ
		expect(loggedCount).toBe(2);
	});

	it("scan SVG assets whose unit of the root width or height element is not 'px'", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"image": {
				"dummy.svg": DUMMY_NO_PIXEL_SVG_DATA
			}
		});

		let loggedCount = 0;
		const logger = new ConsoleLogger({ quiet: false, debugLogMethod: () => ++loggedCount });

		await scanAsset({
			logger,
			assetScanDirectoryTable: {
				audio: ["image"]
			}
		});

		// サイズが取得できない旨のwarnが1つ + Done!のログが1つ
		expect(loggedCount).toBe(2);
	});

	it("scan audio assets info - ogg", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {
				"dummyAudio": {
					"type": "audio",
					"path": "audio/foo/dummy",
					"duration": undefined as any,
					"systemId": undefined as any,
					"global": true,
				},
				"dummyAudio2": {
					"type": "audio",
					"path": "audio/foo/z",
					"duration": undefined as any,
					"systemId": undefined as any,
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

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"]
			}
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummyAudio"].type).toBe("audio");
		expect(conf.assets["newDummy"].type).toBe("audio");
		expect(conf.assets["newDummy"].systemId).toBe("sound");
		expect(conf.assets["newDummy"].duration).toBe(1250);
	});

	it("scan audio assets info - mp4(aac)", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {
				"dummyAudio": {
					"type": "audio",
					"path": "audio/foo/dummy",
					"duration": undefined as any,
					"systemId": undefined as any,
					"global": true,
				},
				"dummyAudio2": {
					"type": "audio",
					"path": "audio/foo/z",
					"duration": undefined as any,
					"systemId": undefined as any,
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

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"]
			}
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummyAudio"].type).toBe("audio");
		expect(conf.assets["newDummy"].type).toBe("audio");
		expect(conf.assets["newDummy"].systemId).toBe("sound");
		expect(conf.assets["newDummy"].duration).toBe(302);
	});

	it("scan audio assets info with conflicted asset type", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
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

		try {
			await scanAsset({
				logger: nullLogger,
				assetScanDirectoryTable: {
					audio: ["audio"]
				}
			});
			throw new Error("must throw error");
		} catch (e) {
			expect(e.message.indexOf("Conflicted Asset Type") >= 0).toBe(true);
		}
	});

	it("scan audio assets info with different duration", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"audio": {
				"dummy.ogg": DUMMY_OGG_DATA,
				"dummy.mp4": DUMMY_MP4_DATA,
				"dummy.m4a": DUMMY_M4A_DATA,
				"dummy.aac": DUMMY_AAC_DATA
			}
		});

		let loggedCount = 0;
		const logger = new ConsoleLogger({ quiet: false, debugLogMethod: () => ++loggedCount });

		await scanAsset({
			logger,
			assetScanDirectoryTable: {
				audio: ["audio"]
			}
		});

		// AAC利用のwarnが1つ + duration差のwarnが1つ + アセット追加のログが1つ + Done!のログが1つ
		expect(loggedCount).toBe(4);
	});

	it("scan audio assets info with not supported ext", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {
				"dummyAudio": {
					"type": "audio",
					"path": "audio/bar/dummy",
					"duration": undefined as any,
					"systemId": undefined as any,
					"global": true,
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"audio": {
				"bar": {
					"dummy.aac": Buffer.from([0]),
				},
			},
		});

		try {
			await scanAsset({
				logger: nullLogger,
				assetScanDirectoryTable: {
					audio: ["audio"]
				}
			});
			throw new Error("must throw error");
		} catch (e) {
			expect(e.message.indexOf("not aac") >= 0).toBe(true); // NOTE: aac-duration のメッセージ仕様に依存?
		}
	});

	it("scan audio assets (multiple extname)", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"assets": {
				"bgm.main.ogg": DUMMY_OGG_DATA,
				"bgm.clear.ogg": DUMMY_OGG_DATA2
			}
		});

		await scanAsset({
			logger: nullLogger,
			target: "all",
			assetScanDirectoryTable: {
				audio: ["audio"]
			}
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["assets/bgm.main"]).not.toBe(undefined);
		expect(conf.assets["assets/bgm.clear"]).not.toBe(undefined);
	});

	it("scan script assets info", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
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

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				script: ["script"]
			}
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummyCode"].type).toBe("script");
		expect(conf.assets["newDummy"]).toBe(undefined);

		gamejson.assets = {
			"dummyCode": {
				"type": "audio",
				"path": "script/foo/dummy.js",
				"duration": undefined as any,
				"systemId": undefined as any,
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

		try {
			await scanAsset({
				logger: nullLogger,
				assetScanDirectoryTable: {
					script: ["script"]
				}
			});
			throw new Error("must throw error");
		} catch (e) {
			expect(e.message.indexOf("Conflicted Asset Type") >= 0).toBe(true);
		}
	});

	it("scan text assets info", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
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

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				text: ["text"]
			},
			assetExtension: {
				text: []
			}
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummyText"].type).toBe("text");
		expect(conf.assets["newDummy"].type).toBe("text");

		gamejson.assets = {
			"dummyText": {
				"type": "audio",
				"path": "text/foo/dummy.txt",
				"duration": undefined as any,
				"systemId": undefined as any,
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

		try {
			await scanAsset({
				logger: nullLogger,
				assetScanDirectoryTable: {
					text: ["text"]
				},
				assetExtension: {
					text: []
				}
			});
			throw new Error("must throw error");
		} catch (e) {
			expect(e.message.indexOf("Conflicted Asset Type") >= 0).toBe(true);
		}
	});

	it("scan binary assets info", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {
				"dummy": {
					"type": "text",
					"path": "assets/foo/dummy.bin",
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"assets": {
				"foo": {
					"dummy.bin": DUMMY_WASM_DATA,
					"newDummy.bin": DUMMY_WASM_DATA,
				},
			},
		});

		await scanAsset({
			target: "all",
			logger: nullLogger
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummy"].type).toBe("text");
		expect(conf.assets["assets/foo/newDummy.bin"].type).toBe("binary");

		gamejson.assets = {
			"dummyBinary": {
				"type": "text",
				"path": "assets/foo/newDummy.bin",
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"assets": {
				"foo": {
					"newDummy.bin": DUMMY_WASM_DATA,
				},
			},
		});

		await scanAsset({
			target: "all",
			logger: nullLogger
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummyBinary"].type).toBe("text");
	});

	it("vacuums obsolete declarations", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
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
					"duration": undefined as any,
					"systemId": undefined as any,
				},
				"se": {
					"type": "audio",
					"path": "audio/some/se",
					"duration": undefined as any,
					"systemId": undefined as any,
				},
				"txt": {
					"type": "text",
					"path": "text/foo/textdata.txt",
				},
				"deletedTxt": {
					"type": "text",
					"path": "text/foo/deletedTextdata.txt",
				},
				"bin": {
					"type": "binary",
					"path": "assets/foo/bindata.bin",
				},
				"deletedBin": {
					"type": "binary",
					"path": "assets/foo/deletedBinarydata.bin",
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
			"assets": {
				"foo": {
					"bindata.bin": DUMMY_WASM_DATA
				}
			}
		});

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"],
				image: ["image"],
				script: ["script"],
				text: ["text"]
			},
			assetExtension: {
				text: []
			}
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["chara"]).not.toBe(undefined);
		expect(conf.assets["se"]).not.toBe(undefined);
		expect(conf.assets["txt"]).not.toBe(undefined);
		expect(conf.assets["script"]).not.toBe(undefined);
		expect(conf.assets["deletedChara"]).toBe(undefined);
		expect(conf.assets["deletedSe"]).toBe(undefined);
		expect(conf.assets["deletedTxt"]).toBe(undefined);
		expect(conf.assets["deletedBin"]).toBe(undefined);
		expect(conf.assets["deletedScript"]).toBe(undefined);
	});

	it("specify scan target dir", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {
				"dummyAudio": {
					"type": "audio",
					"path": "audio/foo/dummyAudio",
					"global": true,
					"duration": 100,
					"systemId": undefined as any
				},
				"dummyImage": {
					"type": "image",
					"path": "image/foo/dummyImage.png",
					"width": undefined as any,
					"height": undefined as any
				},
				"dummyScript": {
					"type": "script",
					"path": "script/foo/dummyScript.js",
				},
				"definedDummyBin": {
					"type": "binary",
					"path": "binary/foo/definedDummyBin.bin",
				},
				"dummyText": {
					"type": "text",
					"path": "script/foo/dummyText.js",
				},
				"dummyText2": {
					"type": "text",
					"path": "txtDummy.txt"
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"sound": {
				"dummySound.ogg": DUMMY_OGG_DATA
			},
			"img": {
				"dummyImg.png": DUMMY_1x1_PNG_DATA
			},
			"txt": {
				"dummyTxt.txt": "Lorem ipsum dolor sit amet, consectetur...",
			},
			"code": {
				"dummyCode.js": "var x = 1;",
			},
			"txtDummy.txt": "",
			"assets": {
				"untrackedBin.bin": DUMMY_WASM_DATA
			}
		});

		await scanAsset({
			logger: nullLogger,
			target: "image",
			assetScanDirectoryTable: {
				image: ["img"]
			}
		});
		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummyImg"].type).toBe("image");
		expect(conf.assets["dummyImage"].type).toBe("image");

		await scanAsset({
			logger: nullLogger,
			target: "script",
			assetScanDirectoryTable: {
				script: ["code"]
			}
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummyCode"].type).toBe("script");
		expect(conf.assets["dummyScript"].type).toBe("script");

		await scanAsset({
			logger: nullLogger,
			target: "text",
			assetScanDirectoryTable: {
				text: ["txt"]
			},
			assetExtension: {
				text: []
			}
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummyTxt"].type).toBe("text");
		expect(conf.assets["dummyText"].type).toBe("text");
		expect(conf.assets["dummyText2"].type).toBe("text");

		await scanAsset({
			logger: nullLogger,
			target: "audio",
			assetScanDirectoryTable: {
				audio: ["sound"]
			}
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummySound"].type).toBe("audio");
		expect(conf.assets["dummyAudio"].type).toBe("audio");

		await scanAsset({
			logger: nullLogger,
			target: "all"
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["definedDummyBin"].type).toBe("binary");
		expect(conf.assets["assets/untrackedBin.bin"].type).toBe("binary");
	});

	it("scan vacuum without no target dirs", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {
				"": {
					"type": "text",
					"path": "text/foo/dummy.txt",
					"global": true,
				},
				"a2": {
					"type": "image",
					"path": "text/foo/dummy.txt",
					"width": undefined as any,
					"height": undefined as any
				},
				"a3": {
					"type": "text",
					"path": "text/foo/dummy.txt",
				},
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"sound": {
				"dummySound.ogg": DUMMY_OGG_DATA
			},
			"img": {
				"dummyImg.png": DUMMY_1x1_PNG_DATA
			},
			"txt": {
				"dummyTxt.txt": "Lorem ipsum dolor sit amet, consectetur...",
			},
			"code": {
				"dummyCode.js": "var x = 1;",
			}
		});

		await scanAsset({
			logger: nullLogger,
			target: "image",
			assetScanDirectoryTable: {
				image: ["img"]
			}
		});
		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummyImg"].type).toBe("image");

		await scanAsset({
			logger: nullLogger,
			target: "script",
			assetScanDirectoryTable: {
				script: ["code"]
			}
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummyCode"].type).toBe("script");

		await scanAsset({
			logger: nullLogger,
			target: "text",
			assetScanDirectoryTable: {
				text: ["txt"]
			},
			assetExtension: {
				text: []
			}
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummyTxt"].type).toBe("text");

		await scanAsset({
			logger: nullLogger,
			target: "audio",
			assetScanDirectoryTable: {
				audio: ["sound"]
			}
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummySound"].type).toBe("audio");
	});

	it("regression: scan asset with zero audio assets", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: {
				"dummyAudio": {
					"type": "audio",
					"path": "audio/foo/dummy",
					"global": true,
					"duration": 100,
					"systemId": undefined as any
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

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"],
				image: ["image"],
				script: ["script"],
				text: ["text"]
			},
			assetExtension: {
				text: []
			}
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets).toEqual({
			dummy: {
				type: "image",
				path: "image/foo/dummy.png",
				width: 1,
				height: 1,
			}
		});
	});

	it("can update previously defined Asset IDs", async () => {
		const gamejson: GameConfiguration = {
			width: 1,
			height: 1,
			fps: 30,
			main: "",
			assets: {
				"chara": {
					"type": "image",
					"path": "image/foo/dummy.png",
					"width": 1,
					"height": 1
				},
				"se": {
					"type": "audio",
					"path": "audio/some/se",
					"duration": undefined as any,
					"systemId": undefined as any,
				},
				"txt": {
					"type": "text",
					"path": "text/foo/textdata.txt"
				},
				"script": {
					"type": "script",
					"path": "script/foo/script.js"
				},
				"bin": {
					"type": "binary",
					"path": "assets/foo/bin.bin"
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"image": {
				"foo": {
					"dummy.png": DUMMY_1x1_PNG_DATA
				}
			},
			"audio": {
				"some": {
					"se.ogg": DUMMY_OGG_DATA
				}
			},
			"text": {
				"foo": {
					"textdata.txt": "Lorem ipsum dolor sit amet, consectetur..."
				}
			},
			"script": {
				"foo": {
					"script.js": "var x = 1;"
				}
			},
			"assets": {
				"foo": {
					"bin.bin": DUMMY_WASM_DATA
				}
			}
		});

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"],
				image: ["image"],
				script: ["script"],
				text: ["text"],
				binary: ["assets"]
			},
			assetExtension: {
				text: ["txt"]
			},
			forceUpdateAssetIds: false,
			resolveAssetIdsFromPath: true
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["chara"]).not.toBe(undefined);
		expect(conf.assets["se"]).not.toBe(undefined);
		expect(conf.assets["txt"]).not.toBe(undefined);
		expect(conf.assets["script"]).not.toBe(undefined);
		expect(conf.assets["bin"]).not.toBe(undefined);

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"],
				image: ["image"],
				script: ["script"],
				text: ["text"],
				binary: ["assets"]
			},
			assetExtension: {
				text: ["txt"]
			},
			forceUpdateAssetIds: true,
			resolveAssetIdsFromPath: true,
			includeExtensionToAssetId: false
		});

		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["image/foo/dummy"]).not.toBe(undefined);
		expect(conf.assets["audio/some/se"]).not.toBe(undefined);
		expect(conf.assets["text/foo/textdata"]).not.toBe(undefined);
		expect(conf.assets["script/foo/script"]).not.toBe(undefined);
		expect(conf.assets["assets/foo/bin.bin"]).not.toBe(undefined);

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"],
				image: ["image"],
				script: ["script"],
				text: ["text"]
			},
			assetExtension: {
				text: ["txt"]
			},
			forceUpdateAssetIds: true,
			includeExtensionToAssetId: false
		});

		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummy"]).not.toBe(undefined);
		expect(conf.assets["se"]).not.toBe(undefined);
		expect(conf.assets["textdata"]).not.toBe(undefined);
		expect(conf.assets["script"]).not.toBe(undefined);
		expect(conf.assets["assets/foo/bin.bin"]).not.toBe(undefined);
	});

	it("can scan Asset IDs with file extensions", async () => {
		const gamejson: GameConfiguration = {
			width: 1,
			height: 1,
			fps: 30,
			main: "",
			assets: {
				"chara": {
					"type": "image",
					"path": "image/foo/dummy.png",
					"width": 1,
					"height": 1
				},
				"se": {
					"type": "audio",
					"path": "audio/some/se",
					"duration": undefined as any,
					"systemId": undefined as any,
				},
				"txt": {
					"type": "text",
					"path": "text/foo/textdata.txt"
				},
				"txt2": {
					"type": "text",
					"path": "text/bar/textdata2"
				},
				"script": {
					"type": "script",
					"path": "script/foo/script.js"
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"image": {
				"foo": {
					"dummy.png": DUMMY_1x1_PNG_DATA
				}
			},
			"audio": {
				"some": {
					"se.ogg": DUMMY_OGG_DATA
				}
			},
			"text": {
				"foo": {
					"textdata.txt": "Lorem ipsum dolor sit amet, consectetur..."
				},
				"bar": {
					"textdata2": "no extension..."
				}
			},
			"script": {
				"foo": {
					"script.js": "var x = 1;"
				}
			}
		});

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"],
				image: ["image"],
				script: ["script"],
				text: ["text"]
			},
			assetExtension: {
				text: ["txt", ""]
			},
			forceUpdateAssetIds: false,
			resolveAssetIdsFromPath: false
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["chara"]).not.toBe(undefined);
		expect(conf.assets["se"]).not.toBe(undefined);
		expect(conf.assets["txt"]).not.toBe(undefined);
		expect(conf.assets["txt2"]).not.toBe(undefined);
		expect(conf.assets["script"]).not.toBe(undefined);

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"],
				image: ["image"],
				script: ["script"],
				text: ["text"]
			},
			assetExtension: {
				text: ["txt", ""]
			},
			forceUpdateAssetIds: true,
			includeExtensionToAssetId: true,
			resolveAssetIdsFromPath: false
		});

		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummy.png"]).not.toBe(undefined);
		expect(conf.assets["se"]).not.toBe(undefined);
		expect(conf.assets["textdata.txt"]).not.toBe(undefined);
		expect(conf.assets["textdata2"]).not.toBe(undefined);
		expect(conf.assets["script.js"]).not.toBe(undefined);

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"],
				image: ["image"],
				script: ["script"],
				text: ["text"]
			},
			assetExtension: {
				text: ["txt", ""]
			},
			forceUpdateAssetIds: true,
			resolveAssetIdsFromPath: true,
			includeExtensionToAssetId: true
		});
		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["image/foo/dummy.png"]).not.toBe(undefined);
		expect(conf.assets["audio/some/se"]).not.toBe(undefined);
		expect(conf.assets["text/foo/textdata.txt"]).not.toBe(undefined);
		expect(conf.assets["text/bar/textdata2"]).not.toBe(undefined);
		expect(conf.assets["script/foo/script.js"]).not.toBe(undefined);

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: {
				audio: ["audio"],
				image: ["image"],
				script: ["script"],
				text: ["text"]
			},
			assetExtension: {
				text: ["txt", ""]
			},
			forceUpdateAssetIds: true,
			resolveAssetIdsFromPath: false,
			includeExtensionToAssetId: false,
		});

		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["dummy"]).not.toBe(undefined);
		expect(conf.assets["se"]).not.toBe(undefined);
		expect(conf.assets["textdata"]).not.toBe(undefined);
		expect(conf.assets["textdata2"]).not.toBe(undefined);
		expect(conf.assets["script"]).not.toBe(undefined);
	});

	it("can scan the assets directory", async () => {
		const gamejson: GameConfiguration = {
			width: 1,
			height: 1,
			fps: 30,
			main: "",
			assets: {
				"dummy": {
					"type": "image",
					"path": "image/foo/dummy.png",
					"width": 1,
					"height": 1
				},
				"se": {
					"type": "audio",
					"path": "audio/some/se",
					"duration": undefined as any,
					"systemId": undefined as any,
				},
				"txt": {
					"type": "text",
					"path": "text/foo/textdata.txt"
				},
				"script": {
					"type": "script",
					"path": "script/foo/script.js"
				}
			}
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"assets": {
				"image": {
					"dummy.png": DUMMY_1x1_PNG_DATA
				},
				"audio": {
					"some": {
						"se.ogg": DUMMY_OGG_DATA
					}
				},
				"text": {
					"foo": {
						"textdata.txt": "Lorem ipsum dolor sit amet, consectetur..."
					}
				},
				"binary": {
					"by": {
						"module.bin": DUMMY_WASM_DATA
					}
				},
				"script": {
					"foo": {
						"script.js": "var x = 1;"
					}
				}
			}
		});

		await scanAsset({
			logger: nullLogger,
			forceUpdateAssetIds: true
		});

		let conf = JSON.parse(fs.readFileSync("./game.json").toString());
		// NOTE: assets/ 以下のアセットに関しては includeExtensionToAssetId の値によらず常に拡張子を含む
		expect(conf.assets["assets/image/dummy.png"]).toBeDefined();
		expect(conf.assets["assets/audio/some/se"]).toBeDefined();
		expect(conf.assets["assets/script/foo/script.js"]).toBeDefined();
		expect(conf.assets["assets/text/foo/textdata.txt"]).toBeDefined();
		expect(conf.assets["assets/binary/by/module.bin"]).toBeDefined();

		await scanAsset({
			logger: nullLogger,
			forceUpdateAssetIds: true,
			includeExtensionToAssetId: true
		});

		conf = JSON.parse(fs.readFileSync("./game.json").toString());
		expect(conf.assets["assets/image/dummy.png"]).toBeDefined();
		expect(conf.assets["assets/audio/some/se"]).toBeDefined();
		expect(conf.assets["assets/script/foo/script.js"]).toBeDefined();
		expect(conf.assets["assets/text/foo/textdata.txt"]).toBeDefined();
		expect(conf.assets["assets/binary/by/module.bin"]).toBeDefined();
	});

	it("keep offset if already has", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 34,
			fps: 30,
			main: "",
			assets: [
				{
					"type": "audio",
					"path": "audio/dummy",
					"systemId": "sound",
					"offset": 300,
					"duration": 1
				},
			]
		};
		mockfs({
			"game.json": JSON.stringify(gamejson),
			"audio": {
				"dummy.ogg": DUMMY_OGG_DATA,
				"dummy.aac": DUMMY_AAC_DATA
			}
		});

		await scanAsset({
			logger: nullLogger,
			assetScanDirectoryTable: { audio: ["audio"] }
		});

		let conf: GameConfiguration = JSON.parse(fs.readFileSync("./game.json").toString());
		let assets = conf.assets as AssetConfiguration[];
		expect((assets[0] as AudioAssetConfigurationBase).duration).toBe(1250); // duration が更新されている
		expect((assets[0] as AudioAssetConfigurationBase).offset).toBe(300); // offset が維持されている
	});
});
