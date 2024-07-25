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
	bundle?: boolean;
	magnify?: boolean;
	injects?: string[];
	autoSendEvents?: string | boolean;
	autoSendEventName?: string | boolean;
	autoGivenArgsName?: string;
	omitUnbundledJs?: boolean;
	debugOverrideEngineFiles?: string;
}
