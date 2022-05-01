import * as path from "path";
import { GenerateHTML } from "../../../lib/html/generate";

describe("generate", function () {
	describe("makeInjectionEntries", function () {
		const sampleScriptContent = "<script>\n\tconsole.log(\"test\");\n</script>\n";
		const sampleStyleContent = "<style type=\"text/css\">\n" +
			"\tbody{\n" +
			"\t\toverflow: hidden;\n" +
			"\t}\n" +
			"</style>\n";

		it("can get file content", async function () {
			const existFileContents = await GenerateHTML.internal.makeInjectionEntries([
				path.join(__dirname, "../../fixtures/innerhtml/sample_script.html")
			]);
			expect(existFileContents.length).toBe(1);
			expect(existFileContents[0]).toEqual({ content: sampleScriptContent });
		});
		it("can get file contents in specified directory", async function () {
			const existFileContents = await GenerateHTML.internal.makeInjectionEntries([
				path.join(__dirname, "../../fixtures/innerhtml")
			]);
			expect(existFileContents.length).toBe(2);
			expect(existFileContents[0]).toEqual({ content: sampleScriptContent });
			expect(existFileContents[1]).toEqual({ content: sampleStyleContent });
		});
		it("can get file contents by specified order", async function () {
			const existFileContents = await GenerateHTML.internal.makeInjectionEntries([
				path.join(__dirname, "../../fixtures/innerhtml/sample_style.html"),
				path.join(__dirname, "../../fixtures/innerhtml/sample_script.html")
			]);
			expect(existFileContents.length).toBe(2);
			expect(existFileContents[0]).toEqual({ content: sampleStyleContent });
			expect(existFileContents[1]).toEqual({ content: sampleScriptContent });
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
			expect(decodeURIComponent(GenerateHTML.internal.encodeText(targetString))).toBe(targetString);
		});
	});
});
