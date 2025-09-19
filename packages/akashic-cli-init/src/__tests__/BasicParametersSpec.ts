import {ConsoleLogger} from "@akashic/akashic-cli-commons/lib/ConsoleLogger.js";
import * as bp from "../init/BasicParameters.js";
import * as mockPrompt from "./support/mockPrompt.js";
import { fs, vol } from "memfs";
import { readJSON, writeJSON } from "@akashic/akashic-cli-commons/lib/FileSystem.js";

vi.mock("node:fs", async () => {
  const memfs: { fs: typeof fs } = await vi.importActual("memfs");
  return memfs.fs;
});

describe("BasicParameters", function () {

	describe("updateConfigurationFile()", function () {
		const confPath = ".akashicrc";
		const quietLogger = new ConsoleLogger({quiet: true});

		beforeEach(() => {
			vol.fromNestedJSON({ 
				"": {
					".akashicrc": ""
				}
			});
			mockPrompt.mock({ width: 42, height: 27, fps: 30 });
		});

		afterEach(() => {
			vol.reset();
			mockPrompt.restore();
		});

		it("update game.json", async () => {
			const conf = { width: 12, height: 23, fps: 34, assets: {} };
			await writeJSON(confPath, conf);
			await bp.updateConfigurationFile(confPath, quietLogger, true);

			const config = await readJSON(confPath);
			expect(config).toEqual({width: 42, height: 27, fps: 30, assets: {}});
		});

		describe("parameter value is not number", () => {
			it("value is NaN", async () => {
				mockPrompt.mock({ width: NaN, height: 27, fps: 30 });
				await expect(bp.updateConfigurationFile(confPath, quietLogger, true))
					.rejects.toBe("width must be a number");
			});

			it("value is null", async () => {
				mockPrompt.mock({ width: null, height: 27, fps: 30 });
				await expect(bp.updateConfigurationFile(confPath, quietLogger, true))
					.rejects.toBe("width must be a number");
			});

			it("value is string", async () => {
				mockPrompt.mock({ width: 111, height: "aaa", fps: 30 });
				await expect(bp.updateConfigurationFile(confPath, quietLogger, true))
					.rejects.toBe("height must be a number");
			});

			it("value is undefined", async () => {
				mockPrompt.mock({ width: 111, height: 222, fps: undefined });
				await expect(bp.updateConfigurationFile(confPath, quietLogger, true))
					.rejects.toBe("fps must be a number");
			});
		});

	});
});
