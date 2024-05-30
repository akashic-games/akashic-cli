import * as fs from "fs";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { readJSON, writeJSON } from "@akashic/akashic-cli-commons/lib/FileSystem";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import { NodeModules } from "@akashic/akashic-cli-commons/lib/NodeModules";
import { PromisedNpm } from "@akashic/akashic-cli-commons/lib/PromisedNpm";
import { chdir } from "@akashic/akashic-cli-commons/lib/Util";
import type { GameConfiguration } from "@akashic/game-configuration";

export interface ScanNodeModulesParameterObject {
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
	 * エントリポイントスクリプトの内容からスキャンするようにするか否か。
	 * 省略された場合、偽。
	 * 偽である場合、 `npm ls` して得られたモジュール名一覧からスキャンする。
	 */
	fromEntryPoint?: boolean;

	/**
	 * デバッグ用のNPMを受け取る。
	 * 省略された場合、NPMを引き渡さない。
	 */
	debugNpm?: PromisedNpm | undefined;

	/**
	 * `globalScripts` に外部モジュールの package.json のパスを含めるかどうか。
	 * 省略された場合、 `false` 。
	 */
	noOmitPackagejson?: boolean;

	/**
	 * アセットIDをアセットのパスから解決するかどうか。
	 * 省略された場合、 `false` 。
	 * 偽である場合、ファイル名から拡張子を除去した文字列がアセットIDとして利用される。
	 */
	resolveAssetIdsFromPath?: boolean;

	/**
	 * アセットIDを再度スキャンし直すかどうか。
	 * 省略された場合、 `false` 。
	 */
	forceUpdateAssetIds?: boolean;

	/**
	 * アセットIDに拡張子を含めるかどうか。
	 * ただし音声アセットについては拡張子が含まれない点に注意
	 * 省略された場合、 `false` 。
	 */
	includeExtensionToAssetId?: boolean;

	/**
	 * game.json の moduleMainPaths を優先して利用するかどうか。
	 * `useMms` の指定よりも優先される。
	 * 本値と `useMms` が `false` の場合、 game.json の内容に応じて `moduleMainPaths` と `moduleMainScripts` のどちらを利用するか判断する。
	 * 省略された場合、 `false` 。
	 */
	useMmp?: boolean;

	/**
	 * game.json の moduleMainScripts を優先して利用するかどうか。
	 * 本値と `useMmp` が `false` の場合、 game.json の内容に応じて `moduleMainPaths` と `moduleMainScripts` のどちらを利用するか判断する。
	 * 省略された場合、 `false` 。
	 */
	useMms?: boolean;
}

interface NormalizedScanNodeModulesParameterObject extends Required<Omit<ScanNodeModulesParameterObject, "debugNpm">> {
	debugNpm: PromisedNpm | undefined;
}

export function _completeScanNodeModulesParameterObject(param: ScanNodeModulesParameterObject): NormalizedScanNodeModulesParameterObject {
	return {
		cwd: param.cwd ?? process.cwd(),
		logger: param.logger ?? new ConsoleLogger(),
		fromEntryPoint: !!param.fromEntryPoint,
		resolveAssetIdsFromPath: !!param.resolveAssetIdsFromPath,
		forceUpdateAssetIds: !!param.forceUpdateAssetIds,
		noOmitPackagejson: !!param.noOmitPackagejson,
		debugNpm: param.debugNpm ?? undefined,
		includeExtensionToAssetId: !!param.includeExtensionToAssetId,
		useMmp: !!param.useMmp,
		useMms: !!param.useMms,
	};
}

export async function scanNodeModules(p: ScanNodeModulesParameterObject): Promise<void> {
	const param = _completeScanNodeModulesParameterObject(p);
	const restoreDirectory = chdir(param.cwd);

	try {
		const logger = param.logger;
		const gamePath = "./game.json";
		const base = ".";
		const content = await readJSON<GameConfiguration>(gamePath);
		const sandboxRuntime = content.environment?.["sandbox-runtime"] ?? "1";

		let entryPaths: string | string[];
		let useMmp: boolean = false;

		if (sandboxRuntime === "3") {
			if (param.useMmp) {
				useMmp = true;
			} else if (param.useMms) {
				useMmp = false;
			} else {
				useMmp = content.moduleMainPaths != null;
			}
		} else {
			useMmp = false;
		}

		if (param.fromEntryPoint) {
			let entryPointPath: string | null = null;
			if (content.main) {
				entryPointPath = content.main;
			} else {
				if (!Array.isArray(content.assets)) {
					if (content.assets.mainScene) {
						path.join(base, content.assets.mainScene.path);
					}
				}
			}
			if (!entryPointPath) {
				throw new Error("Unable to find a valid entry point.");
			}
			entryPaths = entryPointPath;
		} else {
			const npm = param.debugNpm ?? new PromisedNpm({ logger });

			let dependencyPackageNames: string[];
			try {
				// lsResultオブジェクトは、package.jsonのdependenciesに書かれたモジュールと、それらの各依存モジュールをツリー構造で表したオブジェクトである。
				// これらのうち、dependenciesに直接書かれていない依存モジュールのファイルパスは、依存モジュールのバージョン・インストール順序によって不定である。
				// よって、依存モジュールのファイルパスを解決する方法として、
				// node_modules/直下にあるモジュール名（つまりpackage.jsonのdependenciesに書かれたモジュール）のみをNodeModules.listModuleFilesに渡す。
				// これにより、requireチェーンによって依存モジュールのファイルパスが解決される。
				const lsResult = await npm.ls();
				lsResult.dependencies = lsResult.dependencies ?? {};

				dependencyPackageNames = Object.keys(lsResult.dependencies);
			} catch (err) {
				// モジュールがない場合(npm install 未実施)は scan の前に npm install を実行するメッセージを追加表示
				if ( /missing:/.test(err.message))
					err.message += "run “npm install” before scanning globalScripts.";
				throw new Error(err);
			}

			entryPaths = dependencyPackageNames;
		}

		const listFiles = param.noOmitPackagejson ? NodeModules.listModuleFiles : NodeModules.listScriptFiles;
		const modulePaths = await listFiles(base, entryPaths, logger) ?? [];
		// 既に登録されている globalScripts のうち存在しているものを残した後、新規で追加されたスクリプトのみを追加している。この追加時に重複を防ぐためにSetを用いている。
		const globalScripts = Array.from(new Set([
			...(content.globalScripts ?? []).filter(f => fs.existsSync(path.resolve(base, f))),
			...modulePaths
		])).sort();

		if (globalScripts.length) {
			const packageJsonFiles = NodeModules.listPackageJsonsFromScriptsPath(base, globalScripts);

			if (useMmp) {
				const moduleMainPaths = NodeModules.listModuleMainPaths(packageJsonFiles);
				content.moduleMainPaths = Object.assign(content.moduleMainPaths || {}, moduleMainPaths);
				delete content.moduleMainScripts;
			} else {
				const moduleMainScripts = NodeModules.listModuleMainScripts(packageJsonFiles);

				if (moduleMainScripts && 0 < Object.keys(moduleMainScripts).length) {
					content.moduleMainScripts = Object.assign(content.moduleMainScripts || {}, moduleMainScripts);
				}

				delete content.moduleMainPaths;
			}
		} else {
			delete content.moduleMainPaths;
			delete content.moduleMainScripts;
		}

		content.globalScripts = globalScripts;

		await writeJSON<GameConfiguration>(gamePath, content);

		logger.info("Done!");
	} finally {
		restoreDirectory();
	}
}
