import mockfs from "mock-fs";
import { Configuration } from "../Configuration.js";
import { ConsoleLogger } from "../ConsoleLogger.js";

describe("Configuration", () => {
	afterEach(() => {
		mockfs.restore();
	});
	it("can be instantiated", () => {
		const loggedResult: string[] = [];
		const logger = new ConsoleLogger({ debugLogMethod: loggedResult.push.bind(loggedResult) });
		const content = {
			width: 120,
			height: 240,
			fps: 30,
			main: "main.js",
			assets: {}
		};
		const self = new Configuration({ content: content, logger: logger });

		expect(self._logger).toBe(logger);
		expect(self._content).toBe(content);
		expect(self.getContent()).toBe(content);
	});

	it("removes filepaths by vacuumGlobalScripts()", () => {
		const loggedResult: string[] = [];
		const logger = new ConsoleLogger({ debugLogMethod: loggedResult.push.bind(loggedResult) });
		const content = {
			width: 120,
			height: 240,
			fps: 30,
			main: "main.js",
			assets: {},
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

		const mockFsContent = {
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

		const self = new Configuration({ content: content, logger: logger });
		self.vacuumGlobalScripts();
		expect(self.getContent().globalScripts).toEqual([
				"node_modules/foo/some.js",
				"node_modules/foo/some.js.foo.js.zoo.js",
				"node_modules/foo/package.json",
				"node_modules/foo/node_modules/bar/index.js",
		]);
	});
});
