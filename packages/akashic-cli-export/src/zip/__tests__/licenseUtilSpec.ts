import * as path from "path";
import * as fsx from "fs-extra";
import { writeLicenseTextFile } from "../licenseUtil.js";


describe("licenseUtil", () => {
	const fixturesDir = path.resolve(__dirname, "..", "..", "__tests__", "fixtures");
	const contentPath =  path.resolve(fixturesDir, "simple_game_using_external");
	const destDir = path.resolve(fixturesDir, "output");	
	const moduleFilePaths = [
		"node_modules/external/index.js",
		"node_modules/foo/index.js",
		"node_modules/hoge/index.js",
	]
	const consoleSpy = vi.spyOn(global.console, "warn");

	afterEach(() => {
		fsx.removeSync(destDir);
		consoleSpy.mockRestore();
	});

	it("writeLicenseTextFile()", async () => {
		const result = await writeLicenseTextFile(contentPath, destDir,  moduleFilePaths);

		expect(consoleSpy).toHaveBeenCalledWith("[WARNING]: LICENSE file for foo is \"license-warn\".");
		expect(consoleSpy).toHaveBeenCalledWith("[WARNING]: LICENSE for hoge is \"LGPL-3.0-or-later\".");
		expect(result).toBeTruthy();

		const license = fsx.readFileSync(path.join(destDir, "thirdpary_license.txt")).toString().split(/\r?\n/g);
		expect(license).toEqual(
			[
				"# external",
				"",
				"The MIT License (MIT) by external",
				"",
				"# foo",
				"",
				"ISC License　by foo",
				"",
				"# hoge",
				"",
				"LGPL Licens by hoge",
				""
			]	
		);
	});
});
