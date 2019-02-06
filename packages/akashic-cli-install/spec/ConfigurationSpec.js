var cmn = require("@akashic/akashic-cli-commons");
var Configuration = require("../lib/Configuration").Configuration;

describe("Configuration", function () {
	function createConfiguration(content) {
		var logger = new cmn.ConsoleLogger({ debugLogMethod: () => {/* do nothing */} });
		return new Configuration({ content: content, logger: logger });
	}

	function sortStringArray(arr) {
		return arr.sort((a, b) => (a > b) ? 1 : (a < b) ? -1 : 0);
	}

	describe("#addOperationPlugin()", function () {
		it("adds a declaration to operationPlugins", function () {
			var self = createConfiguration({});
			self.addOperationPlugin(10, "@example/foo@1.2");
			expect(self.getContent().operationPlugins.sort((a, b) => a.code - b.code)).toEqual([
				{ code: 10, script: "@example/foo" }
			]);
			self.addOperationPlugin(8, "foo@1.2");
			expect(self.getContent().operationPlugins.sort((a, b) => a.code - b.code)).toEqual([
				{ code: 8, script: "foo" },
				{ code: 10, script: "@example/foo" }
			]);
		});
		it("rejects if conflicted", function () {
			var content = {
				operationPlugins: [{ code: 10, script: "@example/foo" }]
			};
			var self = createConfiguration(content);
			expect(() => self.addOperationPlugin(10, "foo")).toThrow();
		});
	});

	describe("#addToGlobalScripts()", function () {
		it("creates globalScripts unless exists", function () {
			var self = createConfiguration({});
			self.addToGlobalScripts([ "node_modules/foo/index.js", "node_modules/foo/package.json" ]);
			expect(sortStringArray(self.getContent().globalScripts)).toEqual([
				"node_modules/foo/index.js",
				"node_modules/foo/package.json"
			]);
		});
		it("filters duplication out", function () {
			var self = createConfiguration({
			globalScripts: [
				"node_modules/foo/package.json",
				"node_modules/@bar/zoo/lib/main.js",
				"node_modules/@bar/zoo/package.json"
			]
			});
			self.addToGlobalScripts([ "node_modules/foo/index.js", "node_modules/foo/package.json" ]);
			expect(sortStringArray(self.getContent().globalScripts)).toEqual([
				"node_modules/@bar/zoo/lib/main.js",
				"node_modules/@bar/zoo/package.json",
				"node_modules/foo/index.js",
				"node_modules/foo/package.json"
			]);
		});
});
});
