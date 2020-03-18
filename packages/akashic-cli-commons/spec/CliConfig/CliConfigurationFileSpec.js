var mockfs = require("mock-fs");
var path = require("path");
var CliConfigurationFile = require("../../lib/CliConfig/CliConfigurationFile").CliConfigurationFile;

describe("ConfigurationFile", function () {

	describe(".read()", function () {

		var mockCAkashicConfigJs = {
			"akashic.config.js": `
			var config = {
				commandOptions: {
					serve: {
						port: 3030
					}
				}
			}
			module.exports = config;
			`
		};

		beforeEach(function () {
			mockfs(mockCAkashicConfigJs);
		});
		afterEach(function () {
			mockfs.restore();
		});
		it("reads akashic.config.js", function (done) {
			CliConfigurationFile.read(path.join(process.cwd(), "./akashic.config.js"), (error, config) => {
				if (error) return done.fail();
				expect(config).toEqual({
					commandOptions: {
						serve: {
							port: 3030
						}
					}
				});
				done();
			})
		});
		it("invalid path", function (done) {
			CliConfigurationFile.read("./invalid/dir/akashic.config.js", (error, config) => {
				expect(config).toEqual({
					commandOptions: {}
				});
				done();
			});
		});
	});
});

describe("invalid ConfigurationFile", function () {

	var mockBrokenCAkashicConfigJs = {
		"akashic.config.js": `
		var config = {
			commandOptions: {
				serve: {
					port: 30303030
				}
			}
		}
		module.exports = config;
		`
	};

	describe(".read()", function () {
		beforeEach(function () {
			mockfs({

			});
		});
		afterEach(function () {
			mockfs.restore();
		});
		it("invalid akashic.config.js", function (done) {
			CliConfigurationFile.read(path.join(process.cwd(), "./akashic.config.js"), (error, config) => {
				if (error) return done();
				expect(config).toEqual({
					commandOptions: {
						serve: {
							port: 3000000000
						}
					}
				});
				done.fail();
			});
		});
	});
});

