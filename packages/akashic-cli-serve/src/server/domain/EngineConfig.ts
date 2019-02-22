export interface EngineConfig {
	engine_configuration_version: string;
	engine_urls: string[];
	content_url: string;
	asset_base_url?: string;
}

export const getEngineConfig = (baseUrl: string, isRaw: boolean): EngineConfig => {
	const gameContentDir = isRaw ? "raw" : "content";
	return {
		engine_configuration_version: "2.3.5",
		engine_urls: [
			`${baseUrl}/public/external/engineFilesV1_0_8_Canvas.js`,
			`${baseUrl}/public/external/playlogClientV3_2_1.js`
		],
		content_url: `${baseUrl}/${gameContentDir}/game.json`,
		asset_base_url: `${baseUrl}/${gameContentDir}`
	};
};
