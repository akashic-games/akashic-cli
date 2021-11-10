import * as mockfs from "mock-fs";
import { readJSON, writeJSON, readdir } from "../../lib/FileSystem";

describe("FileSystemSpec", () => {
	afterEach(function () {
		mockfs.restore();
	});

	it("read game.json", async () => {
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

	it("read game.json", async () => {
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
