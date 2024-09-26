import * as mockfs from "mock-fs";
import * as path from "path";
import { CliConfigurationFile } from "../../../lib/CliConfig/CliConfigurationFile";

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
