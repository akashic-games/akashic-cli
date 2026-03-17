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
	 * terser による minify の際のオプション。minifyJs (または minify) プロパティが true の時のみ参照される。
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
	/**
	 * akashic-runtime フィールドを解決する。
	 * - `true` の場合: 既定の URL から最新バージョンを取得して設定する。
	 * - バージョン文字列 (例: `"3.1.2"`) の場合: そのバージョンを `environment["akashic-runtime"].version` に追記する。
	 * - URL (例: `"https://..."`) の場合: その URL から最新バージョンを取得して設定する。
	 */
	resolveAkashicRuntime?: boolean | string;
	preservePackageJson?: boolean;
}
