import * as fs from "fs";
import * as path from "path";

export interface EngineConfig {
	engine_urls: string[];
	content_url: string;
	asset_base_url?: string;
	external?: string[];
}

export const getEngineConfig = (baseUrl: string, contentId: number, baseDir: string, isRaw: boolean): EngineConfig => {
	const gameContentDir = isRaw ? "raw" : "content";
	const gameJsonPath = path.join(baseDir, "game.json");
	// TODO: chokidar等でgame.jsonの変更時だけ読み込みを行うようにする
	const gameJson: any = JSON.parse(fs.readFileSync(gameJsonPath).toString());
	let version = "1";
	let external: string[] = [];
	if (gameJson["environment"] != null) {
		if (gameJson["environment"]["sandbox-runtime"] != null) {
			version = gameJson["environment"]["sandbox-runtime"];
		}
		if (gameJson["environment"]["external"] != null) {
			external = Object.keys(gameJson["environment"]["external"]);
		}
	}
	const versionsJson = require("../engineFilesVersion.json");
	return {
		engine_urls: [
			`${baseUrl}/public/external/${versionsJson[`v${version}`].fileName}`,
			`${baseUrl}/public/external/playlogClientV3_2_1.js`
		],
		external,
		content_url: `${baseUrl}/contents/${contentId}/${gameContentDir}/game.json`,
		asset_base_url: `${baseUrl}/contents/${contentId}/${gameContentDir}`
	};
};
