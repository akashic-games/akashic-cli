import type { AssetConfigurationMap, Environment, GameConfiguration as Configuration } from "@akashic/game-configuration";
import type { CliConfigExportZipDumpableOption } from "./CliConfig/CliConfigExportZip";

/**
 * game.json の型。
 */
export interface GameConfiguration extends Configuration {
	assets: AssetConfigurationMap;
	environment?: Environment;
	exportZipInfo?: ExportZipInfo;
}

/**
 * akashic export zip 実行時のオプション情報。
 * エクスポート結果に埋め込む値であるため、実行環境のディレクトリの情報は持たせていないことに注意。
 */
export interface ExportZipInfo {
	version: string;
	option: CliConfigExportZipDumpableOption;
}
