import { createRequire } from "module";
import * as path from "path";
import { serverGlobalConfig } from "../common/ServerGlobalConfig.js";
import type { EngineFilesVersions } from "./EngineFilesVersions.js";
import * as gameConfigs from "./GameConfigs.js";

const require = createRequire(import.meta.url);

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
	const versionsJson: EngineFilesVersions = require("../engineFilesVersion.json");

	if (process.env.ENGINE_FILES_V3_PATH) {
		versionsJson.v3.fileName = path.basename(process.env.ENGINE_FILES_V3_PATH);
	}

	const engineUrls = [
		`${param.baseUrl}/public/external/${versionsJson[`v${version}`].fileName}`
	];

	if (param.isRaw && process.env.PLAYLOG_CLIENT_PATH) {
		engineUrls.push(`${param.baseUrl}/dynamic/${path.basename(process.env.PLAYLOG_CLIENT_PATH)}`);
		engineUrls.push(`${param.baseUrl}/socket.io/socket.io.js`); // playlogclientがsocket.ioを利用する想定なので追加しておく
	} else {
		engineUrls.push(`${param.baseUrl}/public/external/playlogClientV3_2_1.js`);
	}

	return {
		engine_urls: engineUrls,
		untrusted,
		external,
		content_url: `${param.baseUrl}/contents/${param.contentId}/${gameContentDir}/game.json`,
		asset_base_url: `${param.baseUrl}/contents/${param.contentId}/${gameContentDir}`
	};
};
