import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger.js";
import mockfs from "mock-fs";
import { scanAudioAssets, scanImageAssets, scanScriptAssets, scanTextAssets, scanBinaryAssets, knownExtensionAssetFilter } from "../../scanUtils.js";
import { isBinaryFile } from "../../isBinaryFile.js";
import { defaultTextAssetFilter } from "../../scanUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("scanUtils", () => {
	const nullLogger = new ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
	const DUMMY_MP4_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.mp4"));
	const DUMMY_AAC_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.aac"));
	const DUMMY_OGG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.ogg"));
	const DUMMY_OGG_DATA2 = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy2.ogg"));
	const DUMMY_1x1_PNG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy1x1.png"));
	const DUMMY_WASM_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.wasm"));

	beforeEach(() => {
		mockfs({
			"game": {
				"text": {
					"foo": {
						"$.json": "{}",
					}
				},
				"audio": {
					"foo": {
						"_0.mp4": DUMMY_MP4_DATA,
						"_0.aac": DUMMY_AAC_DATA,
						"_0.ogg": DUMMY_OGG_DATA,
					},
				},
				"script": {
					"foo": {
						"_1.js": "var x = 1;",
					}
				},
				"image": {
					"foo": {
						"_2.png": DUMMY_1x1_PNG_DATA
					}
				},
				"assets": {
					"_.txt": "dummy",
					"_.ogg": DUMMY_OGG_DATA2,
					"_.js": "var x = 1;",
					"_.png": DUMMY_1x1_PNG_DATA,
					"_.bin": DUMMY_WASM_DATA
				}
			}
		});
	});

	afterEach(() => {
		mockfs.restore();
	});

	it("scanScriptAssets()", async () => {
		expect(
			await scanScriptAssets(
				"./game",
				"script",
				nullLogger
			)
		).toEqual([
			{
				type: "script",
				path: "script/foo/_1.js",
				global: true
			}
		]);

		expect(
			await scanScriptAssets(
				"./game",
				"assets",
				nullLogger
			)
		).toEqual([
			{
				type: "script",
				path: "assets/_.js",
				global: true
			}
		]);
	});

	it("scanTextAssets()", async () => {
		expect(
			await scanTextAssets(
				"./game",
				"text",
				nullLogger,
				p => {
					if (knownExtensionAssetFilter(p)) return false;
					if (defaultTextAssetFilter(p)) return true;
					return !isBinaryFile(path.join("./game", "text", p));
				}
			)
		).toEqual([
			{
				type: "text",
				path: "text/foo/$.json"
			}
		]);

		expect(
			await scanTextAssets(
				"./game",
				"assets",
				nullLogger,
				p => {
					if (knownExtensionAssetFilter(p)) return false;
					if (defaultTextAssetFilter(p)) return true;
					return !isBinaryFile(path.join("./game", "assets", p));
				}
			)
		).toEqual([
			{
				type: "text",
				path: "assets/_.txt"
			}
		]);
	});

	it("scanBinaryAssets()", async () => {
		expect(
			await scanBinaryAssets(
				"./game",
				"assets",
				nullLogger,
				p => {
					if (knownExtensionAssetFilter(p)) return false;
					return isBinaryFile(path.join("./game", "assets", p));
				}
			)
		).toEqual([
			{
				type: "binary",
				path: "assets/_.bin"
			}
		]);
	});

	it("scanImageAssets()", async () => {
		expect(
			await scanImageAssets(
				"./game",
				"image",
				nullLogger
			)
		).toEqual([
			{
				type: "image",
				path: "image/foo/_2.png",
				width: 1,
				height: 1
			}
		]);

		expect(
			await scanImageAssets(
				"./game",
				"assets",
				nullLogger
			)
		).toEqual([
			{
				type: "image",
				path: "assets/_.png",
				width: 1,
				height: 1
			}
		]);
	});

	it("scanAudioAssets()", async () => {
		const warnLogs: string[] = [];
		class Logger extends ConsoleLogger {
			warn(message: string) {
				warnLogs.push(message);
			}
		}

		expect(
			await scanAudioAssets(
				"./game",
				"audio",
				new Logger()
			)
		).toEqual([
			{
				type: "audio",
				path: "audio/foo/_0",
				systemId: "sound",
				duration: 1250,
				hint: {
					extensions: [".aac", ".mp4", ".ogg"] // NOTE: extensions 要素の順番は実装に依存する
				}
			}
		]);

		expect(warnLogs.length).toBe(2);
		expect(warnLogs[0]).toContain("deprecated"); // mp4 形式は非推奨であることの旨
		expect(warnLogs[1]).toContain("different durations"); // 異なる拡張子間で duration に差があることの旨

		expect(
			await scanAudioAssets(
				"./game",
				"assets",
				nullLogger
			)
		).toEqual([
			{
				type: "audio",
				path: "assets/_",
				systemId: "sound",
				duration: 8000,
				hint: { extensions: [".ogg"] }
			}
		]);
	});
});
