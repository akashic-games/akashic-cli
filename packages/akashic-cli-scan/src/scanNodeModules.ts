import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import { NodeModules } from "@akashic/akashic-cli-commons/lib/NodeModules";
import { PromisedNpm } from "@akashic/akashic-cli-commons/lib/PromisedNpm";
import { chdir } from "@akashic/akashic-cli-commons/lib/Util";
import type { GameConfiguration } from "@akashic/game-configuration";
import { FileModule } from "./FileModule";

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
}

export function _completeScanNodeModulesParameterObject(param: ScanNodeModulesParameterObject): Required<ScanNodeModulesParameterObject> {
	return {
		cwd: param.cwd ?? process.cwd(),
		logger: param.logger ?? new ConsoleLogger(),
		fromEntryPoint: !!param.fromEntryPoint,
		resolveAssetIdsFromPath: !!param.resolveAssetIdsFromPath,
		forceUpdateAssetIds: !!param.forceUpdateAssetIds,
		noOmitPackagejson: !!param.noOmitPackagejson,
		debugNpm: param.debugNpm ?? undefined,
		includeExtensionToAssetId: !!param.includeExtensionToAssetId
	};
}

export async function scanNodeModules(p: ScanNodeModulesParameterObject): Promise<void> {
	const param = _completeScanNodeModulesParameterObject(p);
	const restoreDirectory = chdir(param.cwd);

	try {
		const logger = param.logger;
		const gamePath = "./game.json";
		const base = ".";
		const content = await FileModule.readJSON<GameConfiguration>(gamePath);

		let entryPaths: string | string[];

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

		if (modulePaths.length) {
			const packageJsonFiles = NodeModules.listPackageJsonsFromScriptsPath(base, modulePaths);
			const moduleMainScripts = NodeModules.listModuleMainScripts(packageJsonFiles);

			if (moduleMainScripts && 0 < Object.keys(moduleMainScripts).length) {
				if (!content.moduleMainScripts) {
					logger.warn(
						"Newly added the moduleMainScripts property to game.json." +
						"This property, introduced by akashic-cli@>=1.12.2, is NOT supported by older versions of Akashic Engine." +
						"Please ensure that you are using akashic-engine@>=2.0.2, >=1.12.7."
					);
				}
				content.moduleMainScripts = Object.assign(content.moduleMainScripts || {}, moduleMainScripts);
			}
		}

		content.globalScripts = modulePaths;

		await FileModule.writeJSON<GameConfiguration>(gamePath, content);

		logger.info("Done!");
	} finally {
		restoreDirectory();
	}
}
