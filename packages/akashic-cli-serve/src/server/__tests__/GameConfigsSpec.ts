import fs from "fs";
import os from "os";
import path from "path";
import { type FSWatcherLike, watchContent } from "../domain/GameConfigs.js";

describe("GameConfigs", () => {
	describe("watchContent", () => {
		interface FSWatcherMock extends FSWatcherLike {
			fire(event: string, fileName: string): void;
			flushPromises(): Promise<void>[];
		}

		let targetDir: string = null!;
		let watcher: FSWatcherMock = null!;
		let watcherFuncs: { [ev: string]: Function } = {};
		beforeEach(() => {
			const promises: Promise<void>[] = [];
			watcher = {
				on: (event: string, func: Function) => {
					watcherFuncs[event] = func;
				},
				fire: (event: string, fileName: string) => {
					watcherFuncs[event](fileName);
				},
				debugNotifyPromise: (p: Promise<void>) => {
					promises.push(p);
				},
				flushPromises: () => {
					return promises.splice(0, promises.length);
				},
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
				fs.rmSync(targetDir, { recursive: true, force: true });
				targetDir = null!;
			}
			watcher = null!;
			watcherFuncs = {};
		});

		it("call callback once when updated asset", async () => {
			// jest.setTimeout(10000);
			let count = 0;
			await watchContent(
				targetDir,
				(err, modTargetFlag) => {
					count++;
					expect(err).toBeNull();
					expect(modTargetFlag).toBe(0x2);
				},
				watcher
			);
			fs.writeFileSync(path.join(targetDir, "text", "c.txt"), "ccc");
			fs.unlinkSync(path.join(targetDir, "text", "a.txt"));
			// テストではchokidarが呼ばれないので、実際に発生する想定のイベントを手動実行する
			watcher.fire("add", path.join(targetDir, "text", "c.txt"));
			watcher.fire("unlink", path.join(targetDir, "text", "a.txt"));
			watcher.fire("change", path.join(targetDir, "game.json")); // asset変更時に呼ばれる想定
			await Promise.all(watcher.flushPromises());

			expect(count).toBe(1);
		});

		it("can callback when updated game.json", async () => {
			let count = 0;
			await watchContent(
				targetDir,
				(err, modTargetFlag) => {
					count++;
					expect(err).toBeNull();
					expect(modTargetFlag).toBe(0x1);
				},
				watcher
			);
			const gameJson = JSON.parse(fs.readFileSync(path.join(targetDir, "game.json"), "utf-8"));
			gameJson.fps = 60;
			fs.writeFileSync(path.join(targetDir, "game.json"), JSON.stringify(gameJson));
			// テストではchokidarが呼ばれないので、実際に発生する想定のイベントを手動実行する
			watcher.fire("change", path.join(targetDir, "game.json"));
			await Promise.all(watcher.flushPromises());
			expect(count).toBe(1);
		});
	});
});
