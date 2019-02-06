import * as path from "path";
import * as fs from "fs";
import * as cmn from "@akashic/akashic-cli-commons";
import { update } from "../../lib/update";
import { MockPromisedNpm } from "./helpers/MockPromisedNpm";

describe("update", function () {
	var nullLogger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
	var nullNpm: cmn.PromisedNpm = new MockPromisedNpm({
		logger: nullLogger, 
	});
	it("does not crash when called", function (done: any) {
		update({ debugNpm: nullNpm, moduleNames: undefined, logger: nullLogger }, (err: any) => {
			expect(!!err).toBe(false);
			done();
		});
	});
});
