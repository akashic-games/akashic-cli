var mockfs = require("mock-fs");
var path = require("path");
var CliConfigurationFile = require("../../lib/CliConfig/CliConfigurationFile").CliConfigurationFile;

describe("ConfigurationFile", function () {

	describe(".read()", function () {
		beforeEach(function () {
			jest.mock("akashic.config.js", () => {
				return {
					commandOptions: {
						serve: {
							port: 3030
						}
					}
				};
			}, {virtual: true});
		});

		it("reads akashic.config.js", function (done) {
			CliConfigurationFile.read("akashic.config.js", (error, config) => {
				if (error) return done.fail();
				expect(config).toEqual({
					commandOptions: {
						serve: {
							port: 3030
						}
					}
				});
				done();
			});
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
