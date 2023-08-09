import type { AssetConfiguration } from "@akashic/game-configuration";

export type AssetConfigurationWithID = AssetConfiguration & { id?: string };

export type AssetTargetType = "image" | "audio" | "script" | "binary" | "text" | "all";

export interface AssetScanDirectoryTable {
	/**
	 * AudioAssetを取得するパス。
	 * 省略された場合、 `["audio"]` 。
	 */
	audio?: string[];

	/**
	 * ImageAsset, VectorImageAssetを取得するパス。
	 * 省略された場合、 `["image"]` 。
	 */
	// TODO: "image" と "vector-image" でテーブルを分けるべきかもしれないが一旦は同一とみなす
	image?: string[];

	/**
	 * ScriptAssetを取得するパス。
	 * 省略された場合、 `["script"]` 。
	 */
	script?: string[];

	/**
	 * BinaryAssetを取得するパス。
	 * 省略された場合、 `[]` 。
	 */
	binary?: string[];

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
