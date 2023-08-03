import * as fs from "fs";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { readJSON, writeJSON } from "@akashic/akashic-cli-commons/lib/FileSystem";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import type { AssetConfiguration, GameConfiguration } from "@akashic/game-configuration";
import { AssetModule } from "./AssetModule";
import { isBinaryFile } from "./isBinaryFile";
import { knownExtensionAssetFilter, scanAudioAssets, scanBinaryAssets, scanImageAssets, scanScriptAssets,
	scanTextAssets, scanVectorImageAssets, defaultTextAssetFilter } from "./scanUtils";
import type { AssetExtension, AssetScanDirectoryTable, AssetTargetType, LibConfiguration } from "./types";

export interface ScanAssetParameterObject {
	/**
	 * 更新する対象。
	 * `"image"`, `"audio"`, `"script"`, `"binary"`, `"text"`, `"all"` のいずれか。
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

		const scanTargetDirsTable: AssetScanDirectoryTable = {
			audio: [],
			image: [],
			script: [],
			binary: [],
			text: []
		};

		if (target === "all") {
			// NOTE: target = all の場合のみ assets ディレクトリもスキャン対象とする
			const assetsDirs: string[] = ["assets"];
			scanTargetDirsTable.audio.push(...audioDirs, ...assetsDirs);
			scanTargetDirsTable.image.push(...imageDirs, ...assetsDirs);
			scanTargetDirsTable.script.push(...scriptDirs, ...assetsDirs);
			scanTargetDirsTable.binary.push(...assetsDirs);
			scanTargetDirsTable.text.push(...textDirs, ...assetsDirs);

			// NOTE: 重複するディレクトリを削除
			scanTargetDirsTable.audio = scanTargetDirsTable.audio.filter((dir, i, self) => self.indexOf(dir) === i);
			scanTargetDirsTable.image = scanTargetDirsTable.image.filter((dir, i, self) => self.indexOf(dir) === i);
			scanTargetDirsTable.script = scanTargetDirsTable.script.filter((dir, i, self) => self.indexOf(dir) === i);
			scanTargetDirsTable.binary = scanTargetDirsTable.binary.filter((dir, i, self) => self.indexOf(dir) === i);
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
		} else if (target === "binary") {
			scanTargetDirsTable.binary = scanTargetDirsTable.binary.filter((dir, i, self) => self.indexOf(dir) === i);
		} else if (target === "text") {
			scanTargetDirsTable.text.push(...textDirs);
			scanTargetDirsTable.text = scanTargetDirsTable.text.filter((dir, i, self) => self.indexOf(dir) === i);
		} else {
			throw new Error(`Unknown target "${param.target}"`);
		}

		// スキャン結果のアセット定義の配列
		const scannedAssets: AssetConfiguration[] = [];

		const textAssetFilterRe =
			param.assetExtension.text && param.assetExtension.text.length > 0
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
		for (const dir of scanTargetDirsTable.binary) {
			const assets = await scanBinaryAssets(
				base,
				dir,
				logger,
				p => {
					if (knownExtensionAssetFilter(p)) return false;
					// NOTE: ユーザ指定の拡張子オプションが追加されたら判定に利用する
					// if (userBinaryAssetFilter(p)) return userBinaryAssetFilter(p);
					// if (defaultBinaryAssetFilter(p)) return true;
					return isBinaryFile(path.join(base, dir, p));
				}
			);
			scannedAssets.push(...assets);
		}
		for (const dir of scanTargetDirsTable.text) {
			const assets = await scanTextAssets(
				base,
				dir,
				logger,
				p => {
					if (knownExtensionAssetFilter(p)) return false; // scan が特別処理する明らかに非テキストの拡張子 (e.g. .ogg, .png) は除外する
					if (textAssetFilterRe) return textAssetFilterRe.test(p); // ユーザ指定のフィルタがあればそれで判定する
					if (defaultTextAssetFilter(p)) return true; // 高速化のため、数が多い・Akashic独自など、拡張子だけで判定できるものはそれで判定
					return !isBinaryFile(path.join(base, dir, p)); // どれでもなければ中身で判定
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
