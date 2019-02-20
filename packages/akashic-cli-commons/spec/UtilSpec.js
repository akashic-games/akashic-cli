var path = require("path");
var mockfs = require("mock-fs");
var fs = require("fs");
var Util = require("../lib/Util");
var ConfigurationFile = require("../lib/ConfigurationFile");
var GameConfiguration = require("../lib/GameConfiguration");

describe("Util", function () {
	afterEach(() => {
		mockfs.restore();
	});

	it(".filterMap()", function () {
		var arr = [1, 3, 100, -5, "foo", false, "zoo", 4];
		expect(Util.filterMap(arr, (v) => (typeof v === "string" ? v.toUpperCase() : undefined))).toEqual(["FOO", "ZOO"]);
		expect(Util.filterMap(arr, (v) => (typeof v === "number" ? v * 2 : undefined))).toEqual([2, 6, 200, -10, 8]);
	});

	it(".makeModuleNameNoVer()", function () {
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

	describe(".invertMap()", function () {
		it("reverses key/value pair", function () {
			var o = {
				foo: "fooValue",
				bar: 1,
				zoo: "tt",
				dee: "tt",
			};
			var reversed = Util.invertMap(o);
			expect("foo" in reversed).toBe(false);
			expect("bar" in reversed).toBe(false);
			expect("zoo" in reversed).toBe(false);
			expect("dee" in reversed).toBe(false);
			expect(reversed.fooValue).toEqual(["foo"]);
			expect(reversed[1]).toEqual(["bar"]);
			expect(reversed.tt.indexOf("zoo")).not.toBe(-1);
			expect(reversed.tt.indexOf("dee")).not.toBe(-1);
		});

		it("reverses a key and a property in the value", function () {
			var o = {
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
			var reversed = Util.invertMap(o, "id");
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
			mockfs({});
			expect(() => fs.statSync("./test/some/dir")).toThrow();
			Util.mkdirpSync("./test/some/dir");
			expect(fs.statSync("./test/some/dir").isDirectory()).toBe(true);
		});

		it("does nothing if exists", () => {
			mockfs({
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
			mockfs({
				"test": {
					"some": {
						"dir": "a file"
					}
				}
			});
			expect(() => Util.mkdirpSync("./test/some/dir")).toThrow();
		});

		it("throws when it finds a file in a path", () => {
			mockfs({
				"test": "a file"
			});
			expect(() => Util.mkdirpSync("./test/some/dir")).toThrow();
		});
	});
});
