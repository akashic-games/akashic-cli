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
	/**
	 * terser による minify の際のオプション。minifyJs が true の時のみ参照される。
	 * 指定可能な値は https://terser.org/docs/api-reference/#minify-options を参照。
	 */
	terser?: object;
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
