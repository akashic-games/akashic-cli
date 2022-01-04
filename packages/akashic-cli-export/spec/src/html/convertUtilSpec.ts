import { GameConfiguration } from "@akashic/akashic-cli-commons";
import * as convert from "../../../lib/html/convertUtil";

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
				["../../fixtures/innerhtml/sample_script.html"]
			);
			expect(existFileContents.length).toBe(1);
			expect(existFileContents[0]).toBe(sampleScriptContent);
		});
		it("can get file contents in specified directory", function () {
			const existFileContents = convert.getInjectedContents(__dirname, ["../../fixtures/innerhtml"]);
			expect(existFileContents.length).toBe(2);
			expect(existFileContents[0]).toBe(sampleScriptContent);
			expect(existFileContents[1]).toBe(sampleStyleContent);
		});
		it("can get file contents by specified order", function () {
			const existFileContents = convert.getInjectedContents(
				__dirname,
				["../../fixtures/innerhtml/sample_style.html", "../../fixtures/innerhtml/sample_script.html"]
			);
			expect(existFileContents.length).toBe(2);
			expect(existFileContents[0]).toBe(sampleStyleContent);
			expect(existFileContents[1]).toBe(sampleScriptContent);
		});
	});
	describe("validateEs5Code", function () {
		it("return empty array if code is written with ES5 syntax", async function () {
			const es5Code = `
				"use strict";
				var fn = function () {
					return 1;
				};
				var array = [1, 2];
				var a = array[0];
				var b = array[1];
			`;
			expect((await convert.validateEs5Code("es5.js", es5Code)).length).toBe(0);
		});
		it("return error messages if code is not written with ES5 syntax", async function () {
			const es6Code = `
				"use strict";
				const fn = () => {
					return 1;
				}
				const array = [1, 3];
				const [a, b] = array;
			`;
			const result = await convert.validateEs5Code("es6.js", es6Code);
			expect(result.length).toBe(1);
			expect(result[0]).toBe("es6.js(3:5): Parsing error: The keyword \'const\' is reserved");
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
			expect(gamejson.assets.sample_image1.hint.untainted).toBeTruthy();
			expect(gamejson.assets.sample_image2.hint.untainted).toBeTruthy();
			// ImageAsset以外には "untainted: true" が付与されない
			expect(gamejson.assets.main.hint).toBeUndefined();
			expect(gamejson.assets.sample_text1.hint).toBeUndefined();
		});
	});
});
