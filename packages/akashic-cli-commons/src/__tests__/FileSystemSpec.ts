import { readFile, writeFile, readJSON, writeJSON, readdir, unlink } from "../FileSystem.js";
import { buildEditorconfig } from "./helpers/buildEditorconfig.js";
import { fs, vol } from "memfs";
import * as editorconfig from "editorconfig";
import path from "path";

vi.mock("node:fs", async () => {
  const memfs: { fs: typeof fs } = await vi.importActual("memfs");
  return memfs.fs;
});

// editorconfig の parse() で memfs でモックした .editorconfig が読み込めないため parse() をモックしている。
vi.mock("editorconfig", async (importOriginal) => {
	return {
		...await importOriginal<typeof editorconfig>(),	
		parse: vi.fn((filepath: string, options?: editorconfig.ParseOptions): Promise<editorconfig.Props> => {
			const targetPath = path.join(path.dirname(filepath), ".editorconfig");
			if (!fs.existsSync(targetPath)) return Promise.resolve({}); 
			const ret = fs.readFileSync(targetPath);
			const parsed = editorconfig.parseBuffer(ret as Buffer);
			const parsedObj = parsed[1][1];
			const obj: editorconfig.Props = {
				indent_size: parseInt(parsedObj.indent_size, 10),
				indent_style: parsedObj.indent_style === "tab" ? "tab" : "space",
				insert_final_newline: parsedObj.insert_final_newline === "true"
			}
			return Promise.resolve(obj);
		})
	}
});

describe("FileSystemSpec", () => {
	afterEach(() => {
		vol.reset();
	});

	it("read text", async () => {
		vol.fromJSON({
			"someText.txt": "text content!"
		});
		expect(
			await readFile("./someText.txt", "utf8")
		).toBe("text content!");
	});

	it("read binary", async () => {
		vol.fromJSON({
			"someBinary": Buffer.from([12, 34, 56])
		});
		expect(
			await readFile("./someBinary")
		).toEqual(Buffer.from([12, 34, 56]));
	});

	it("read json", async () => {
		vol.fromNestedJSON({
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
		vol.fromNestedJSON({
			"some": {}
		});
		await writeFile("./some/foo.txt", "string content!!");
		expect(
			await readFile("./some/foo.txt", "utf8")
		).toBe("string content!!");
	});

	it("write binary", async () => {
		vol.fromNestedJSON({ "": {} });
		await writeFile("./someBinary", Buffer.from([12, 34]));
		expect(
			await readFile("./someBinary")
		).toEqual(Buffer.from([12, 34]));
	});

	describe("#writeJson", () => {
		it("write game.json", async () => {
			vol.fromNestedJSON({
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
			vol.fromNestedJSON({
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
			vol.fromNestedJSON({
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
			vol.fromNestedJSON({
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
		vol.fromNestedJSON({
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
		vol.fromNestedJSON({
			"foo": {
				"test.json": JSON.stringify({ val: 42 })
			},
		})

		const content = await readJSON("./foo/test.json");
		expect(content).toEqual({ val: 42 });

		await unlink("./foo/test.json");
		await expect(readJSON("./foo/test.json")).rejects.toMatchObject({ code: "ENOENT" });
	});
});
