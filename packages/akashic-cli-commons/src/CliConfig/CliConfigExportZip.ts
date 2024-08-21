import type { ServiceType } from "../ServiceType.js";

export interface CliConfigExportZip {
	cwd?: string;
	quiet?: boolean;
	output?: string;
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
	omitUnbundledJs?: boolean;
	targetService?: ServiceType;
	nicolive?: boolean;
	resolveAkashicRuntime?: boolean;
	preservePackageJson?: boolean;
}
