import * as fs from "fs";
import * as path from "path";
import type { GameConfiguration } from "@akashic/akashic-cli-commons";
import * as Utils from "../Utils.js";

describe("Util", () => {
	describe("copyContentFiles", () => {
		const outPath = path.join(__dirname, "..", "..",  "__tests__", "fixtures", "out");

		afterEach(() => {
			fs.rmSync(outPath, { recursive: true, force: true });
		});

		it("Copies only the files described in game.json", async () => {
			const contentPath = path.join(__dirname, "..", "..",  "__tests__", "fixtures", "game_exclude_files");
			fs.mkdirSync(outPath);
			Utils.copyContentFiles(contentPath, outPath);

			const outDirs = fs.readdirSync(outPath);
			expect(outDirs.includes("exclude")).toBeFalsy();

			const gameJsonPath = path.resolve(contentPath, "game.json");
			const gameJson: GameConfiguration = require(gameJsonPath);

			Object.keys(gameJson.assets).forEach(v => {
				const extension = gameJson.assets[v].type === "audio" ? ".ogg" : "";
				const targetPath = path.join(outPath, gameJson.assets[v].path + extension);
				expect(fs.existsSync(targetPath)).toBeTruthy();
			});
		});

		it("Copies audio files as per hint.extensions, if given", async () => {
			const contentPath = path.join(__dirname, "..", "..",  "__tests__", "fixtures", "game_hint_exts");
			fs.mkdirSync(outPath);
			Utils.copyContentFiles(contentPath, outPath);

			// 念のため hint.extensions が意図通りであることを確認
			const gameJson: GameConfiguration = require(path.resolve(contentPath, "game.json"));
			const dummySeDecl = gameJson.assets.dummyse;
			expect(dummySeDecl.type === "audio" && dummySeDecl.hint?.extensions).toEqual([".ogg", ".m4a"]);

			expect(fs.existsSync(path.join(outPath, "audio", "dummyse.ogg"))).toBeTruthy();
			expect(fs.existsSync(path.join(outPath, "audio", "dummyse.m4a"))).toBeTruthy();
			expect(fs.existsSync(path.join(outPath, "audio", "dummyse.aac"))).toBeFalsy();
			expect(fs.existsSync(path.join(outPath, "audio", "dummyse.invalidext"))).toBeFalsy();
		});

		it("Copies existing audio files, unless hint.extensions given", async () => {
			const contentPath = path.join(__dirname, "..", "..",  "__tests__", "fixtures", "sample_game");
			fs.mkdirSync(outPath);
			Utils.copyContentFiles(contentPath, outPath);

			// 念のため hint.extensions が意図通りであることを確認
			const gameJson: GameConfiguration = require(path.resolve(contentPath, "game.json"));
			const dummySeDecl = gameJson.assets.dummyse;
			expect(dummySeDecl.type === "audio" && dummySeDecl.hint?.extensions).toBeUndefined();

			expect(fs.existsSync(path.join(outPath, "audio", "dummyse.ogg"))).toBeTruthy();
			expect(fs.existsSync(path.join(outPath, "audio", "dummyse.m4a"))).toBeTruthy();
			expect(fs.existsSync(path.join(outPath, "audio", "dummyse.aac"))).toBeTruthy();
			expect(fs.existsSync(path.join(outPath, "audio", "dummyse.invalidext"))).toBeTruthy();
		});
	});
});
