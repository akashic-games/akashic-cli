import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import { modifyBasicParameter } from "../../../lib/modify/modify";

describe("modify", function () {
	const nullLogger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });
	const modifyDirPath = fs.mkdtempSync(path.join(os.tmpdir(), "akashic-cli-modify"));

	describe("modifyBasicParameter()", function () {
		it("rejects for negative values", function (done: any) {
			const fixtureDirPath = fs.mkdtempSync(path.join(modifyDirPath, "fixture"));
			fs.writeFileSync(path.join(fixtureDirPath, "game.json"), JSON.stringify({ width: 320, height: 240, fps: 15 }));
			modifyBasicParameter({ cwd: fixtureDirPath, target: "height", value: -10, logger: nullLogger }, (err: any) => {
				expect(!!err).toBe(true);
				modifyBasicParameter({ cwd: fixtureDirPath, target: "height", value: 15.5, logger: nullLogger }, (err: any) => {
					expect(!!err).toBe(true);
					done();
				});
			});
		});

		it("rejects for invalid target", function (done: any) {
			const fixtureDirPath = fs.mkdtempSync(path.join(modifyDirPath, "fixture"));
			fs.writeFileSync(path.join(fixtureDirPath, "game.json"), JSON.stringify({ width: 320, height: 240, fps: 15 }));
			modifyBasicParameter({ cwd: fixtureDirPath, target: "foo", value: 10, logger: nullLogger }, (err: any) => {
				expect(!!err).toBe(true);
				done();
			});
		});

		it("modify width/height/fps", function (done: any) {
			const fixtureDirPath = fs.mkdtempSync(path.join(modifyDirPath, "fixture"));
			fs.writeFileSync(path.join(fixtureDirPath, "game.json"), JSON.stringify({
				width: 320, height: 240, fps: 15,
				assets: {
					mainScene: { type: "script", path: "script/mainScene.js", global: true }
				}
			}));
			fs.mkdirSync(path.join(fixtureDirPath, "script"));
			fs.writeFileSync(path.join(fixtureDirPath, "script", "mainScene"), "MAINSCENE");
			modifyBasicParameter({ cwd: fixtureDirPath, target: "height", value: 80, logger: nullLogger }, (err: any) => {
				expect(!!err).toBe(false);
				modifyBasicParameter({ cwd: fixtureDirPath, target: "width", value: 160, logger: nullLogger }, (err: any) => {
					expect(!!err).toBe(false);
					modifyBasicParameter({ cwd: fixtureDirPath, target: "fps", value: 60, logger: nullLogger }, (err: any) => {
						expect(!!err).toBe(false);
						const gamejson = JSON.parse(fs.readFileSync(path.join(fixtureDirPath, "game.json")).toString());
						expect(gamejson.width).toBe(160);
						expect(gamejson.height).toBe(80);
						expect(gamejson.fps).toBe(60);
						done();
					});
				});
			});
		});
	});
});
