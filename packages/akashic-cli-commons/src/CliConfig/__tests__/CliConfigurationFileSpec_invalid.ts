import * as mockfs from "mock-fs";
import * as path from "path";
import { CliConfigurationFile } from "../../../lib/CliConfig/CliConfigurationFile";

describe("invalid ConfigurationFile", function () {

	var mockBrokenCAkashicConfigJs = {
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

	describe(".read()", function () {
		beforeEach(function () {
			mockfs(mockBrokenCAkashicConfigJs);
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
							port: 3030
						}
					}
				});
				done.fail();
			});
		});
	});
});

