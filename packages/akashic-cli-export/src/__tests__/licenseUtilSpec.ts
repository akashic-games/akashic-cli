import * as path from "path";
import * as fs from "fs";
import { writeLicenseTextFile } from "../licenseUtil.js";


describe("licenseUtil", () => {
	const fixturesDir = path.resolve(__dirname, "..", "__tests__", "fixtures");
	const contentPath =  path.resolve(fixturesDir, "simple_game_using_external");
	const destDir = path.resolve(fixturesDir, "output");	
	const moduleFilePaths = [
		"node_modules/external/index.js",
		"node_modules/foo/index.js",
		"node_modules/hoge/index.js",
	]
	const consoleSpy = vi.spyOn(global.console, "warn");

	afterEach(() => {
		fs.rmSync(destDir, {recursive: true});
		consoleSpy.mockRestore();
	});

	it("writeLicenseTextFile()", async () => {
		const result = await writeLicenseTextFile(contentPath, destDir,  moduleFilePaths);

		expect(consoleSpy).toBeCalledWith(expect.stringMatching(/^\[WARN\].+license-warn.+foo.+.$/));		
		expect(consoleSpy).toBeCalledWith(expect.stringMatching(/^\[WARN\].+hoge.+LGPL-3.0-or-later.+.$/));
		expect(result).toBeTruthy();

		const license = fs.readFileSync(path.join(destDir, "library_license.txt")).toString().split(/\r?\n/g);
		expect(license).toEqual(
			[
				"# external",
				"",
				"The MIT License (MIT) by external",
				""
			]
		);
	});

	it("writeLicenseTextFile() with akashic license", async () => {
		const result = await writeLicenseTextFile(contentPath, destDir,  moduleFilePaths, "3");
		expect(result).toBeTruthy();

		const license = fs.readFileSync(path.join(destDir, "library_license.txt")).toString().split(/\r?\n/g);
		const licenseTxt = license.join("\n");
		// library_license.txt の内容に akashic の各ライブラリ名が含まれていることを確認
		expect(/\@akashic\/akashic-engine/.test(licenseTxt)).toBeTruthy();
		expect(/\@akashic\/amflow/.test(licenseTxt)).toBeTruthy();
		expect(/\@akashic\/amflow-util/.test(licenseTxt)).toBeTruthy();
		expect(/\@akashic\/game-driver/.test(licenseTxt)).toBeTruthy();
		expect(/\@akashic\/game-configuration/.test(licenseTxt)).toBeTruthy();
		expect(/\@akashic\/pdi-browser/.test(licenseTxt)).toBeTruthy();
		expect(/\@akashic\/pdi-common-impl/.test(licenseTxt)).toBeTruthy();
		expect(/\@akashic\/pdi-types/.test(licenseTxt)).toBeTruthy();
		expect(/\@akashic\/playlog/.test(licenseTxt)).toBeTruthy();
		expect(/\@akashic\/trigger/.test(licenseTxt)).toBeTruthy();
	});
});
