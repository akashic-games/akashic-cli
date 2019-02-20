var mockPrompt = require("./support/mockPrompt");
var bp = require("../lib/BasicParameters");
var mockfs = require("mock-fs");
var fs = require("fs-extra");
var os = require("os");
var path = require("path");
var commons = require("@akashic/akashic-cli-commons");

describe("BasicParameters", function () {
	describe("updateConfigurationFile()", function () {
		var confPath = path.join(os.tmpdir(), ".akashicrc");
		var quietLogger = new commons.ConsoleLogger({quiet: true});

		beforeEach(() => {
			mockfs({});
			mockPrompt.mock({ width: 42, height: 27, fps: 30 });
		});

		afterEach(() => {
			mockPrompt.restore();
			mockfs.restore();
		});

		it("update game.json", done => {
			var conf = { width: 12, height: 23, fps: 34, assets: {} };
			fs.writeJsonSync(confPath, conf);
			bp.updateConfigurationFile(confPath, quietLogger)
				.then(() => {
					expect(fs.readJsonSync(confPath))
						.toEqual({width: 42, height: 27, fps: 30, assets: {}});
				})
				.then(done, done.fail);
		});

		describe("parameter value is not number", () => {
			it("value is NaN", done => {
				mockPrompt.mock({ width: NaN, height: 27, fps: 30 });
				bp.updateConfigurationFile(confPath, quietLogger)
					.then(() => {done.fail();})
					.catch((err) => {
						expect(err).toBe("width must be a number");
						done();
					});
			});

			it("value is null", done => {
				mockPrompt.mock({ width: null, height: 27, fps: 30 });
				bp.updateConfigurationFile(confPath, quietLogger)
					.then(() => {done.fail();})
					.catch((err) => {
						expect(err).toBe("width must be a number");
						done();
					});
			});

			it("value is string", done => {
				mockPrompt.mock({ width: 111, height: "aaa", fps: 30 });
				bp.updateConfigurationFile(confPath, quietLogger)
					.then(() => {done.fail();})
					.catch((err) => {
						expect(err).toBe("height must be a number");
						done();
					});
			});

			it("value is undefined", done => {
				mockPrompt.mock({ width: 111, height: 222, fps: undefined });
				bp.updateConfigurationFile(confPath, quietLogger)
					.then(() => {done.fail();})
					.catch((err) => {
						expect(err).toBe("fps must be a number");
						done();
					});
			});

		});

	});
});
