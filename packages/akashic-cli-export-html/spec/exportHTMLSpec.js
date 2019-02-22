var cmn = require("@akashic/akashic-cli-commons");
var exp = require("../lib/exportHTML");
var path = require("path");
var fsx = require("fs-extra");

describe("exportHTML", function () {
	var logger = new cmn.ConsoleLogger({
		quiet: true,
		debugLogMethod: err => { /* do nothing */ }
	});

	it("_completeExportHTMLParameterObject", function (done) {
		Promise.resolve()
		.then(function () {
			var param = {
				logger: undefined,
				cwd: process.cwd(),
				output: process.cwd()
			}
			var result = exp._completeExportHTMLParameterObject(param);
			expect(param.logger).toBe(undefined);
			expect(result.logger).not.toBe(undefined);
			})
		.then(done, done.fail);
	});

	it("_completeExportHTMLParameterObject - fullpath", function (done) {
		Promise.resolve()
		.then(function () {
			var param = {
				logger: undefined,
				cwd: path.join(process.cwd(), ""),
				source: path.join(process.cwd(), "content"),
				output: path.join(process.cwd(), "output")
			}
			var result = exp._completeExportHTMLParameterObject(param);
			expect(result.output).toBe(path.join(process.cwd(), "output"));

			param = {
				logger: undefined,
				cwd: path.join(process.cwd(), "content"),
				output:  "../output"
			}
			var result = exp._completeExportHTMLParameterObject(param);
			expect(result.output).toBe(path.join(process.cwd(), "output"));
		})
		.then(done, done.fail);
	});


	it("promiseExportHTML", function (done) {
		Promise.resolve()
		.then(function () {
			var param = {
				logger: undefined,
				cwd: path.join(__dirname, "fixture", "sample_game"),
			}
			return exp.promiseExportHTML(param);
		})
		.then((dest) => {
			expect(dest).toMatch(/^.*\/akashic-export-html-tmp-.+$/);
			fsx.removeSync(dest);
		})
		.then(done, done.fail);
	});
});
