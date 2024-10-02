import { CliConfigurationFile } from "../../CliConfig/CliConfigurationFile.js";
const mock = require("mock-require");

describe("ConfigurationFile", () => {
	describe(".read()", () => {
		beforeEach(() => {
			mock("akashic.config.js", ({
				commandOptions: {
					serve: {
						port: 3030
					}
				}
			}));
		});
		afterEach(() => {
			mock.stop("akashic.config.js");
		});

		it("reads akashic.config.js", async () => {
			const config = await new Promise((resolve, reject) => {
				CliConfigurationFile.read("akashic.config.js", (error, config) => {
					if (error) return reject(error);
					resolve(config);
				});
			});
			expect(config).toEqual({
				commandOptions: {
					serve: {
						port: 3030
					}
				}
			});
		});

		it("invalid path", async () => {
			const config = await new Promise((resolve) => {
				CliConfigurationFile.read("./invalid/dir/akashic.config.js", (_error, config) => {
					resolve(config);
				});
			});
			expect(config).toEqual({
				commandOptions: {}
			});
		});
	});
});
