import * as path from "path";
import * as fsx from "fs-extra";
import * as exp from "../exportHTML.js";

describe("exportHTML", function () {
	it("_completeExportHTMLParameterObject", () => {
		return Promise.resolve()
			.then(function () {
				const param: exp.ExportHTMLParameterObject = {
					logger: undefined,
					cwd: process.cwd(),
					source: path.join(process.cwd(), "content"),
					output: process.cwd(),
					force: true,
					strip: true,
					minify: false,
					terser: {},
					magnify: false,
					unbundleText: false
				};
				const result = exp._completeExportHTMLParameterObject(param);
				expect(param.logger).toBe(undefined);
				expect(result.logger).not.toBe(undefined);
			});
	});

	it("_completeExportHTMLParameterObject - fullpath", () => {
		return Promise.resolve()
			.then(function () {
				let param: exp.ExportHTMLParameterObject = {
					logger: undefined,
					cwd: path.join(process.cwd(), ""),
					source: path.join(process.cwd(), "content"),
					output: path.join(process.cwd(), "output"),
					force: true,
					strip: true,
					minify: false,
					terser: {},
					magnify: false,
					unbundleText: false
				};
				let result = exp._completeExportHTMLParameterObject(param);
				expect(result.output).toBe(path.join(process.cwd(), "output"));

				param = {
					logger: undefined,
					cwd: path.join(process.cwd(), "content"),
					source: ".",
					output:  "../output",
					force: true,
					strip: true,
					minify: false,
					terser: {},
					magnify: false,
					unbundleText: false
				};
				result = exp._completeExportHTMLParameterObject(param);
				expect(result.output).toBe(path.join(process.cwd(), "output"));
			});
	});


	it("promiseExportHTML", () => {
		return Promise.resolve()
			.then(function () {
				const param: exp.ExportHTMLParameterObject = {
					logger: undefined,
					cwd: path.join(__dirname, "..", "..", "__tests__", "fixtures", "sample_game"),
					source: ".",
					output: undefined,
					force: true,
					strip: true,
					minify: false,
					terser: {},
					magnify: false,
					unbundleText: false
				};
				return exp.promiseExportHTML(param);
			})
			.then((dest) => {
				expect(dest).toMatch(/^.*akashic-export-html-tmp-.+$/);
				expect(fsx.existsSync(path.join(dest, "library_license.txt"))).toBeTruthy();
				fsx.removeSync(dest);
			});
	});

	it("output option has zip extension", () => {
		return Promise.resolve()
			.then(function () {
				const param: exp.ExportHTMLParameterObject = {
					logger: undefined,
					cwd: path.join(__dirname, "..", "..", "__tests__", "fixtures", "sample_game"),
					source: ".",
					output: "../output.zip",
					force: true,
					strip: true,
					minify: false,
					terser: {},
					magnify: false,
					unbundleText: false,
					compress: true
				};
				return exp.promiseExportHTML(param);
			})
			.then((dest) => {
				expect(dest).toBe(path.join(__dirname, "..", "..", "__tests__", "fixtures", "output.zip"));
				fsx.removeSync(dest);
			});
	});

	it("promiseExportHTML with debugOverrideEngineFiles option", () => {
		return Promise.resolve()
			.then(() => {
				const param: exp.ExportHTMLParameterObject = {
					logger: undefined,
					cwd: path.join(__dirname, "..", "..", "__tests__", "fixtures", "sample_game_v3"),
					source: ".",
					output: undefined,
					force: true,
					strip: false,
					minify: false,
					terser: {},
					magnify: false,
					unbundleText: false,
					debugOverrideEngineFiles: path.join(__dirname, "..", "..", "__tests__", "fixtures", "engineFilesV3_1_99.js")
				};
				return exp.promiseExportHTML(param);
			})
			.then((dest) => {
				expect(dest).toMatch(/^.*akashic-export-html-tmp-.+$/);
				expect(fsx.statSync(path.join(dest, "js", "engineFilesV3_1_99.js"))).toBeTruthy();
				const buff = fsx.readFileSync(path.join(dest, "index.html"));
				// index.html で指定したengineFiles が読み込まれている
				expect(buff.toString().includes("<script src=\"./js/engineFilesV3_1_99.js\"")).toBeTruthy();
				fsx.removeSync(dest);
			});
	});

	it("promiseExportHTML with bundole and debugOverrideEngineFiles option", async () => {
		return Promise.resolve()
			.then(() => {
				const param: exp.ExportHTMLParameterObject = {
					logger: undefined,
					cwd: path.join(__dirname, "..", "..", "__tests__", "fixtures", "sample_game_v3"),
					source: ".",
					output: undefined,
					force: true,
					strip: false,
					minify: false,
					terser: {},
					magnify: false,
					unbundleText: false,
					bundle: true,
					debugOverrideEngineFiles: path.join(__dirname, "..", "..", "__tests__", "fixtures", "engineFilesV3_1_99.js")
				};
				return exp.promiseExportHTML(param);
			})
			.then((dest) => {
				expect(dest).toMatch(/^.*akashic-export-html-tmp-.+$/);
				expect(fsx.existsSync(path.join(dest, "js"))).toBeFalsy();
				const buff = fsx.readFileSync(path.join(dest, "index.html"));
				expect(buff.toString().includes("dummy-engineFilesV3_1_99")).toBeTruthy(); // engineFiles の中身が index.html に存在する
				fsx.removeSync(dest);
			});
	});

	it("promiseExportHTML - copy appropriate audio files", async () => {
		const param: exp.ExportHTMLParameterObject = {
			logger: undefined,
			cwd: path.join(__dirname, "..", "..", "__tests__", "fixtures", "sample_game"),
			source: ".",
			output: undefined,
			force: true,
			strip: true,
			minify: false,
			terser: {},
			magnify: false,
			unbundleText: false,
			hashLength: 0 // ファイル名ハッシュ化なし: 改名先が (HTML に埋め込まれた game.json をパースしないと) わからないので
		};
		const dest = await exp.promiseExportHTML(param);
		expect(dest).toMatch(/^.*akashic-export-html-tmp-.+$/);
		expect(fsx.statSync(path.join(dest, "audio", "dummyse.ogg"))).toBeTruthy();
		expect(fsx.statSync(path.join(dest, "audio", "dummyse.aac"))).toBeTruthy();
		expect(fsx.statSync(path.join(dest, "audio", "dummyse.m4a"))).toBeTruthy();
		expect(() => fsx.statSync(path.join(dest, "audio", "dummyse.invalidext"))).toThrow();
		fsx.removeSync(dest);
	});

	it("promiseExportHTML - copy sandbox.config.js to TempDir", () => {
		return Promise.resolve()
			.then(function () {
				const param: exp.ExportHTMLParameterObject = {
					logger: undefined,
					cwd: path.join(__dirname, "..", "..", "__tests__", "fixtures", "sample_game"),
					source: ".",
					output: undefined,
					force: true,
					strip: true,
					minify: true,
					terser: {},
					magnify: false,
					unbundleText: false,
					hashLength: 20,
					autoSendEventName: "sessionParameter",
					autoGivenArgsName: "argumentParameter"
				};
				return exp.promiseExportHTML(param);
			})
			.then((dest) => {
				const html = fsx.readFileSync(path.join(dest, "index.html")).toString("utf-8");
				expect(html.indexOf("autoSendEventName") !== -1).toBeTruthy();
				expect(html.indexOf("sessionParameter") !== -1).toBeTruthy();
				expect(html.indexOf("autoGivenArgsName") !== -1).toBeTruthy();
				expect(html.indexOf("argumentParameter") !== -1).toBeTruthy();
				fsx.removeSync(dest);
			});
	});

});
