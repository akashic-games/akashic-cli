import * as path from "path";
import * as fsx from "fs-extra";
import { writeLicenseTextFile } from "../licenseUtil.js";


describe("licenseUtil", () => {
	const fixturesDir = path.resolve(__dirname, "..", "__tests__", "fixtures");
	console.log("+ fixturesDir:", fixturesDir);
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

		expect(consoleSpy).toBeCalledWith(expect.stringMatching(/^\[WARNING\].+license-warn.+foo.+.$/));		
		expect(consoleSpy).toBeCalledWith(expect.stringMatching(/^\[WARNING\].+hoge.+LGPL-3.0-or-later.+.$/));
		expect(result).toBeTruthy();

		const license = fsx.readFileSync(path.join(destDir, "library_license.txt")).toString().split(/\r?\n/g);
		expect(license).toEqual(
			[
				"# external",
				"",
				"The MIT License (MIT) by external",
				""
			]
		);
	});
});
