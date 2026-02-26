import * as Util from "../Util.js";
import { fs, vol } from "memfs";

vi.mock("node:fs", async () => {
  const memfs: { fs: typeof fs } = await vi.importActual("memfs");
  return memfs.fs;
});

describe("Util", () => {
	afterEach(() => {
		vol.reset();
	});

	it(".filterMap()", () => {
		const arr = [1, 3, 100, -5, "foo", false, "zoo", 4];
		expect(Util.filterMap(arr, (v) => (typeof v === "string" ? v.toUpperCase() : undefined))).toEqual(["FOO", "ZOO"]);
		expect(Util.filterMap(arr, (v) => (typeof v === "number" ? v * 2 : undefined))).toEqual([2, 6, 200, -10, 8]);
	});

	it(".makeModuleNameNoVer()", () => {
		expect(Util.makeModuleNameNoVer("foo")).toBe("foo");
		expect(Util.makeModuleNameNoVer("foo@0.1.0")).toBe("foo");
		expect(Util.makeModuleNameNoVer("foo@1")).toBe("foo");
		expect(Util.makeModuleNameNoVer("@scoped/foo")).toBe("@scoped/foo");
		expect(Util.makeModuleNameNoVer("@scoped/foo@0.1.0")).toBe("@scoped/foo");
	});

	it(".makeUnixPath()", function() {
		expect(Util.makeUnixPath("\\foo\\bar\\")).toBe("/foo/bar/");
		expect(Util.makeUnixPath("/foo/bar/")).toBe("/foo/bar/");
	});

	describe(".invertMap()", () => {
		it("reverses key/value pair", () => {
			const o = {
				foo: "fooValue",
				bar: "one",
				zoo: "tt",
				dee: "tt",
			};
			const reversed = Util.invertMap(o);
			expect("foo" in reversed).toBe(false);
			expect("bar" in reversed).toBe(false);
			expect("zoo" in reversed).toBe(false);
			expect("dee" in reversed).toBe(false);
			expect(reversed.fooValue).toEqual(["foo"]);
			expect(reversed.one).toEqual(["bar"]);
			expect(reversed.tt.indexOf("zoo")).not.toBe(-1);
			expect(reversed.tt.indexOf("dee")).not.toBe(-1);
		});

		it("reverses a key and a property in the value", () => {
			const o = {
				foo: {
					id: "id1",
					value: false,
				},
				bar: {
					id: "id100",
					something: "wrong",
				},
				zoo: {
					id: "id42",
				}
			};
			const reversed = Util.invertMap(o, "id");
			expect("foo" in reversed).toBe(false);
			expect("bar" in reversed).toBe(false);
			expect("zoo" in reversed).toBe(false);
			expect(reversed.id1).toEqual(["foo"]);
			expect(reversed.id100).toEqual(["bar"]);
			expect(reversed.id42).toEqual(["zoo"]);
		});
	});

	describe("mkdirpSync", () => {
		it("creates directory", () => {
			vol.fromNestedJSON({});
			expect(() => fs.statSync("./test/some/dir")).toThrow();
			Util.mkdirpSync("./test/some/dir");
			expect(fs.statSync("./test/some/dir").isDirectory()).toBe(true);
		});

		it("does nothing if exists", () => {
			vol.fromNestedJSON({
				"test": {
					"some": {
						"dir": {},
						"anotherDir": {}
					}
				}
			});
			expect(fs.statSync("./test/some/dir").isDirectory()).toBe(true);
			Util.mkdirpSync("./test/some/dir");
			expect(fs.statSync("./test/some/dir").isDirectory()).toBe(true);
		});

		it("throws if it is a file", () => {
			vol.fromNestedJSON({
				"test": {
					"some": {
						"dir": "a file"
					}
				}
			});
			expect(() => Util.mkdirpSync("./test/some/dir")).toThrow();
		});

		it("throws when it finds a file in a path", () => {
			vol.fromNestedJSON({
				"test": "a file"
			});
			expect(() => Util.mkdirpSync("./test/some/dir")).toThrow();
		});
	});

	describe("getTotalFileSize", () => {
		it("can obtain the total file size in the specified path", async () => {
			vol.fromNestedJSON({
				test1: Buffer.from(new Uint8Array(1024)),
				dir: {
					test2: Buffer.from(new Uint8Array(2000)),
					dir: {
						test3: Buffer.from(new Uint8Array(4000))
					}
				}
			});

			expect(await Util.getTotalFileSize("./test1")).toBe(1024);
			expect(await Util.getTotalFileSize("./dir/test2")).toBe(2000);
			expect(await Util.getTotalFileSize("./dir/dir/test3")).toBe(4000);

			expect(await Util.getTotalFileSize(".")).toBe(7024); // 1024 + 2000 + 4000
			expect(await Util.getTotalFileSize("./dir")).toBe(6000); // 2000 + 4000
			expect(await Util.getTotalFileSize("./dir/dir")).toBe(4000);
		});
	});
});
