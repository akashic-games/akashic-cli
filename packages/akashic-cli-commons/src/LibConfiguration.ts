import { AssetConfiguration } from "./GameConfiguration";

/**
 * akashic-lib.json の型。
 */
export interface LibConfiguration {
	gameConfigurationData?: LibGameJsonData;
	assetList?: AssetConfiguration[];
}

export interface LibGameJsonData {
	environment?: LibEnvironment;
}

export interface LibEnvironment {
	external?: { [name: string]: string };
}
