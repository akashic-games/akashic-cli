import * as mockfs from "mock-fs";
import { readFile, writeFile, readJSON, writeJSON, readdir } from "../../lib/FileSystem";

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
});
