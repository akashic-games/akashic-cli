"use strict"

const os = require("os");
const path = require("path");
const mockfs = require("mock-fs");
const akashicConfig = require("../lib/config");

describe("config module", () => {
	const confPath = path.join(os.tmpdir(), ".akashicrc");

	const testValidator = {
		"apple.item1": "^\\w+$",
		"apple.item2": "^\\d+$",
		"banana.item3": "^\\w+$"
	};

	beforeEach(() => {
		mockfs({});
	});

	afterEach(() => {
		mockfs.restore();
	});

	it("AkashicConfigFile", (done) => {
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
			.then(value => expect(value).toBeNull)
			.then(done, done.fail);
	});
});

describe("cli functions", () => {
	const testValidator = {
		"test.testKey1": "^\\w*$"
	};

	beforeEach(() => {
		mockfs({});
	});

	afterEach(() => {
		mockfs.restore();
	});

	it("setConfigItem", done => {
		Promise.resolve()
			.then(() => akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue"))
			.then(done, done.fail);
	});

	it("getConfigItem", done => {
		Promise.resolve()
			.then(() => akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue"))
			.then(() => akashicConfig.getConfigItem(testValidator, "test.testKey1"))
			.then(value => expect(value).toBe("testValue"))
			.then(done, done.fail);
	});

	it("deleteConfigItem", done => {
		Promise.resolve()
			.then(() => akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue"))
			.then(() => akashicConfig.deleteConfigItem(testValidator, "test.testKey1"))
			.then(() => akashicConfig.getConfigItem(testValidator, "test.testKey1"))
			.then(value => expect(value).toBeNull())
			.then(done, done.fail);
	});

	it("listConfigItems", done => {
		Promise.resolve()
			.then(() => akashicConfig.setConfigItem(testValidator, "test.testKey1", "testValue"))
			.then(() => akashicConfig.listConfigItems({print: () => {}}))
			.then(done, done.fail);
	});

	it("listAllConfigItems", done => {
		Promise.resolve()
			.then(() => akashicConfig.listAllConfigItems({print: () => {}}, testValidator))
			.then(done, done.fail);
	});
});
