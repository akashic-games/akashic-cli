import * as path from "path";
import type { Logger } from "@akashic/akashic-cli-commons";
import { makeUnixPath } from "@akashic/akashic-cli-commons/lib/Util";
import type { AssetConfiguration, AssetConfigurationMap } from "@akashic/game-configuration";
import type { AssetConfigurationWithID, AssetScanDirectoryTable, AssetTargetType } from "./types";

export interface AssetIdResolverParameterObject {
	resolveAssetIdsFromPath: boolean;
	includeExtensionToAssetId: boolean;
}

export type AssetPathFilterMap = { [K in AssetTargetType]: RegExp | undefined };

export type MergeCustomizer = (old: AssetConfiguration | null, fresh: AssetConfiguration) => AssetConfiguration;

export type AssetIdResolver = (asset: AssetConfiguration) => string;

export type RemoveDuplicatesCondition = (a: AssetConfiguration, b: AssetConfiguration) => boolean;

export namespace AssetModule {
	/**
	 * アセットのオブジェクトを配列に変換する。
	 */
	export function toArray(assets: AssetConfigurationMap): AssetConfigurationWithID[] {
		return Object.keys(assets)
			.map<AssetConfigurationWithID>(assetId => {
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
				if (!forceUpdateAssetIds) {
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

	export function filterByPath(
		asset: AssetConfiguration,
		scannedAssets: AssetConfiguration[],
		filterMap: AssetPathFilterMap
	): boolean {
		const reg = filterMap.all ?? filterMap[asset.type as AssetTargetType];
		if (!reg) {
			return true;
		}
		if (reg.test(asset.path)) {
			if (!scannedAssets.some(scannedAsset => scannedAsset.path === asset.path)) {
				return false;
			}
		}
		return true;
	}

	export function merge(
		definedAssets: AssetConfiguration[],
		scannedAssets: AssetConfiguration[],
		assetDirTable: AssetScanDirectoryTable,
		customizer: MergeCustomizer,
		logger?: Logger
	): AssetConfiguration[] {
		const ret: AssetConfiguration[] = [];

		// スキャン対象のディレクトリに存在する定義済みアセットの中からすでに存在しないものを削除
		definedAssets = definedAssets.filter(asset => {
			const dirs = assetDirTable[asset.type as "audio" | "image" | "script" | "text"];
			if (!dirs || !dirs.length) {
				return true;
			}
			if (dirs.some(dir => asset.path.startsWith(dir))) {
				if (!scannedAssets.some(scannedAsset => asset.path === scannedAsset.path)) {
					logger?.info(
						`Removed the declaration for '${asset.path}. The corresponding files to the path are not found.`
					);
					return false;
				}
			}
			return true;
		});
		scannedAssets = scannedAssets.concat();

		// 既存のアセット情報を更新
		for (const definedAsset of definedAssets) {
			const scannedAssetIndex = scannedAssets.findIndex(scannedAsset => scannedAsset.path === definedAsset.path);
			if (0 <= scannedAssetIndex) {
				ret.push(customizer(definedAsset, scannedAssets[scannedAssetIndex]));
				scannedAssets.splice(scannedAssetIndex, 1);
			} else {
				ret.push(definedAsset);
			}
		}

		// 新規追加分
		for (const scannedAsset of scannedAssets) {
			logger?.info(`Added the declaration for '${path.basename(scannedAsset.path)}' (${scannedAsset.path})`);
			ret.push(scannedAsset);
		}

		return ret;
	}

	export function removeDuplicates(assets: AssetConfiguration[], condition: RemoveDuplicatesCondition): AssetConfiguration[] {
		return assets.filter(
			(asset, i, self) => {
				return i === self.findIndex(a => condition(a, asset));
			}
		);
	}

	export function createDefaultMergeCustomizer(_logger?: Logger): MergeCustomizer {
		return (old, fresh) => {
			if (old.type !== fresh.type) {
				throw new Error(`Conflicted Asset Type. ${fresh.path} must be ${old.type} but not ${fresh.type}.`);
			}
			if (fresh.type === "audio") {
				return {
					...old,
					duration: fresh.duration
				};
			}
			if (fresh.type === "image") {
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
			if (asset.path.startsWith("assets")) {
				// NOTE: assets/ 以下だけ常に resolveAssetIdsFromPath が有効という特殊扱い
				id = makeUnixPath(asset.path);
			} else {
				if (resolveAssetIdsFromPath) {
					id = makeUnixPath(asset.path);
				} else {
					id = path.basename(asset.path);
				}
			}
			if (!includeExtensionToAssetId) {
				id = id.replace(/\.[^/.]+$/, ""); // 拡張子を削除
			}
			return id;
		};
	}
}
