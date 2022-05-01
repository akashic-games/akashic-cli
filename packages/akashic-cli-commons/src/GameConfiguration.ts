import type { AssetConfigurationMap, GameConfiguration as Configuration } from "@akashic/game-configuration";
import type { CliConfigExportZipDumpableOption } from "./CliConfig/CliConfigExportZip";

/**
 * game.json の型。
 */
export interface GameConfiguration extends Configuration{
	assets: AssetConfigurationMap;
	environment?: ModuleEnvironment;
	exportZipInfo?: ExportZipInfo;
}

export interface ModuleEnvironment {
	"sandbox-runtime"?: string;
	external?: {[key: string]: string};
}

export interface ExportZipInfo {
	version: string;
	option: CliConfigExportZipDumpableOption;
}