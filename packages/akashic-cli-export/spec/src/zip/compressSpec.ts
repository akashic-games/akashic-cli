import * as fs from "fs";
import * as path from "path";
import * as mockfs from "mock-fs";
import { compress } from "../../../lib/zip/compress";
const zip = require("zip"); // TODO よりポピュラーで型がつく別のライブラリへ移行

describe("compress", function () {
	afterEach(() => {
		mockfs.restore();
	});

	it("creates a zip file", async function () {
		mockfs({
			foo: {
				"a.txt": "the string content of a.txt",
				subdir: {
					"b.bin": Buffer.from([0xff, 0x80, 0x02]),
				}
			}
		});

		await compress(path.join(".", "foo"), "out.zip");

		const files = zip.Reader(fs.readFileSync("out.zip")).toObject();
		const fileNames = Object.keys(files);
		expect(fileNames).toContain("a.txt");
		expect(fileNames).toContain("subdir/b.bin");
		expect(files["a.txt"].toString("utf-8")).toBe("the string content of a.txt");
		expect(files["subdir/b.bin"]).toEqual(Buffer.from([0xff, 0x80, 0x02]));
	});
});
