import * as cmn from "@akashic/akashic-cli-commons";
import { update, UpdateParameterObject } from "../../update/update.js";
import { MockPromisedNpm } from "./helpers/MockPromisedNpm.js";

describe("update", () => {
	const nullLogger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
	const nullNpm: cmn.PromisedNpm = new MockPromisedNpm({ logger: nullLogger });
	const updatePromisified = (options: UpdateParameterObject): Promise<void> => {
		return new Promise((resolve, reject) => {
			update(options, (err: any) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	};

	it("does not crash when called", async () => {
		await updatePromisified({ debugNpm: nullNpm, moduleNames: undefined, logger: nullLogger });
	});
});
