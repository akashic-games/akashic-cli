var mockfs = require("mock-fs");
var CliConfigurationFile = require("../../lib/CliConfig/CliConfigurationFile").CliConfigurationFile;
var ConsoleLogger = require("../../lib/ConsoleLogger").ConsoleLogger;

describe("ConfigurationFile", function () {

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

	var logger, loggedResult;
	beforeEach(function () {
		loggedResult = [];
		logger = new ConsoleLogger({ debugLogMethod: loggedResult.push.bind(loggedResult) });
		mockfs(mockCAkashicConfigJs);
	});
	afterEach(function () {
		mockfs.restore();
	});

	describe(".read()", function () {
		it("reads akashic.config.js", function (done) {
			var path = require("path");
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
				if (error) return done();
				expect(config).toEqual({
					commandOptions: {}
				});
				done.fail();
			});
		});
	});
});

