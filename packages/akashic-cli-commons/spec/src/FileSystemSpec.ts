import * as mockfs from "mock-fs";
import { readFile, writeFile, readJSON, writeJSON, readdir, unlink, readJSONWithDefault, exists, findUniqueDir } from "../../lib/FileSystem";

describe("FileSystemSpec", () => {
	afterEach(function () {
		mockfs.restore();
	});

	it("read text", async () => {
		mockfs({
			"someText.txt": "text content!"
		});
		expect(
			await readFile("./someText.txt", "utf8")
		).toBe("text content!");
	});

	it("read binary", async () => {
		mockfs({
			"someBinary": Buffer.from([12, 34, 56])
		});
		expect(
			await readFile("./someBinary")
		).toEqual(Buffer.from([12, 34, 56]));
	});

	it("read json", async () => {
		mockfs({
			"game": {
				"game.json": JSON.stringify({
					width: 120,
					height: 240
				})
			}
		});
		expect(
			await readJSON("./game/game.json")
		).toEqual({
			width: 120,
			height: 240
		});
	});

	it("read json with default", async () => {
		mockfs({
			"game": {
				"game.json": JSON.stringify({ width: 120, })
			}
		});
		expect(await readJSONWithDefault("./game/game.json", { defaultValue: 42 })).toEqual({ width: 120 });
		expect(await readJSONWithDefault("./not-exist.json", { defaultValue: 42 })).toEqual({ defaultValue: 42 });
	});

	it("write text", async () => {
		mockfs({
			"some": {}
		});
		await writeFile("./some/foo.txt", "string content!!");
		expect(
			await readFile("./some/foo.txt", "utf8")
		).toBe("string content!!");
	});

	it("write binary", async () => {
		mockfs({});
		await writeFile("./someBinary", Buffer.from([12, 34]));
		expect(
			await readFile("./someBinary")
		).toEqual(Buffer.from([12, 34]));
	});

	it("write json", async () => {
		mockfs({
			"game": {
				"game.json": JSON.stringify({})
			}
		});
		await writeJSON("./game/game.json", { width: 120, height: 240 });
		expect(
			await readJSON("./game/game.json")
		).toEqual({
			width: 120,
			height: 240
		})
	});

	it("read directories", async () => {
		mockfs({
			"foo": {
				"test.json": ""
			},
			"bar": {
				"barZoo": {
				}
			},
			"tee": {
			}
		})
		const dirnames = await readdir("./");
		expect(dirnames.length).toBe(3);
		expect(dirnames.includes("foo")).toBe(true);
		expect(dirnames.includes("bar")).toBe(true);
		expect(dirnames.includes("tee")).toBe(true);
	});

	it("unlink file", async () => {
		mockfs({
			"foo": {
				"test.json": JSON.stringify({ val: 42 })
			},
		})

		const content = await readJSON("./foo/test.json");
		expect(content).toEqual({ val: 42 });

		await unlink("./foo/test.json");
		expect(readJSON("./foo/test.json")).rejects.toMatchObject({ code: "ENOENT" });
	});

	it("check file existence", async () => {
		mockfs({
			"foo": {
				"test.json": JSON.stringify({ val: 42 })
			},
		})

		expect(await exists("./foo/test.json")).toBe(true);
		expect(await exists("./foo/test-not-found.json")).toBe(false);
	});

	it("find unique dir", async () => {
		mockfs({
			"foo": {},
			"bar": {
				"zoo": {},
				"zoo0": {},
				"zoo1": {},
			},
		})

		expect(await findUniqueDir("./foo/", "prefix")).toBe("prefix");
		expect(await findUniqueDir("./bar/", "zoo")).toBe("zoo2");
	});
});
