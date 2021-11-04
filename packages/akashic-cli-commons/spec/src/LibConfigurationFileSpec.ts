import * as mockfs from "mock-fs";
import { LibConfigurationFile } from "../../lib/LibConfigurationFile";
import { ConsoleLogger } from "../../lib/ConsoleLogger";
import { Logger } from "../../lib/Logger";

describe("LibConfigurationFile", () => {
	const mockFsContent = {
		"dirname": {},
		"akashic-lib.json": JSON.stringify({
			gameConfigurationData: {
				environment: {
					dummy: "1"
				}
			}
		}),
		"invalid-json.json": "hogehoge"
	};

	let logger: Logger;
	let loggedResult: string[];
	beforeEach(() => {
		loggedResult = [];
		logger = new ConsoleLogger({ debugLogMethod: loggedResult.push.bind(loggedResult) });
		mockfs(mockFsContent);
	});

	afterEach(() => {
		mockfs.restore();
	});

	describe(".read()", () => {
		it("reads lib file", async () => {
			const content = await LibConfigurationFile.read("./akashic-lib.json");
			expect(content).toEqual({
				gameConfigurationData: {
					environment: {
						dummy: "1"
					}
				}
			});
		});

		it("rejects directory", async () => {
			await expect(
				LibConfigurationFile.read("./dirname")
			).rejects.toThrow();
		});

		it("rejects invalid JSON", async () => {
			await expect(
				LibConfigurationFile.read("./invalid-json.json")
			).rejects.toThrow();
		});
	});

	describe(".write()", () => {
		it("writes to the file", async () => {
			const data = {
				gameConfigurationData: {
					environment: {
						external: {
							dummy: "2"
						}
					}
				}
			};

			await LibConfigurationFile.write(data, "./akashic-lib.json");
			const content = await LibConfigurationFile.read("./akashic-lib.json");
			expect(content).toEqual(data);
		});

		it("rejects writing to directory", async () => {
			await expect(
				LibConfigurationFile.write({}, "./dirname")
			).rejects.toThrow();
		});
	});
});

