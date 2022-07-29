import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as exp from "../../../lib/html/exportHTML";

function normalizeExportHTMLConvertOption(param: Partial<exp.ExportHTMLConvertOption>): exp.ExportHTMLConvertOption {
	return {
		strip: false,
		minifyJs: false,
		minifyJson: false,
		babel: false,
		bundle: false,
		omitUnbundledJs: false,
		completeEnvironment: false,
		packImage: false,
		needUntaintedImage: false,
		hashLength: 0,
		targetService: "none",
		optionInfo: null,
		...param
	};
}

function normalizeExportHTMLGenerateOption(param: Partial<exp.ExportHTMLGenerateOption>): exp.ExportHTMLGenerateOption {
	return {
		magnify: false,
		injects: [],
		autoSendEventName: false,
		engineFiles: null,
		embed: false,
		destructive: false,
		useRawText: false,
		optionInfo: null,
		...param
	};
}

describe("exportHTML", function () {
	it("create a zip file for compress option", (done) => {
		const dest = path.join(__dirname, "..", "..", "fixtures", "sample_game_output.zip");
		expect(fsx.existsSync(dest)).toBe(false);
		Promise.resolve()
			.then(function () {
				const param: exp.ExportHTMLParameterObject = {
					logger: new ConsoleLogger(),
					cwd: path.join(__dirname, "..", "..", "fixtures", "sample_game"),
					source: ".",
					output: "../sample_game_output.zip",
					force: true,
					compress: true,
					convertOption: normalizeExportHTMLConvertOption({ strip: true }),
					generateOption: normalizeExportHTMLGenerateOption({})
				};
				return exp.exportHTML(param);
			})
			.then(() => {
				expect(fsx.existsSync(dest)).toBe(true);
				expect(fsx.readFileSync(dest).readInt32LE(0)).toBe(0x04034b50); // PK\3\4
				fsx.removeSync(dest);
			})
			.then(done, done.fail);
	});

	it("uses given engineFiles", (done) => {
		const dest = path.join(__dirname, "..", "..", "fixtures", "sample_game_v3_output");
		expect(fsx.existsSync(dest)).toBe(false);
		Promise.resolve()
			.then(() => {
				const param: exp.ExportHTMLParameterObject = {
					logger: new ConsoleLogger(),
					cwd: path.join(__dirname, "..", "..", "fixtures", "sample_game_v3"),
					source: ".",
					output: "../sample_game_v3_output",
					force: true,
					convertOption: normalizeExportHTMLConvertOption({
						strip: true
					}),
					generateOption: normalizeExportHTMLGenerateOption({
						engineFiles: path.join(__dirname, "..", "..", "fixtures", "engineFilesV3_1_99.js")
					})
				};
				return exp.exportHTML(param);
			})
			.then(() => {
				expect(fsx.existsSync(dest)).toBe(true);
				expect(fsx.statSync(path.join(dest, "runtime", "engineFilesV3_1_99.js"))).toBeTruthy();
				const buff = fsx.readFileSync(path.join(dest, "index.html"));
				// index.html で指定したengineFiles が読み込まれている
				expect(buff.toString().includes("<script src=\"runtime/engineFilesV3_1_99.js\"")).toBeTruthy();
				fsx.removeSync(dest);
			})
			.then(done, done.fail);
	});

	it("embeds given engineFiles when speficied with embed option", (done) => {
		const dest = path.join(__dirname, "..", "..", "fixtures", "sample_game_v3_output2");
		expect(fsx.existsSync(dest)).toBe(false);
		Promise.resolve()
			.then(() => {
				const param: exp.ExportHTMLParameterObject = {
					logger: new ConsoleLogger(),
					cwd: path.join(__dirname, "..", "..", "fixtures", "sample_game_v3"),
					source: ".",
					output: "../sample_game_v3_output2",
					force: true,
					convertOption: normalizeExportHTMLConvertOption({
						strip: true
					}),
					generateOption: normalizeExportHTMLGenerateOption({
						embed: true,
						engineFiles: path.join(__dirname, "..", "..", "fixtures", "engineFilesV3_1_99.js")
					})
				};
				return exp.exportHTML(param);
			})
			.then(() => {
				expect(fsx.existsSync(path.join(dest, "js"))).toBeFalsy();
				const buff = fsx.readFileSync(path.join(dest, "index.html"));
				expect(buff.toString().includes("dummy-engineFilesV3_1_99")).toBeTruthy(); // engineFiles の中身が index.html に存在する
				fsx.removeSync(dest);
			})
			.then(done, done.fail);
	});
});
