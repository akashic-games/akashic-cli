import fetch from "node-fetch";

export interface EngineConfig {
	engine_urls: string[];
	content_url: string;
	asset_base_url?: string;
	external?: string[];
}

export const getEngineConfig = (baseUrl: string, isRaw: boolean): Promise<EngineConfig> => {
	const gameContentDir = isRaw ? "raw" : "content";
	const versionsJson = require("../engineFilesVersion.json");
	const gameJsonUrl = `${baseUrl}/${gameContentDir}/game.json`;
	return fetch(gameJsonUrl, { method: "GET" })
		.then(res => res.json())
		.then(json => {
			const version = json["environment"]["sandbox-runtime"] || "1";
			const engineFilesName = `engineFilesV${versionsJson[`v${version}`].replace(/\./g, "_")}.js`
			return {
				engine_urls: [
					`${baseUrl}/public/external/${engineFilesName}`,
					`${baseUrl}/public/external/playlogClientV3_2_1.js`
				],
				external: ["coe"], // TODO: game.json から取得するように
				content_url: gameJsonUrl,
				asset_base_url: `${baseUrl}/${gameContentDir}`
			};
		});
};
