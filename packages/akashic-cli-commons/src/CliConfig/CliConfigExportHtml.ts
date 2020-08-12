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
	atsumaru?: boolean;
	autoSendEvents?: string | boolean;
	autoSendEventName?: string | boolean;
	omitUnbundledJs?: boolean;
}
