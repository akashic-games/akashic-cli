import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import { modifyBasicParameter } from "../modify.js";

describe("modify", () => {
	const nullLogger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
	const modifyDirPath = fs.mkdtempSync(path.join(os.tmpdir(), "akashic-cli-modify"));

	const modifyParameterPromisified = (options: any): Promise<void> => {
		return new Promise((resolve, reject) => {
			modifyBasicParameter(options, (err: any) => {
				if (err) reject(err);
				else resolve();
			});
		});
	};

	describe("modifyBasicParameter()", () => {
		it("rejects for negative values", async () => {
			const fixtureDirPath = fs.mkdtempSync(path.join(modifyDirPath, "fixture"));
			fs.writeFileSync(path.join(fixtureDirPath, "game.json"), JSON.stringify({ width: 320, height: 240, fps: 15 }));

			await expect(modifyParameterPromisified({ cwd: fixtureDirPath, target: "height", value: -10, logger: nullLogger }))
				.rejects.toBeTruthy();
			await expect(modifyParameterPromisified({ cwd: fixtureDirPath, target: "height", value: 15.5, logger: nullLogger }))
				.rejects.toBeTruthy();
		});

		it("rejects for invalid target", async () => {
			const fixtureDirPath = fs.mkdtempSync(path.join(modifyDirPath, "fixture"));
			fs.writeFileSync(path.join(fixtureDirPath, "game.json"), JSON.stringify({ width: 320, height: 240, fps: 15 }));

			await expect(modifyParameterPromisified({ cwd: fixtureDirPath, target: "foo", value: 10, logger: nullLogger }))
				.rejects.toBeTruthy();
		});

		it("modify width/height/fps", async () => {
			const fixtureDirPath = fs.mkdtempSync(path.join(modifyDirPath, "fixture"));
			fs.writeFileSync(path.join(fixtureDirPath, "game.json"), JSON.stringify({
				width: 320, height: 240, fps: 15,
				assets: {
					mainScene: { type: "script", path: "script/mainScene.js", global: true }
				}
			}));
			fs.mkdirSync(path.join(fixtureDirPath, "script"));
			fs.writeFileSync(path.join(fixtureDirPath, "script", "mainScene"), "MAINSCENE");

			await modifyParameterPromisified({ cwd: fixtureDirPath, target: "height", value: 80, logger: nullLogger });
			await modifyParameterPromisified({ cwd: fixtureDirPath, target: "width", value: 160, logger: nullLogger });
			await modifyParameterPromisified({ cwd: fixtureDirPath, target: "fps", value: 60, logger: nullLogger });

			const gamejson = JSON.parse(fs.readFileSync(path.join(fixtureDirPath, "game.json")).toString());
			expect(gamejson.width).toBe(160);
			expect(gamejson.height).toBe(80);
			expect(gamejson.fps).toBe(60);
		});
	});
});
