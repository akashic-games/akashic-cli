const mockfs = require("mock-fs");
const LibConfigurationFile = require("../lib/LibConfigurationFile").LibConfigurationFile;
const ConsoleLogger = require("../lib/ConsoleLogger").ConsoleLogger;

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

	let logger, loggedResult;
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
			const content = await LibConfigurationFile.read("./akashic-lib.json", logger);
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
				LibConfigurationFile.read("./dirname", logger)
			).rejects.toThrow();
		});

		it("rejects invalid JSON", async () => {
			await expect(
				LibConfigurationFile.read("./invalid-json.json", logger)
			).rejects.toThrow();
		});
	});

	describe(".write()", () => {
		it("writes to the file", async () => {
			const data = {
				gameConfigurationData: {
					environment: {
						dummy: "2"
					}
				}
			};

			await LibConfigurationFile.write(data, "./akashic-lib.json", logger);
			const content = await LibConfigurationFile.read("./akashic-lib.json", logger);
			expect(content).toEqual(data);
		});

		it("rejects writing to directory", async () => {
			await expect(
				LibConfigurationFile.write({}, "./dirname", logger)
			).rejects.toThrow();
		});
	});
});

