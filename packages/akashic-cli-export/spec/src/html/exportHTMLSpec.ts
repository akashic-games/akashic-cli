import * as fsx from "fs-extra";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as exp from "../../../lib/html/exportHTML";

describe("exportHTML", function () {
	const logger = new cmn.ConsoleLogger({
		quiet: true,
		debugLogMethod: err => { /* do nothing */ }
	});

	it("_completeExportHTMLParameterObject", function (done) {
		Promise.resolve()
		.then(function () {
			const param: exp.ExportHTMLParameterObject = {
				logger: undefined,
				cwd: process.cwd(),
				source: path.join(process.cwd(), "content"),
				output: process.cwd(),
				force: true,
				strip: true,
				minify: false,
				magnify: false,
				unbundleText: false,
				lint: false
			};
			const result = exp._completeExportHTMLParameterObject(param);
			expect(param.logger).toBe(undefined);
			expect(result.logger).not.toBe(undefined);
			})
		.then(done, done.fail);
	});

	it("_completeExportHTMLParameterObject - fullpath", function (done) {
		Promise.resolve()
		.then(function () {
			let param: exp.ExportHTMLParameterObject = {
				logger: undefined,
				cwd: path.join(process.cwd(), ""),
				source: path.join(process.cwd(), "content"),
				output: path.join(process.cwd(), "output"),
				force: true,
				strip: true,
				minify: false,
				magnify: false,
				unbundleText: false,
				lint: false
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
				magnify: false,
				unbundleText: false,
				lint: false
			};
			result = exp._completeExportHTMLParameterObject(param);
			expect(result.output).toBe(path.join(process.cwd(), "output"));
		})
		.then(done, done.fail);
	});


	it("promiseExportHTML", function (done) {
		Promise.resolve()
		.then(function () {
			const param: exp.ExportHTMLParameterObject = {
				logger: undefined,
				cwd: path.join(__dirname, "..", "..", "fixtures", "sample_game"),
				source: ".",
				output: undefined,
				force: true,
				strip: true,
				minify: false,
				magnify: false,
				unbundleText: false,
				lint: false
			};
			return exp.promiseExportHTML(param);
		})
		.then((dest) => {
			expect(dest).toMatch(/^.*akashic-export-html-tmp-.+$/);
			fsx.removeSync(dest);
		})
		.then(done, done.fail);
	});
});
