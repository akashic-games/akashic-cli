import * as fs from "fs";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { readJSON, writeJSON } from "@akashic/akashic-cli-commons/lib/FileSystem";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import type { AssetConfiguration, GameConfiguration } from "@akashic/game-configuration";
import { AssetModule } from "./AssetModule";
import {scanAudioAssets, scanImageAssets, scanScriptAssets, scanTextAssets, scanVectorImageAssets, textAssetFilter} from "./scanUtils";
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

interface NormalizedScanAssetParameterObject extends Required<Omit<ScanAssetParameterObject, "AssetScanDirectoryTable">> {
	assetScanDirectoryTable: Required<AssetScanDirectoryTable>;
}

export function _completeScanAssetParameterObject(param: ScanAssetParameterObject): NormalizedScanAssetParameterObject {
	const assetScanDirectoryTable = {
		audio: param.assetScanDirectoryTable?.audio ?? ["audio"],
		image: param.assetScanDirectoryTable?.image ?? ["image"],
		script: param.assetScanDirectoryTable?.script ?? ["script"],
		text: param.assetScanDirectoryTable?.text ?? ["text"]
	};
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

	try {
		const logger = param.logger;
		const target = param.target;
		const resolveAssetIdsFromPath = param.resolveAssetIdsFromPath;
		const includeExtensionToAssetId = param.includeExtensionToAssetId;
		const gamePath = path.join(param.cwd, "game.json");
		const akashicLibPath = path.join(param.cwd, "./akashic-lib.json");
		const base =  param.cwd;

		if (!fs.existsSync(gamePath) && !fs.existsSync(akashicLibPath)) {
			throw new Error("game.json or akashic-lib.json does not exists");
		}

		const audioDirs = param.assetScanDirectoryTable.audio.concat();
		const imageDirs = param.assetScanDirectoryTable.image.concat();
		const scriptDirs = param.assetScanDirectoryTable.script.concat();
		const textDirs = param.assetScanDirectoryTable.text.concat();

		const scanTargetDirsTable: Required<AssetScanDirectoryTable> = {
			audio: [],
			image: [],
			script: [],
			text: []
		};

		if (target === "all") {
			// NOTE: target = all の場合のみ assets ディレクトリもスキャン対象とする
			const assetsDirs: string[] = ["assets"];
			scanTargetDirsTable.audio.push(...audioDirs, ...assetsDirs);
			scanTargetDirsTable.image.push(...imageDirs, ...assetsDirs);
			scanTargetDirsTable.script.push(...scriptDirs, ...assetsDirs);
			scanTargetDirsTable.text.push(...textDirs, ...assetsDirs);

			// NOTE: 重複するディレクトリを削除
			scanTargetDirsTable.audio = scanTargetDirsTable.audio.filter((dir, i, self) => self.indexOf(dir) === i);
			scanTargetDirsTable.image = scanTargetDirsTable.image.filter((dir, i, self) => self.indexOf(dir) === i);
			scanTargetDirsTable.script = scanTargetDirsTable.script.filter((dir, i, self) => self.indexOf(dir) === i);
			scanTargetDirsTable.text = scanTargetDirsTable.text.filter((dir, i, self) => self.indexOf(dir) === i);
		} else if (target === "audio") {
			scanTargetDirsTable.audio.push(...audioDirs);
			scanTargetDirsTable.audio = scanTargetDirsTable.audio.filter((dir, i, self) => self.indexOf(dir) === i);
		} else if (target === "image") {
			scanTargetDirsTable.image.push(...imageDirs);
			scanTargetDirsTable.image = scanTargetDirsTable.image.filter((dir, i, self) => self.indexOf(dir) === i);
		} else if (target === "script") {
			scanTargetDirsTable.script.push(...scriptDirs);
			scanTargetDirsTable.script = scanTargetDirsTable.script.filter((dir, i, self) => self.indexOf(dir) === i);
		} else if (target === "text") {
			scanTargetDirsTable.text.push(...textDirs);
			scanTargetDirsTable.text = scanTargetDirsTable.text.filter((dir, i, self) => self.indexOf(dir) === i);
		} else {
			throw new Error(`Unknown target "${param.target}"`);
		}

		// スキャン結果のアセット定義の配列
		const scannedAssets: (AssetConfiguration | null)[] = [];

		const textAssetFilterRe =
			param.assetExtension.text && param.assetExtension.text
				? new RegExp(param.assetExtension.text.join("|"), "i")
				: undefined;

		// 1. 対象のフォルダをスキャンし、各ファイルの情報をアセット定義
		for (const dir of scanTargetDirsTable.audio) {
			const assets = await scanAudioAssets(base, dir, logger);
			scannedAssets.push(...assets);
		}
		for (const dir of scanTargetDirsTable.image) {
			const assets = [
				...(await scanImageAssets(base, dir, logger)),
				...(await scanVectorImageAssets(base, dir, logger))
			];
			scannedAssets.push(...assets);
		}
		for (const dir of scanTargetDirsTable.script) {
			const assets = await scanScriptAssets(base, dir, logger);
			scannedAssets.push(...assets);
		}
		for (const dir of scanTargetDirsTable.text) {
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
				configuration = await readJSON<GameConfiguration>(gamePath);
			} catch (e) {
				throw new Error(`Invalid game.json: ${e.message}`);
			}

			const definedAssets = (Array.isArray(configuration.assets) ? configuration.assets : AssetModule.toArray(configuration.assets));

			// 既存のアセット情報と新規追加のアセット情報をマージ
			const newAssets = AssetModule.merge(
				definedAssets,
				scannedAssets,
				scanTargetDirsTable,
				AssetModule.createDefaultMergeCustomizer(logger),
				logger
			);

			// 上書きしてファイル書き込み
			if (Array.isArray(configuration.assets)) {
				configuration.assets = newAssets;
			} else {
				const assetIdResolver = AssetModule.createAssetIdResolver({
					resolveAssetIdsFromPath,
					includeExtensionToAssetId
				});
				configuration.assets = AssetModule.toObject(newAssets, assetIdResolver, param.forceUpdateAssetIds);
			}
			await writeJSON<GameConfiguration>(gamePath, configuration);
		}

		if (fs.existsSync(akashicLibPath)) {
			let configuration: LibConfiguration;

			try {
				configuration = await readJSON<LibConfiguration>(akashicLibPath);
			} catch (e) {
				throw new Error(`Invalid akashic-lib.json: ${e.message}`);
			}

			const definedAssets = (configuration.assetList || []);

			// 既存のアセット情報と新規追加のアセット情報をマージ
			const newAssets = AssetModule.merge(
				definedAssets,
				scannedAssets,
				scanTargetDirsTable,
				AssetModule.createDefaultMergeCustomizer(logger),
				logger
			);

			// 上書きしてファイル書き込み
			configuration.assetList = newAssets;
			await writeJSON<LibConfiguration>(akashicLibPath, configuration);
		}

		logger.info("Done!");
	} catch (e) {
		throw e;
	}
}
