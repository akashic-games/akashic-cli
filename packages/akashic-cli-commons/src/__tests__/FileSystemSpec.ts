import mockfs from "mock-fs";
import { readFile, writeFile, readJSON, writeJSON, readdir, unlink, readJS, readJSWithDefault } from "../FileSystem.js";
import { buildEditorconfig } from "./helpers/buildEditorconfig.js";
import { Util } from "../index.js";

const mock = require("mock-require");

describe("FileSystemSpec", () => {
	afterEach(() => {
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

	describe("#writeJson", () => {
		it("write game.json", async () => {
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

		it("write json without .editorconfig", async () => {
			mockfs({
				"test.json": JSON.stringify({})
			});
			await writeJSON("test.json", { width: 120, height: 240 });
			expect(
				(await readFile("test.json")).toString()
			).toBe(
				`{\n` +
				`	"width": 120,\n` +
				`	"height": 240\n` +
				`}`
			);
		});

		it("write json with .editorconfig", async () => {
			mockfs({
				"test1/.editorconfig": buildEditorconfig({ indentSize: 4, indentStyle: "tab", insertFinalNewline: true }),
				"test1/test.json": JSON.stringify({}),
				"test2/.editorconfig": buildEditorconfig({ indentSize: 2, indentStyle: "space", insertFinalNewline: true }),
				"test2/test.json": JSON.stringify({}),
				"test3/.editorconfig": buildEditorconfig({ indentSize: 4, indentStyle: "space", insertFinalNewline: false }),
				"test3/test.json": JSON.stringify({}),
			});

			await writeJSON("test1/test.json", { width: 120, height: 240 });
			await writeJSON("test2/test.json", { width: 120, height: 240 });
			await writeJSON("test3/test.json", { width: 120, height: 240 });

			expect(
				(await readFile("test1/test.json")).toString()
			).toBe(
				`{\n` +
				`	"width": 120,\n` +
				`	"height": 240\n` +
				`}\n`
			);
			expect(
				(await readFile("test2/test.json")).toString()
			).toBe(
				`{\n` +
				`  "width": 120,\n` +
				`  "height": 240\n` +
				`}\n`
			);
			expect(
				(await readFile("test3/test.json")).toString()
			).toBe(
				`{\n` +
				`    "width": 120,\n` +
				`    "height": 240\n` +
				`}`
			);
		});

		it("write json with formatter", async () => {
			mockfs({
				"test.json": JSON.stringify({})
			});
			await writeJSON("test.json", { width: 120, height: 240 }, (content) => JSON.stringify(content, undefined, " "));
			expect(
				(await readFile("test.json")).toString()
			).toBe(
				`{\n` +
				` "width": 120,\n` +
				` "height": 240\n` +
				`}`
			);
		});
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
	
	describe("readJS, readJSWithDefault", () => {
		const mockContent = {
			commandOptions: {
				serve: {
					port: 3030
				}
			}
		};
		const spy = vi.spyOn(Util, "requireResolve").mockRejectedValue("some.js");

		beforeEach(() => {
			mock("some.js", mockContent);
		});
		afterEach(() => {
			mock.stop("some.js");
		});
		afterAll(() => {
			spy.mockClear();
		});

		it("readJS - read js file", async () => {
			const js = await readJS("some.js");
			expect(js).toEqual(mockContent);
		});

		it("readJS - If the file does not exist", async () => {
			await expect(readJS("notFound.js")).rejects.toThrow();
		});


		it("readJSWithDefault - read js file", async () => {
			const js = await readJSWithDefault("some.js", {hoge: "default"})
			expect(js).toEqual(mockContent);
		});

		it("readJS - If the file does not exist, the default value is returned.", async () => {
			const defaultValue = {hoge: "default"};
			const js = await readJSWithDefault("notFound.js", defaultValue);
			expect(js).toEqual(defaultValue);
		});
	});
});
