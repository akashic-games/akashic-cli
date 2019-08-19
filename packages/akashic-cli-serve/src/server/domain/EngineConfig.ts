import * as fs from "fs";
import * as path from "path";
import { serverGlobalConfig } from "../common/ServerGlobalConfig";

export interface EngineConfig {
	engine_urls: string[];
	content_url: string;
	asset_base_url?: string;
	untrusted?: boolean;
	external?: string[];
}

export interface GetEngineConfigParameterObject {
	baseUrl: string;
	contentId: number;
	baseDir: string;
	isRaw: boolean;
}

export const getEngineConfig = (param: GetEngineConfigParameterObject): EngineConfig => {
	const untrusted = serverGlobalConfig.untrusted;
	const gameContentDir = (param.isRaw || untrusted) ? "raw" : "content";
	const gameJsonPath = path.join(param.baseDir, "game.json");
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
			`${param.baseUrl}/public/external/${versionsJson[`v${version}`].fileName}`,
			`${param.baseUrl}/public/external/playlogClientV3_2_1.js`
		],
		untrusted,
		external,
		content_url: `${param.baseUrl}/contents/${param.contentId}/${gameContentDir}/game.json`,
		asset_base_url: `${param.baseUrl}/contents/${param.contentId}/${gameContentDir}`
	};
};
