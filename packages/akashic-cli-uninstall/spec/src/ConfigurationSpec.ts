import * as cmn from "@akashic/akashic-cli-commons";
import { Configuration } from "../../lib/Configuration";

describe("Configuration", function () {
	describe("#removeOperationPlugin()", function () {
		it("removes declaration", function () {
			var logger = new cmn.ConsoleLogger({ debugLogMethod: () => {/* do nothing*/} });
			var content = {
				width: 120,
				height: 120,
				fps: 30,
				operationPlugins: [
					{ code: 10, script: "foo" },
					{ code: 12, script: "bar" },
					{ code: 8, script: "anotherScript", options: { optvalue: true } }
				]
			};
			var self = new Configuration({ content, logger });
			self.removeOperationPlugin("bar@0.2");

			var plugins = [
				{ code: 10, script: "foo" },
				{ code: 8, script: "anotherScript", options: { optvalue: true } }
			];
			expect(self.getContent().operationPlugins).toEqual(plugins);
		});

		it("nothing removed for module not declared in operationPlugins", function () {
			var logger = new cmn.ConsoleLogger({ debugLogMethod: () => {/* do nothing*/} });
			var content = { width: 120, height: 120, fps: 30 };
			var self = new Configuration({ content, logger });
			self.removeOperationPlugin("foo");
			expect(self.getContent().operationPlugins).toEqual([]);
		});
	});
});
