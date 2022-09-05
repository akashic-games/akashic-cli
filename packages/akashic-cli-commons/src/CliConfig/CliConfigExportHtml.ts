/**
 * export html のオプションのうち、ファイルパスなどを含まず index.html にダンプ情報として含められるもの。
 */
export interface CliConfigExportHtmlDumpableOptions {
	force?: boolean;
	quiet?: boolean;
	strip?: boolean;
	hashFilename?: number | boolean;
	minify?: boolean;
	minifyJs?: boolean;
	minifyJson?: boolean;
	packImage?: boolean;
	bundle?: boolean;
	magnify?: boolean;
	atsumaru?: boolean;
	omitUnbundledJs?: boolean;
}

/**
 * export html のオプション。
 */
export interface CliConfigExportHtml extends CliConfigExportHtmlDumpableOptions {
	output: string;
	cwd?: string;
	source?: string;
	exclude?: string[];
	injects?: string[];
	autoSendEvents?: string | boolean;
	autoSendEventName?: string | boolean;
	debugOverrideEngineFiles?: string;
}

