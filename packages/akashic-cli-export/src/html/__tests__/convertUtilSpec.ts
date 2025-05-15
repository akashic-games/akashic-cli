import type { GameConfiguration } from "@akashic/akashic-cli-commons";
import type { ImageAssetConfigurationBase } from "@akashic/game-configuration";
import { validateGameJson } from "../../utils.js";
import * as convert from "../convertUtil.js";

describe("convertUtil", function () {
	describe("getInjectedContents", function () {
		const sampleScriptContent = "<script>\n\tconsole.log(\"test\");\n</script>\n";
		const sampleStyleContent = "<style type=\"text/css\">\n" +
			"\tbody{\n" +
			"\t\toverflow: hidden;\n" +
			"\t}\n" +
			"</style>\n";

		it("can get file content", function () {
			const existFileContents = convert.getInjectedContents(
				__dirname,
				["../../__tests__/fixtures/innerhtml/sample_script.html"]
			);
			expect(existFileContents.length).toBe(1);
			expect(existFileContents[0]).toBe(sampleScriptContent);
		});
		it("can get file contents in specified directory", function () {
			const existFileContents = convert.getInjectedContents(__dirname, ["../../__tests__/fixtures/innerhtml"]);
			expect(existFileContents.length).toBe(2);
			expect(existFileContents[0]).toBe(sampleScriptContent);
			expect(existFileContents[1]).toBe(sampleStyleContent);
		});
		it("can get file contents by specified order", function () {
			const existFileContents = convert.getInjectedContents(
				__dirname,
				["../../__tests__/fixtures/innerhtml/sample_style.html", "../../__tests__/fixtures/innerhtml/sample_script.html"]
			);
			expect(existFileContents.length).toBe(2);
			expect(existFileContents[0]).toBe(sampleStyleContent);
			expect(existFileContents[1]).toBe(sampleScriptContent);
		});
	});
	describe("encodeText", function () {
		it("can encode specified characters and the characters can be decode", function () {
			let targetString = "";
			for (let i = 0; i < 128; i++) {
				targetString += String.fromCharCode(i);
			}
			targetString += "\u2028\u2029";
			targetString += "あいうえお";
			targetString += "１２３４５％＆’”";
			targetString += "漢字例";
			targetString += "○×";
			expect(decodeURIComponent(convert.encodeText(targetString))).toBe(targetString);
		});
	});
	describe("addUntaintedToImageAssets", function () {
		it("add 'untainted: true' to image asset on specified gamejson", function () {
			const gamejson: GameConfiguration = {
				"width": 320,
				"height": 320,
				"fps": 30,
				"main": "./script/main.js",
				"assets": {
					"main": {
						"type": "script",
						"path": "script/main.js",
						"global": true
					},
					"sample_image1": {
						"type": "image",
						"width": 150,
						"height": 149,
						"path": "image/sample_image1.png"
					},
					"sample_image2": {
						"type": "image",
						"width": 150,
						"height": 149,
						"path": "image/sample_image2.png"
					},
					"sample_text1": {
						"type": "text",
						"path": "texte/sample_text1.png"
					}
				}
			};
			convert.addUntaintedToImageAssets(gamejson);
			// ImageAssetには "untainted: true" が付与される
			const sampleImage1 = gamejson.assets.sample_image1 as ImageAssetConfigurationBase;
			const sampleImage2 = gamejson.assets.sample_image2 as ImageAssetConfigurationBase;
			expect(sampleImage1.hint.untainted).toBeTruthy();
			expect(sampleImage2.hint.untainted).toBeTruthy();
			// ImageAsset以外には "untainted: true" が付与されない
			expect(gamejson.assets.main.hasOwnProperty("hint")).toBeFalsy();
			expect(gamejson.assets.sample_text1.hasOwnProperty("hint")).toBeFalsy();
		});
	});
	describe("removeUntaintedToImageAssets", function () {
		it("remove 'hint.untainted' to image asset on specified gamejson", function () {
			const gamejson: GameConfiguration = {
				"width": 320,
				"height": 320,
				"fps": 30,
				"main": "./script/main.js",
				"assets": {
					"sample_image1": {
						"type": "image",
						"width": 150,
						"height": 149,
						"path": "image/sample_image1.png",
						"hint": {
							"untainted": true
						}
					}
				}
			};
			convert.removeUntaintedHints(gamejson);
			const sampleImage1 = gamejson.assets.sample_image1 as ImageAssetConfigurationBase;
			expect(sampleImage1.hint).toEqual({});
			expect(sampleImage1.hint.untainted).toBeUndefined();
		});
	});
	describe("validateGameJson", function () {
		it("throw Error when specified gamejson include @akashic/akashic-engine", function () {
			const gamejson: any = {
				"moduleMainScripts": {
					"@akashic/akashic-engine": "node_modules/@akashic/akashic-engine/index.js"
				}
			};
			expect(() => validateGameJson(gamejson)).toThrow();
		});
	});

	describe("validateSandboxConfigJs", () => {
		const sandboxConfig = {
			autoSendEventName: "mySessionParameter",
			arguments: {
			  hoge: {"test": "test"}
			},
			events: {
				"mySessionParameter": [32, 0, ":akashic", {}]
			}
		};

		it("throw error if autoSendEventName is not in events in sandbox.config.js", () => {
			expect(() => convert.validateSandboxConfigJs(sandboxConfig, "mySessionParameter", "hoge")).not.toThrow();
			expect(() => convert.validateSandboxConfigJs(sandboxConfig, "dummy", "hoge"))
				.toThrow("dummy does not exist in events in sandbox.config.js.");
			expect(() => convert.validateSandboxConfigJs(sandboxConfig, "mySessionParameter", "dummy"))
				.toThrow("dummy does not exist in arguments in sandbox.config.js.");

			// autoSendEventName が 真偽値の場合
			expect(() => convert.validateSandboxConfigJs(sandboxConfig, true, "hoge")).not.toThrow();
			sandboxConfig.autoSendEventName = "foo";
			expect(() => convert.validateSandboxConfigJs(sandboxConfig, true, "dummy"))
				.toThrow("foo does not exist in events in sandbox.config.js.");
		});
	});

	describe("wrap", () => {
		it("babel arguments enabled/disabled", () => {
			const code = `
			test = () => {
				return x ** 2;
			};`
			const downpiled = convert.wrap(code, {}, true);
			expect(/\(\)\s?=>/.test(downpiled)).toBeTruthy(); // ES2015 のアロー関数はそのまま
			expect(/\*\*/.test(downpiled)).toBeFalsy(); // ES2016 のべき乗演算子は Math.pow()に変換される

			const noDownpiled = convert.wrap(code, null, false);
			expect(/\(\)\s?=>/.test(noDownpiled)).toBeTruthy(); 
			expect(/\*\*/.test(noDownpiled)).toBeTruthy(); 
		});
	})
});
