import * as path from "path";
import type { Logger } from "@akashic/akashic-cli-commons";
import { makeUnixPath } from "@akashic/akashic-cli-commons/lib/Util";
import type { AssetConfiguration, AssetConfigurationMap } from "@akashic/game-configuration";
import type { AssetConfigurationWithID, AssetScanDirectoryTable } from "./types";

export interface AssetIdResolverParameterObject {
	resolveAssetIdsFromPath: boolean;
	includeExtensionToAssetId: boolean;
}

export type MergeCustomizer = (old: AssetConfiguration, fresh: AssetConfiguration) => AssetConfiguration;

export type AssetIdResolver = (asset: AssetConfiguration) => string;

export namespace AssetModule {
	/**
	 * アセットのオブジェクトを配列に変換する。
	 */
	export function toArray(assets: AssetConfigurationMap): AssetConfigurationWithID[] {
		return Object.keys(assets).map<AssetConfigurationWithID>(assetId => {
			return {
				id: assetId,
				...assets[assetId]
			};
		});
	}

	/**
	 * アセットの配列をオブジェクトに変換する
	 */
	export function toObject(
		assets: (AssetConfiguration | AssetConfigurationWithID)[],
		assetIdResolver: AssetIdResolver,
		forceUpdateAssetIds: boolean = false
	): AssetConfigurationMap {
		const assetMap: AssetConfigurationMap = {};
		for (const asset of assets) {
			let assetId: string;
			if ("id" in asset) {
				if (!forceUpdateAssetIds && asset.id) {
					assetId = asset.id;
				} else {
					assetId = assetIdResolver(asset);
				}
				delete asset.id;
			} else {
				assetId = assetIdResolver(asset);
			}
			if (assetMap[assetId]) {
				throw new Error(`Conflicted Asset ID. ${assetId} for ${asset.path} is already used.`);
			}
			assetMap[assetId] = asset;
		}
		return assetMap;
	}

	export function merge(
		definedAssets: AssetConfiguration[],
		scannedAssets: (AssetConfiguration | null)[],
		assetDirTable: AssetScanDirectoryTable,
		customizer: MergeCustomizer,
		logger?: Logger
	): AssetConfiguration[] {
		scannedAssets = scannedAssets.concat();
		const ret: AssetConfiguration[] = [];

		// スキャン対象のディレクトリの定義済みアセットの中からすでに存在しないものを削除
		for (const definedAsset of definedAssets) {
			const key = definedAsset.type === "vector-image" ? "image" : definedAsset.type as "audio" | "image" | "script" | "text";
			let dirs = assetDirTable[key];
			if (dirs && dirs.length) {
				dirs = dirs.map(dir => dir.endsWith("/") ? dir : dir + "/");
				if (dirs.some(dir => definedAsset.path.startsWith(dir))) {
					if (!scannedAssets.some(scannedAsset => scannedAsset && definedAsset.path === scannedAsset.path)) {
						logger?.info(
							`Removed the declaration for '${definedAsset.path}'. The corresponding files to the path are not found.`
						);
						continue;
					}
				}
			}

			// 既存のアセット情報を更新
			const scannedAssetIndex = scannedAssets.findIndex(scannedAsset => scannedAsset && scannedAsset.path === definedAsset.path);
			if (0 <= scannedAssetIndex) {
				ret.push(customizer(definedAsset, scannedAssets[scannedAssetIndex]!));
				scannedAssets.splice(scannedAssetIndex, 1);
			} else {
				ret.push(definedAsset);
			}
		}

		// 新規追加分
		for (const scannedAsset of scannedAssets) {
			if (!scannedAsset) continue;
			logger?.info(`Added the declaration for '${path.basename(scannedAsset.path)}' (${scannedAsset.path})`);
			ret.push(scannedAsset);
		}

		return ret;
	}

	export function createDefaultMergeCustomizer(logger?: Logger): MergeCustomizer {
		return (old, fresh) => {
			if (old.type !== fresh.type) {
				throw new Error(`Conflicted Asset Type. ${fresh.path} must be ${old.type} but not ${fresh.type}.`);
			}
			if (fresh.type === "audio" && old.type === "audio") {
				if (fresh.duration !== old.duration) {
					logger?.info(`Detected change of the audio duration for ${fresh.path} from ${old.duration} to ${fresh.duration}`);
				}
				if (!isSameExtensions(old.hint?.extensions, fresh.hint?.extensions)) {
					logger?.info(`Detected change of the audio extensions for ${fresh.path} from ${
						JSON.stringify(old.hint?.extensions)
					} to ${
						JSON.stringify(fresh.hint?.extensions)
					}`);
				}
				return {
					...old,
					duration: fresh.duration,
					hint: fresh.hint? { ...old.hint, extensions: fresh.hint.extensions } : old.hint
				};
			}
			if (
				(fresh.type === "image" && old.type === "image") ||
				(fresh.type === "vector-image" && old.type === "vector-image")
			) {
				if (fresh.width !== old.width || fresh.height !== old.height) {
					logger?.info(
						`Detected change of the ${fresh.type} size for ${fresh.path}`
						+ ` from ${old.width}x${old.height} to ${fresh.width}x${fresh.height}`
					);
				}
				return {
					...old,
					width: fresh.width,
					height: fresh.height
				};
			}
			return {
				...old
			};
		};
	}

	export function createAssetIdResolver(param: AssetIdResolverParameterObject): AssetIdResolver {
		const resolveAssetIdsFromPath = param.resolveAssetIdsFromPath;
		const includeExtensionToAssetId = param.includeExtensionToAssetId;
		return asset => {
			let id: string;
			if (asset.path.startsWith("assets/")) {
				// NOTE: assets/ 以下だけ常に resolveAssetIdsFromPath が有効という特殊扱い
				id = makeUnixPath(asset.path);
			} else {
				if (resolveAssetIdsFromPath) {
					id = makeUnixPath(asset.path);
				} else {
					id = path.basename(asset.path);
				}
				if (
					asset.type !== "audio" && // NOTE: オーディオアセットは拡張子が含まれていないため無視
					!includeExtensionToAssetId
				) {
					id = id.replace(/\.[^/.]+$/, ""); // 拡張子を削除
				}
			}
			return id;
		};
	}

	// NOTE: akashic-cli-commons で定義して汎用化を検討する
	function isSameExtensions(extensions1: string[] | undefined, extensions2: string[] | undefined): boolean {
		return JSON.stringify(extensions1) === JSON.stringify(extensions2);
	}
}
