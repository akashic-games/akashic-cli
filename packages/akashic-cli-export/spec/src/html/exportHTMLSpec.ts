import * as path from "path";
import * as fsx from "fs-extra";
import * as exp from "../../../lib/html/exportHTML";

describe("exportHTML", function () {
	it("_completeExportHTMLParameterObject", (done) => {
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

	it("_completeExportHTMLParameterObject - fullpath", (done) => {
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


	it("promiseExportHTML", (done) => {
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

	it("output option has zip extension", (done) => {
		Promise.resolve()
			.then(function () {
				const param: exp.ExportHTMLParameterObject = {
					logger: undefined,
					cwd: path.join(__dirname, "..", "..", "fixtures", "sample_game"),
					source: ".",
					output: "../output.zip",
					force: true,
					strip: true,
					minify: false,
					magnify: false,
					unbundleText: false,
					lint: false,
					compress: true
				};
				return exp.promiseExportHTML(param);
			})
			.then((dest) => {
				expect(dest).toBe(path.join(__dirname, "..", "..", "fixtures", "output.zip"));
				fsx.removeSync(dest);
			})
			.then(done, done.fail);
	});

});
