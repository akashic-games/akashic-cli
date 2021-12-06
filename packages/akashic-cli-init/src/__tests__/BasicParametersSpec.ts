import * as os from "os";
import * as path from "path";
import {ConsoleLogger} from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import * as fs from "fs-extra";
import * as mockfs from "mock-fs";
import * as bp from "../../lib/init/BasicParameters";
import * as mockPrompt from "./support/mockPrompt";

describe("BasicParameters", function () {

	describe("updateConfigurationFile()", function () {
		const confPath = fs.mkdtempSync(path.join(os.tmpdir(), ".akashicrc"));
		const quietLogger = new ConsoleLogger({quiet: true});

		beforeEach(() => {
			mockfs({});
			mockPrompt.mock({ width: 42, height: 27, fps: 30 });
		});

		afterEach(() => {
			mockPrompt.restore();
			mockfs.restore();
		});

		// TODO: ファイル読み込み時に処理が止まってしまうため、暫定的処置としてこのテストを無効化する
		xit("update game.json", async () => {
			const conf = { width: 12, height: 23, fps: 34, assets: {} };
			fs.writeJsonSync(confPath, conf);
			await bp.updateConfigurationFile(confPath, quietLogger, true);
			expect(fs.readJsonSync(confPath))
				.toEqual({width: 42, height: 27, fps: 30, assets: {}});
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
