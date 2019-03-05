import fetch from "node-fetch";

export interface EngineConfig {
	engine_urls: string[];
	content_url: string;
	asset_base_url?: string;
	external?: string[];
}

let cachedEngineFilesName: string;

const convertEngineConfig = (baseUrl: string, gameContentDir: string): EngineConfig => {
	return {
		engine_urls: [
			`${baseUrl}/public/external/${cachedEngineFilesName}`,
			`${baseUrl}/public/external/playlogClientV3_2_1.js`
		],
		external: ["coe"], // TODO: game.json から取得するように
		content_url: `${baseUrl}/${gameContentDir}/game.json`,
		asset_base_url: `${baseUrl}/${gameContentDir}`
	};
};

export const getEngineConfig = (baseUrl: string, isRaw: boolean): Promise<EngineConfig> => {
	const gameContentDir = isRaw ? "raw" : "content";
	if (cachedEngineFilesName) {
		return Promise.resolve().then(() => convertEngineConfig(baseUrl, gameContentDir));
	}
	const versionsJson = require("../engineFilesVersion.json");
	const gameJsonUrl = `${baseUrl}/${gameContentDir}/game.json`;
	return fetch(gameJsonUrl, { method: "GET" })
		.then(res => res.json())
		.then(json => {
			let version = "1";
			if (json["environment"] != null && json["environment"]["sandbox-runtime"] != null) {
				version = json["environment"]["sandbox-runtime"];
			}
			cachedEngineFilesName = `engineFilesV${versionsJson[`v${version}`].replace(/\./g, "_")}.js`;
			return convertEngineConfig(baseUrl, gameContentDir);
		});
};
