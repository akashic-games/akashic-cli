import fetch from "node-fetch";

export interface EngineConfig {
	engine_urls: string[];
	content_url: string;
	asset_base_url?: string;
	external?: string[];
}

let cachedEngineConfig: EngineConfig;

export const getEngineConfig = (baseUrl: string, isRaw: boolean): Promise<EngineConfig> => {
	if (cachedEngineConfig) {
		return Promise.resolve().then(() => cachedEngineConfig);
	}
	const gameContentDir = isRaw ? "raw" : "content";
	const versionsJson = require("../engineFilesVersion.json");
	const gameJsonUrl = `${baseUrl}/${gameContentDir}/game.json`;
	return fetch(gameJsonUrl, { method: "GET" })
		.then(res => res.json())
		.then(json => {
			let version = "1";
			if (json["environment"] != null && json["environment"]["sandbox-runtime"] != null) {
				version = json["environment"]["sandbox-runtime"];
			}
			const engineFilesName = `engineFilesV${versionsJson[`v${version}`].replace(/\./g, "_")}.js`;
			cachedEngineConfig = {
				engine_urls: [
					`${baseUrl}/public/external/${engineFilesName}`,
					`${baseUrl}/public/external/playlogClientV3_2_1.js`
				],
				external: ["coe"], // TODO: game.json から取得するように
				content_url: gameJsonUrl,
				asset_base_url: `${baseUrl}/${gameContentDir}`
			};
			return cachedEngineConfig;
		});
};
