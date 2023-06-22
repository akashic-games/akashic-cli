import * as fs from "fs";
import * as path from "path";
import { GameConfiguration } from "@akashic/akashic-cli-commons";
import * as Utils from "../../../lib/html/Utils";

describe("Util", () => {
	describe("copyContentFiles", () => {
		const outPath = path.join(__dirname, "..", "..", "fixtures", "out");

		afterEach(() => {
			fs.rmSync(outPath, { recursive: true, force: true });
		});

		it("Copy only the files described in game.json", async () => {
			const contentPath = path.join(__dirname, "..", "..", "fixtures", "game_exclude_files");
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
	});
});
