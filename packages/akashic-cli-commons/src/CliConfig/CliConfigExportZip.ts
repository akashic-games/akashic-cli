import { ServiceType } from "../ServiceType";

export interface CliConfigExportZip {
	cwd?: string;
	quiet?: boolean;
	output?: string;
	force?: boolean;
	strip?: boolean;
	minify?: boolean;
	bundle?: boolean;
	babel?: boolean;
	hashFilename?: number | boolean;
	omitEmptyJs?: boolean;
	omitUnbundledJs?: boolean;
	targetService?: ServiceType;
}
