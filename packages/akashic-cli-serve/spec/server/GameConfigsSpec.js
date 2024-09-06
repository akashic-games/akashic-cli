const os = require("os");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const { watchContent } = require("../../lib/server/domain/GameConfigs");

// FIXME: akashic-cli-scan は ES Module で現状 jest 環境では動作せず、やむなく無効化している。serve が ES Module に移行したタイミングで有効化すべし。
xdescribe("GameConfigs", () => {
	describe("watchContent", () => {
		let targetDir = null;
		let watcher = null;
		let watcherFuncs = {};
		beforeEach(() => {
			watcher = {
				on: (event, func) => {
					watcherFuncs[event] = func;
				},
				fire: (event, fileName) => {
					watcherFuncs[event](fileName);
				}
			};

			// mock-fsを利用すると動的にrequireしている箇所でモジュールが読めなくなるので、実ファイルシステムを利用
			const tmpDir = os.tmpdir();
			targetDir = fs.mkdtempSync(`${path.join(tmpDir, "test_serve_gameconfig")}`);
			fs.mkdirSync(path.join(targetDir, "script"));
			fs.mkdirSync(path.join(targetDir, "text"));
			fs.writeFileSync(path.join(targetDir, "script", "main.js"), "test");
			fs.writeFileSync(path.join(targetDir, "text", "a.txt"), "aaa");
			fs.writeFileSync(path.join(targetDir, "text", "b.txt"), "bbb");
			fs.writeFileSync(path.join(targetDir, "game.json"), JSON.stringify({
				"width": 1280,
				"height": 720,
				"fps": 30,
				"main": "./script/main.js",
				"assets": {
					"main": {
						"type": "script",
						"path": "script/main.js",
						"global": true
					},
					"a": {
						"type": "text",
						"path": "text/a.txt"
					},
					"b": {
						"type": "text",
						"path": "text/b.txt"
					}
				}
			}));
		});

		afterEach(() => {
			if (targetDir) {
				rimraf.sync(targetDir);
				targetDir = null;
			}
			watcher = null;
			watcherFuncs = {};
		});

		it("call callback once when updated asset", (done) => {
			jest.setTimeout(10000);
			let count = 0;
			watchContent(
				targetDir,
				(err, modTargetFlag) => {
					count++;
					expect(err).toBeNull();
					expect(modTargetFlag).toBe(0x2);
				},
				watcher 
			).then(() => {
				fs.writeFileSync(path.join(targetDir, "text", "c.txt"), "ccc");
				fs.unlinkSync(path.join(targetDir, "text", "a.txt"));
				// テストではchokidarが呼ばれないので、実際に発生する想定のイベントを手動実行する
				watcher.fire("add", path.join(targetDir, "text", "c.txt"));
				watcher.fire("unlink", path.join(targetDir, "text", "a.txt"));
				watcher.fire("change", path.join(targetDir, "game.json")); // asset変更時に呼ばれる想定
				setTimeout(() => {
					expect(count).toBe(1);
					done();
				}, 3000);
			});
		});

		it("can callback when updated game.json", (done) => {
			let count = 0;
			watchContent(
				targetDir,
				(err, modTargetFlag) => {
					count++;
					expect(err).toBeNull();
					expect(modTargetFlag).toBe(0x1);
				},
				watcher 
			).then(() => {
				const gameJson = JSON.parse(fs.readFileSync(path.join(targetDir, "game.json")));
				gameJson["fps"] = 60;
				fs.writeFileSync(path.join(targetDir, "game.json"), JSON.stringify(gameJson));
				// テストではchokidarが呼ばれないので、実際に発生する想定のイベントを手動実行する
				watcher.fire("change", path.join(targetDir, "game.json"));
				setTimeout(() => {
					expect(count).toBe(1);
					done();
				}, 3000);
			});
		});
	});
});
