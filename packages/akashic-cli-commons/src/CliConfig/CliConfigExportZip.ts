import type { ServiceType } from "../ServiceType";

/**
 * export zip のオプションのうち、ファイルパスなどを含まず出力の game.json にダンプ情報として含められるもの。
 */
export interface CliConfigExportZipDumpableOption {
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
	omitUnbundledJs?: boolean;
	targetService?: ServiceType;
}

/**
 * export zip のオプション。
 */
export interface CliConfigExportZip extends CliConfigExportZipDumpableOption {
	cwd?: string;
	output?: string;

	/**
	 * @deprecated 非推奨。現在この値は常に false と見なされる。
	 */
	omitEmptyJs?: boolean;
}

