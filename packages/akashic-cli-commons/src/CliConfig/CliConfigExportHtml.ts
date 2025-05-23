export interface CliConfigExportHtml {
	output: string;
	cwd?: string;
	source?: string;
	force?: boolean;
	quiet?: boolean;
	exclude?: string[];
	strip?: boolean;
	hashFilename?: number | boolean;
	minify?: boolean;
	/**
	 * terser による minify の際のオプション。minify プロパティが true の時のみ参照される。
	 * 指定可能な値は https://terser.org/docs/api-reference/#minify-options を参照。
	 */
	terser?: object;
	bundle?: boolean;
	magnify?: boolean;
	injects?: string[];
	autoSendEvents?: string | boolean;
	autoSendEventName?: string | boolean;
	autoGivenArgsName?: string;
	omitUnbundledJs?: boolean;
	esDownpile?: boolean;
	debugOverrideEngineFiles?: string;
}
