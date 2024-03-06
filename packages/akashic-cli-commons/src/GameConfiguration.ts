import type { AssetConfigurationMap, GameConfiguration as Configuration } from "@akashic/game-configuration";
import type { ServiceType } from "./ServiceType";

/**
 * game.json の型。
 */
export interface GameConfiguration extends Configuration{
	assets: AssetConfigurationMap;
	renderers?: ("canvas" | "webgl")[];
	exportZipInfo?: ExportZipInfo;
}

/**
 * akashic export zip 実行時のオプション情報。
 * エクスポート結果に埋め込む値であるため、実行環境のディレクトリの情報は持たせていないことに注意。
 */
export interface ExportZipInfo {
	version: string;
	option: {
		quiet?: boolean;
		force?: boolean;
		strip?: boolean;
		minify?: boolean;
		minifyJs?: boolean;
		minifyJson?: boolean;
		packImage?: boolean;
		bundle?: boolean;
		babel?: boolean;
		hashFilename?: number | boolean;
		omitEmptyJs?: boolean;
		targetService?: ServiceType;
		nicolive?: boolean;
		preservePackageJson?: boolean;
	};
}
