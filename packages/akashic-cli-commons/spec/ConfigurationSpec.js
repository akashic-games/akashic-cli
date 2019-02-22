var mockfs = require("mock-fs");
var Configuration = require("../lib/Configuration").Configuration;
var ConsoleLogger = require("../lib/ConsoleLogger").ConsoleLogger;

describe("Configuration", function () {
	it("can be instantiated", function () {
		var loggedResult = [];
		var logger = new ConsoleLogger({ debugLogMethod: loggedResult.push.bind(loggedResult) });
		var content = {
			width: 120,
			heght: 240,
			fps: 30
		};
		var self = new Configuration({ content: content, logger: logger });

		expect(self._logger).toBe(logger);
		expect(self._content).toBe(content);
		expect(self.getContent()).toBe(content);
	});

	it("removes filepaths by vacuumGlobalScripts()", function () {
		var loggedResult = [];
		var logger = new ConsoleLogger({ debugLogMethod: loggedResult.push.bind(loggedResult) });
		var content = {
			width: 120,
			heght: 240,
			fps: 30,
			globalScripts: [
				"node_modules/foo/some.js",
				"node_modules/foo/some.js.foo.js",
				"node_modules/foo/some.js.foo.js.zoo.js",
				"node_modules/foo/package.json",
				"node_modules/foo/node_modules/bar/index.js",
				"node_modules/zoo/main.js",
				"node_modules/zoo/package.json",
			]
		};

		var mockFsContent = {
			"node_modules": {
				"foo": {
					"some.js": {},
					"some.js.foo.js.zoo.js": {},
					"package.json": {},
					"node_modules": {
						"bar": {
							"index.js": {}
						}
					}
				},
				"zoo": {}
			}
		};
		mockfs(mockFsContent);

		var self = new Configuration({ content: content, logger: logger });
		self.vacuumGlobalScripts();
		expect(self.getContent().globalScripts).toEqual([
				"node_modules/foo/some.js",
				"node_modules/foo/some.js.foo.js.zoo.js",
				"node_modules/foo/package.json",
				"node_modules/foo/node_modules/bar/index.js",
		]);
	});
});
