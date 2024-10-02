import mockfs from "mock-fs";
import { ConfigurationFile } from "../ConfigurationFile.js";
import { ConsoleLogger } from "../ConsoleLogger.js";
import { Logger } from "../Logger.js";

describe("ConfigurationFile", () => {

	const mockFsContent = {
		"dirname": {
			"foo.js": ""
		},
		"game1.json": JSON.stringify({
			width: 320,
			height: 50,
			fps: 45,
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
		it("reads configuration file", async () => {
			const content = await ConfigurationFile.read("./game1.json", logger);
			expect(content).toEqual({
				width: 320,
				height: 50,
				fps: 45
			});
		});

		it("rejects directory", async () => {
			await expect(ConfigurationFile.read("./dirname", logger)).rejects.toThrow();
		});

		it("creates empty data unless the file exists", async () => {
			const content = await ConfigurationFile.read("./inexistent.json", logger);
			expect(loggedResult.length).toBe(1);
			expect(content).toEqual({});
		});

		it("rejects invalid JSON", async () => {
			await expect(ConfigurationFile.read("./invalid-json.json", logger)).rejects.toThrow();
		});
	});

	describe(".write()", () => {
		it("writes to the file", async () => {
			const data = { width: 10, height: 5, fps: 30, main: "main.js", assets: {} };
			await ConfigurationFile.write(data, "./game1.json", logger);
			const content = await ConfigurationFile.read("./game1.json", logger);
			expect(content).toEqual(data);
		});

		it("rejects writing to directory", async () => {
			await expect(
				ConfigurationFile.write({} as any, "./dirname", logger) // 中身は問わないので any
			).rejects.toThrow();
		});
	});
});
