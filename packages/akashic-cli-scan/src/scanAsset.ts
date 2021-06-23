import * as fs from "fs";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import { chdir } from "@akashic/akashic-cli-commons/lib/Util";
import type { AssetConfiguration, GameConfiguration } from "@akashic/game-configuration";
import { AssetModule, AssetPathFilterMap } from "./AssetModule";
import { FileModule } from "./FileModule";
import { scanAudioAssets, scanImageAssets, scanScriptAssets, scanTextAssets, textAssetFilter } from "./scanUtils";
import type { AssetExtension, AssetScanDirectoryTable, AssetTargetType, LibConfiguration } from "./types";

export interface ScanAssetParameterObject {
	/**
	 * 更新する対象。
	 * `"image"`, `"audio"`, `"script"`, `"text"`, `"all"` のいずれか。
	 * 省略された場合、 `"all"` 。
	 */
	target?: AssetTargetType;

	/**
	 * 作業ディレクトリ。
	 * 省略された場合、 `process.cwd()` 。
	 */
	cwd?: string;

	/**
	 * コマンドの出力を受け取るロガー。
	 * 省略された場合、akashic-cli-commons の `new ConsoleLogger()` 。
	 */
	logger?: Logger;

	/**
	 * `globalScripts` に外部モジュールの package.json のパスを含めるかどうか。
	 * 省略された場合、 `false` 。
	 */
	noOmitPackagejson?: boolean;

	/**
	 * アセットIDをアセットのパスから解決するかどうか。
	 * 省略された場合、 `false` 。
	 */
	resolveAssetIdsFromPath?: boolean;

	/**
	 * アセットIDを強制的にスキャンし直すかどうか。
	 * 省略された場合、 `false` 。
	 */
	forceUpdateAssetIds?: boolean;

	/**
	 * アセットIDに拡張子を含めるかどうか。
	 * ただし音声アセットについては拡張子が含まれない点に注意。
	 * 省略された場合、 `false` 。
	 */
	includeExtensionToAssetId?: boolean;

	/*
	 * 各アセットを取得するパス。
	 */
	assetScanDirectoryTable?: AssetScanDirectoryTable;

	/**
	 * 各アセットとして扱う拡張子。
	 * 省略された場合、 `[]` 。
	 */
	assetExtension?: AssetExtension;
}

export function _completeScanAssetParameterObject(param: ScanAssetParameterObject): Required<ScanAssetParameterObject> {
	const assetScanDirectoryTable = param.assetScanDirectoryTable ?? {};
	assetScanDirectoryTable.audio = assetScanDirectoryTable.audio ?? ["audio"];
	assetScanDirectoryTable.image = assetScanDirectoryTable.image ?? ["image"];
	assetScanDirectoryTable.script = assetScanDirectoryTable.script ?? ["script"];
	assetScanDirectoryTable.text = assetScanDirectoryTable.text ?? ["text"];
	const assetExtension = param.assetExtension ?? {};
	assetExtension.text = assetExtension.text ?? [];

	return {
		target: param.target ?? "all",
		cwd: param.cwd ?? process.cwd(),
		logger: param.logger ?? new ConsoleLogger(),
		resolveAssetIdsFromPath: !!param.resolveAssetIdsFromPath,
		forceUpdateAssetIds: !!param.forceUpdateAssetIds,
		includeExtensionToAssetId: !!param.includeExtensionToAssetId,
		noOmitPackagejson: !!param.noOmitPackagejson,
		assetScanDirectoryTable,
		assetExtension
	};
}

export async function scanAsset(p: ScanAssetParameterObject): Promise<void> {
	const param = _completeScanAssetParameterObject(p);
	const restoreDirectory = chdir(param.cwd);

	try {
		const logger = param.logger;
		const target = param.target;
		const resolveAssetIdsFromPath = param.resolveAssetIdsFromPath;
		const includeExtensionToAssetId = param.includeExtensionToAssetId;
		const gamePath = "./game.json";
		const akashicLibPath = "./akashic-lib.json";
		const base = ".";

		if (!fs.existsSync(gamePath) && !fs.existsSync(akashicLibPath)) {
			throw new Error("game.json or akashic-lib.json does not exists");
		}

		const audioDirs = param.assetScanDirectoryTable.audio.concat();
		const imageDirs = param.assetScanDirectoryTable.image.concat();
		const scriptDirs = param.assetScanDirectoryTable.script.concat();
		const textDirs = param.assetScanDirectoryTable.text.concat();

		const assetScanMap: AssetScanDirectoryTable = {
			audio: [],
			image: [],
			script: [],
			text: []
		};
		const assetPathFilterMap: AssetPathFilterMap = {
			all: undefined,
			audio: undefined,
			image: undefined,
			script: undefined,
			text: undefined
		};

		if (target === "all") {
			// NOTE: target = all の場合のみ assets ディレクトリもスキャン対象とする
			const assetsDirs: string[] = ["assets"];
			assetScanMap.audio.push(...audioDirs, ...assetsDirs);
			assetScanMap.image.push(...imageDirs, ...assetsDirs);
			assetScanMap.script.push(...scriptDirs, ...assetsDirs);
			assetScanMap.text.push(...textDirs, ...assetsDirs);
			assetPathFilterMap.all = new RegExp([...audioDirs, ...imageDirs, ...scriptDirs, ...textDirs, ...assetsDirs].join("|"), "i");
		} else if (target === "audio") {
			assetScanMap.audio.push(...audioDirs);
			assetPathFilterMap.audio = new RegExp(assetScanMap.audio.join("|"), "i");
		} else if (target === "image") {
			assetScanMap.image.push(...imageDirs);
			assetPathFilterMap.image = new RegExp(assetScanMap.image.join("|"), "i");
		} else if (target === "script") {
			assetScanMap.script.push(...scriptDirs);
			assetPathFilterMap.script = new RegExp(assetScanMap.script.join("|"), "i");
		} else if (target === "text") {
			assetScanMap.text.push(...textDirs);
			assetPathFilterMap.text = new RegExp(assetScanMap.text.join("|"), "i");
		} else {
			throw new Error(`Unknown target "${param.target}"`);
		}

		// スキャン結果のアセット定義の配列
		const scannedAssets: AssetConfiguration[] = [];

		const textAssetFilterRe =
			param.assetExtension.text && param.assetExtension.text
				? new RegExp(param.assetExtension.text.join("|"), "i")
				: undefined;

		// 1. 対象のフォルダをスキャンし、各ファイルの情報をアセット定義
		for (const dir of assetScanMap.audio) {
			const assets = await scanAudioAssets(base, dir, logger);
			scannedAssets.push(...assets);
		}
		for (const dir of assetScanMap.image) {
			const assets = await scanImageAssets(base, dir, logger);
			scannedAssets.push(...assets);
		}
		for (const dir of assetScanMap.script) {
			const assets = await scanScriptAssets(base, dir, logger);
			scannedAssets.push(...assets);
		}
		for (const dir of assetScanMap.text) {
			const assets = await scanTextAssets(
				base,
				dir,
				logger,
				p => {
					if (!textAssetFilter(p)) {
						// 他の種別 (例えば ".png" など) の拡張子であってはならない
						return false;
					}
					return textAssetFilterRe ? textAssetFilterRe.test(p) : false;
				}
			);
			scannedAssets.push(...assets);
		}

		if (fs.existsSync(gamePath)) {
			let configuration: GameConfiguration;

			try {
				configuration = await FileModule.readJSON<GameConfiguration>(gamePath);
			} catch (e) {
				throw new Error(`Invalid game.json: ${e.message}`);
			}

			const definedAssets = (Array.isArray(configuration.assets) ? configuration.assets : AssetModule.toArray(configuration.assets));

			// 1. スキャン対象のディレクトリのアセットが存在しなければ削除
			let newAssets = definedAssets.filter((asset) => AssetModule.filterByPath(asset, scannedAssets, assetPathFilterMap));

			// 2. 既存のアセット情報と新規追加のアセット情報をマージ
			newAssets = AssetModule.merge(
				newAssets,
				scannedAssets,
				AssetModule.createDefaultMergeCustomizer(logger)
			);

			// 3. 上書きしてファイル書き込み
			if (Array.isArray(configuration.assets)) {
				configuration.assets = newAssets;
			} else {
				const assetIdResolver = AssetModule.createAssetIdResolver({
					resolveAssetIdsFromPath,
					includeExtensionToAssetId
				});
				configuration.assets = AssetModule.toObject(newAssets, assetIdResolver, param.forceUpdateAssetIds);
			}
			await FileModule.writeJSON<GameConfiguration>(gamePath, configuration);
		}

		if (fs.existsSync(akashicLibPath)) {
			let configuration: LibConfiguration;

			try {
				configuration = await FileModule.readJSON<LibConfiguration>(akashicLibPath);
			} catch (e) {
				throw new Error(`Invalid akashic-lib.json: ${e.message}`);
			}

			const definedAssets = (configuration.assetList || []);

			// 1. スキャン対象のディレクトリのアセットが存在しなければ削除
			let newAssets = definedAssets.filter((asset) => AssetModule.filterByPath(asset, scannedAssets, assetPathFilterMap));

			// 2. 既存のアセット情報と新規追加のアセット情報をマージ
			newAssets = AssetModule.merge(
				newAssets,
				scannedAssets,
				AssetModule.createDefaultMergeCustomizer(logger)
			);

			// 3. 上書きしてファイル書き込み
			configuration.assetList = newAssets;
			await FileModule.writeJSON<LibConfiguration>(akashicLibPath, configuration);
		}

		logger.info("Done!");
	} finally {
		restoreDirectory();
	}
}
