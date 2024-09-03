import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as akashicConfig from "../../../lib/config/config";

describe("config module", () => {
	const confDirPath = fs.mkdtempSync(path.join(os.tmpdir(), "akashic-cli-config"));

	const testValidator = {
		"apple.item1": "^\\w+$",
		"apple.item2": "^\\d+$",
		"banana.item3": "^\\w+$"
	};

	it("AkashicConfigFile", (done) => {
		const confPath = path.join(confDirPath, ".akashicrc");
		fs.writeFileSync(confPath, "");
		const config = new akashicConfig.AkashicConfigFile(testValidator, confPath);
		config.setItem("apple.item1", "testValue")
			.then(() => config.setItem("apple.item2", "42"))
			.then(() => config.save())
			.then(() => config.load())
			.then(() => config.getItem("apple.item1"))
			.then(value => expect(value).toBe("testValue"))
			.then(() => config.getItem("apple.item2"))
			.then(value => expect(value).toBe("42"))
			.then(() => config.getItem("banana.item3"))
			.then(value => expect(value).toBeNull())
			.then(() => {
				config.deleteItem("apple.item1");
				config.getItem("apple.item1")
					.then((v) => expect(v).toBeNull());
			})
			.then(done, done.fail);
	});
});

describe("cli functions", () => {
	const confDirPath = fs.mkdtempSync(path.join(os.tmpdir(), "akashic-cli-config"));
	const confPath = path.join(confDirPath, ".akashicrc");

	const testValidator = {
		"test.testKey1": "^\\w*$"
	};

	it("setConfigItem", done => {
		Promise.resolve()
			.then(() => akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue", confPath))
			.then(done, done.fail);
	});

	it("getConfigItem", done => {
		Promise.resolve()
			.then(() => akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue", confPath))
			.then(() => akashicConfig.getConfigItem(testValidator, "test.testKey1", confPath))
			.then(value => expect(value).toBe("testValue"))
			.then(done, done.fail);
	});

	it("deleteConfigItem", done => {
		Promise.resolve()
			.then(() => akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue", confPath))
			.then(() => akashicConfig.deleteConfigItem(testValidator, "test.testKey1", confPath))
			.then(() => akashicConfig.getConfigItem(testValidator, "test.testKey1", confPath))
			.then(value => expect(value).toBeNull())
			.then(done, done.fail);
	});

	it("listConfigItems", done => {
		Promise.resolve()
			.then(() => akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue", confPath))
			.then(() => akashicConfig.listConfigItems({
				print: () => {},
				error: () => {},
				warn: () => {},
				info: () => {}
			}, confPath))
			.then(done, done.fail);
	});

	it("listAllConfigItems", done => {
		Promise.resolve()
			.then(() => akashicConfig.listAllConfigItems({
				print: () => {},
				error: () => {},
				warn: () => {},
				info: () => {}
			}, testValidator, confPath))
			.then(done, done.fail);
	});
});
