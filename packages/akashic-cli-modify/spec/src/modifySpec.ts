import * as fs from "fs";
import * as cmn from "@akashic/akashic-cli-commons";
import * as mockfs from "mock-fs";
import { modifyBasicParameter } from "../../lib/modify";

describe("modify", function () {
	var nullLogger = new cmn.ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });

	afterEach(() => {
		mockfs.restore();
	});

	describe("modifyBasicParameter()", function () {
		it("rejects for negative values", function (done: any) {
			mockfs({
				some: {
					"game.json": JSON.stringify({ width: 320, height: 240, fps: 15, })
				}
			});
			modifyBasicParameter({ cwd: "./some", target: "height", value: -10, logger: nullLogger }, (err: any) => {
				expect(!!err).toBe(true);
				modifyBasicParameter({ cwd: "./some", target: "height", value: 15.5, logger: nullLogger }, (err: any) => {
					expect(!!err).toBe(true);
					done();
				});
			});
		});

		it("rejects for invalid target", function (done: any) {
			mockfs({
				some: {
					"game.json": JSON.stringify({ width: 320, height: 240, fps: 15, })
				}
			});
			modifyBasicParameter({ cwd: "./some", target: "foo", value: 10, logger: nullLogger }, (err: any) => {
				expect(!!err).toBe(true);
				done();
			});
		});

		it("modify width/height/fps", function (done: any) {
			mockfs({
				some: {
					"game.json": JSON.stringify({
						width: 320, height: 240, fps: 15,
						assets: {
							mainScene: { type: "script", path: "script/mainScene.js", global: true }
						}
					}),
					"script": {
						"mainScene": "MAINSCENE"
					}
				}
			});
			modifyBasicParameter({ cwd: "./some", target: "height", value: 80, logger: nullLogger }, (err: any) => {
				expect(!!err).toBe(false);
				modifyBasicParameter({ cwd: "./some", target: "width", value: 160, logger: nullLogger }, (err: any) => {
					expect(!!err).toBe(false);
					modifyBasicParameter({ cwd: "./some", target: "fps", value: 60, logger: nullLogger }, (err: any) => {
						expect(!!err).toBe(false);
						var gamejson = JSON.parse(fs.readFileSync("./some/game.json").toString());
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
