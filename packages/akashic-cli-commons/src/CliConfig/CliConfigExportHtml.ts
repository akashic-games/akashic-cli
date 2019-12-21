export interface CliConfigExportHtml {
	cwd?: string;
	source?: string;
	force?: boolean;
	quiet?: boolean;
	output?: string;
	exclude?: string[];
	strip?: boolean;
	hashFilename?: number | boolean;
	minify?: boolean;
	bundle?: boolean;
	magnify?: boolean;
	injects?: string[];
	atsumaru?: boolean;
	autoSendEvents?: string | boolean;
}
