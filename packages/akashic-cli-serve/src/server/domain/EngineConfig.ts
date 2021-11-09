import * as path from "path";
import * as fs from "fs";
import { serverGlobalConfig } from "../common/ServerGlobalConfig";
import * as gameConfigs from "../domain/GameConfigs";

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
	const gameJson = gameConfigs.get(param.contentId.toString());
	let version = "1";
	let external: string[] = [];
	if (gameJson.environment != null) {
		if (gameJson.environment["sandbox-runtime"] != null) {
			version = gameJson.environment["sandbox-runtime"];
		}
		if (gameJson.environment.external != null) {
			external = Object.keys(gameJson.environment.external);
		}
	}
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const versionsJson = require("../engineFilesVersion.json");

	if (process.env.ENGINE_FILES_V3_PATH) {
		versionsJson.v3.fileName = path.basename(process.env.ENGINE_FILES_V3_PATH);
	}

	const externalFiles = fs.readdirSync(path.join(__dirname, "..", "..", "..", "www", "public", "external"));
	const pattern = param.isRaw ? /^playlogClientV\d+_\d+_\d+\.js$/g : /^playlogClientV\d+_\d+_\d+_fake\.js$/g
	const playlogClientFiles = externalFiles.filter(file => pattern.test(file));
	if (playlogClientFiles.length === 0) {
		throw new Error("Playlogclient File is not found.");
	}
	const playlogClientFile = playlogClientFiles[0];

	const engineUrls = [
		`${param.baseUrl}/public/external/${versionsJson[`v${version}`].fileName}`,
		`${param.baseUrl}/public/external/${playlogClientFile}`
	];
	if (param.isRaw) {
		engineUrls.unshift(`${param.baseUrl}/socket.io/socket.io.js`);
	}

	return {
		engine_urls: engineUrls,
		untrusted,
		external,
		content_url: `${param.baseUrl}/contents/${param.contentId}/${gameContentDir}/game.json`,
		asset_base_url: `${param.baseUrl}/contents/${param.contentId}/${gameContentDir}`
	};
};
