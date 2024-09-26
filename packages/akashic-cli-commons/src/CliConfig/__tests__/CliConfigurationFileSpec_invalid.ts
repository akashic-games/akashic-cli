import mockfs from "mock-fs";
import * as path from "path";
import { CliConfigurationFile } from "../../CliConfig/CliConfigurationFile.js";

describe("invalid ConfigurationFile", () => {

	const mockBrokenCAkashicConfigJs = {
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

	describe(".read()", () => {
		beforeEach(() => {
			mockfs(mockBrokenCAkashicConfigJs);
		});
		afterEach(() => {
			mockfs.restore();
		});

		it("invalid akashic.config.js", async () => {
			await expect(new Promise((resolve, reject) => {
				CliConfigurationFile.read(path.join(process.cwd(), "./akashic.config.js"), (error, config) => {
					if (error) return reject(error);
					resolve(config);
				});
			})).resolves.toEqual({
				commandOptions: {}
			});
		});
	});
});
