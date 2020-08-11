import { ServiceType } from "./ServiceType";

/**
 * 各アセット定義。
 * game.json の "assets" の各要素の型。
 */
export interface AssetConfiguration {
	type: string;
	path: string;
	virtualPath?: string;
	width?: number;
	height?: number;
	systemId?: string;
	global?: boolean;
	duration?: number;
	hint?: {
		untainted?: boolean;
	};
}

/**
 * AudioSystem 定義。
 * game.json の "audio" の各要素の型。
 */
export interface AudioSystemConfiguration {
	music?: boolean;
}

/**
 * アセット定義。
 * game.json の "assets" の値の型。
 */
export interface Assets {
	[key: string]: AssetConfiguration;
	mainScene?: AssetConfiguration;
}

/**
 * 操作プラグイン定義。
 */
export interface OperationPluginDeclaration {
	code: number;
	script: string;
	option?: any;
}

export type ModuleMainScripts = { [path: string]: string };

/**
 * game.json の型。
 */
export interface GameConfiguration {
	width: number;
	height: number;
	fps?: number;
	main?: string;
	audio?: {[key: string]: AudioSystemConfiguration};
	assets?: Assets;
	globalScripts?: string[];
	operationPlugins?: OperationPluginDeclaration[];
	environment?: ModuleEnvironment;
	moduleMainScripts?: ModuleMainScripts;
	exportZipInfo?: ExportZipInfo;
}

export interface ModuleEnvironment {
	"sandbox-runtime"?: string;
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
		bundle?: boolean;
		babel?: boolean;
		hashFilename?: number | boolean;
		omitEmptyJs?: boolean;
		targetService?: ServiceType;
	};
}
