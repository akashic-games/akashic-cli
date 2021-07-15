import type { AssetConfiguration } from "@akashic/game-configuration";

export type AssetConfigurationWithID = AssetConfiguration & { id: string; };

export type AssetTargetType = "image" | "audio" | "script" | "text" | "all";

export interface AssetScanDirectoryTable {
	/**
	 * AudioAssetを取得するパス。
	 * 省略された場合、 `["audio"]` 。
	 */
	audio?: string[];

	/**
	 * ImageAssetを取得するパス。
	 * 省略された場合、 `["image"]` 。
	 */
	image?: string[];

	/**
	 * ScriptAssetを取得するパス。
	 * 省略された場合、 `["script"]` 。
	 */
	script?: string[];

	/**
	 * TextAssetを取得するパス。
	 * 省略された場合、 `["text"]` 。
	 */
	text?: string[];
}

export interface AssetExtension {
	/**
	 * TextAssetの拡張子。
	 * 空配列 `[]` であればすべての拡張子をTextAssetとして扱う。
	 * 省略された場合、 `[]` 。
	 */
	text?: string[];
}

// TODO: akashic-cli-commons へ持っていく
export interface LibConfiguration {
	assetList?: AssetConfiguration[];
}
