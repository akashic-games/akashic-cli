import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as akashicConfig from "../config.js";

describe("config module", () => {
	const confDirPath = fs.mkdtempSync(path.join(os.tmpdir(), "akashic-cli-config"));

	const testValidator = {
		"apple.item1": "^\\w+$",
		"apple.item2": "^\\d+$",
		"banana.item3": "^\\w+$"
	};

	it("AkashicConfigFile", async () => {
		const confPath = path.join(confDirPath, ".akashicrc");
		fs.writeFileSync(confPath, "");
		const config = new akashicConfig.AkashicConfigFile(testValidator, confPath);

		await config.setItem("apple.item1", "testValue");
		await config.setItem("apple.item2", "42");
		await config.save();
		await config.load();
		let value = await config.getItem("apple.item1");
		expect(value).toBe("testValue");
		value = await config.getItem("apple.item2");
		expect(value).toBe("42");
		value = await config.getItem("banana.item3");
		expect(value).toBeNull();
	});
});

describe("cli functions", () => {
	const confDirPath = fs.mkdtempSync(path.join(os.tmpdir(), "akashic-cli-config"));
	const confPath = path.join(confDirPath, ".akashicrc");

	const testValidator = {
		"test.testKey1": "^\\w*$"
	};

	it("setConfigItem", async () => {
		await akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue", confPath);
	});

	it("getConfigItem", async () => {
		await akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue", confPath);
		const value = await akashicConfig.getConfigItem(testValidator, "test.testKey1", confPath);
		expect(value).toBe("testValue");
	});

	it("deleteConfigItem", async () => {
		await akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue", confPath);
		await akashicConfig.deleteConfigItem(testValidator, "test.testKey1", confPath);
		const value = await akashicConfig.getConfigItem(testValidator, "test.testKey1", confPath);
		expect(value).toBeNull();
	});

	it("listConfigItems", async () => {
		await akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue", confPath);
		await akashicConfig.listConfigItems({
			print: () => {},
			error: () => {},
			warn: () => {},
			info: () => {}
		}, confPath);
	});

	it("listAllConfigItems", async () => {
		await akashicConfig.listAllConfigItems({
			print: () => {},
			error: () => {},
			warn: () => {},
			info: () => {}
		}, testValidator, confPath);
	});
});
