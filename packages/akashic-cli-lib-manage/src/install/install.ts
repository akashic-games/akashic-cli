import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as tar from "tar";
import { Configuration } from "./Configuration";

export interface InstallParameterObject {
	/**
	 * npm install でインストールするモジュール名。
	 * 省略された場合、引数なしの `npm install` が実行される。
	 */
	moduleNames?: string[];

	/**
	 * linkするか否か。
	 * 真の場合、 `npm install` ではなく `npm link` を行う。
	 * 省略された場合、偽。
	 */
	link?: boolean;

	/**
	 * 操作プラグインとしてインストールする場合の、操作プラグイン識別コード。
	 * 省略された場合、操作プラグインとしてインストールされない。
	 */
	plugin?: number;

	/**
	 * 作業ディレクトリ。
	 * 省略された場合、 `process.cwd()` 。
	 */
	// TODO: 作業ディレクトリよりも「game.jsonのパス」を渡せる形に変えるべきではないのか
	cwd?: string;

	/**
	 * コマンドの出力を受け取るロガー。
	 * 省略された場合、akashic-cli-commons の `new ConsoleLogger()` 。
	 */
	logger?: cmn.Logger;

	/**
	 * デバッグ用: 利用するnpmのインスタンス。
	 */
	debugNpm?: cmn.PromisedNpm;

	/**
	 * インストール時に対象モジュールの package.json のパスを `globalScripts` に追加するかどうか。
	 * 省略された場合、 `false`
	 */
	noOmitPackagejson?: boolean;
}

interface NormalizedInstallParameterObject extends Required<Omit<InstallParameterObject, "plugin" | "debugNpm">> {
	plugin: number | null;
	debugNpm: cmn.PromisedNpm | null;
}

function _normalizeInstallParameterObject(param: InstallParameterObject): NormalizedInstallParameterObject {
	return {
		moduleNames: param.moduleNames ?? [],
		link: !!param.link,
		cwd: param.cwd ?? process.cwd(),
		plugin: param.plugin ?? null,
		logger: param.logger ?? new cmn.ConsoleLogger(),
		noOmitPackagejson: !!param.noOmitPackagejson,
		debugNpm: param.debugNpm ?? null
	};
}

export function promiseInstall(param: InstallParameterObject): Promise<void> {
	const normalizedParam = _normalizeInstallParameterObject(param);
	const npm = normalizedParam.debugNpm ?? new cmn.PromisedNpm({ logger: param.logger });

	if (param.plugin != null && normalizedParam.moduleNames.length > 1) {
		return Promise.reject(new Error("--plugin option cannot used with multiple module installing/linking."));
	}


	if (normalizedParam.moduleNames.some(name => /^@akashic\/akashic-engine(.*)$/.test(name))) {
		return Promise.reject(new Error("Invalid module: no need to require @akashic/akashic-engine in content."));
	}

	const restoreDirectory = cmn.Util.chdir(normalizedParam.cwd);
	if (!normalizedParam.link && normalizedParam.moduleNames.length === 0) {
		return Promise.resolve()
			.then(() => npm.install())
			.then(() => normalizedParam.logger.info("Done!"))
			.then(restoreDirectory, restoreDirectory);
	}

	let installedModuleNames: string[] = [];
	const gameJsonPath = path.join(process.cwd(), "game.json");
	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read(gameJsonPath, normalizedParam.logger))
		.then((content: cmn.GameConfiguration) => {
			const conf = new Configuration({ content: content, logger: normalizedParam.logger });
			if ((normalizedParam.plugin != null) && conf.findExistingOperationPluginIndex(normalizedParam.plugin) !== -1)
				throw new Error("Conflicted code for operation plugins: " + normalizedParam.plugin + ".");

			return Promise.resolve()
				.then(() => {
					if (normalizedParam.link) {
						return npm.link(normalizedParam.moduleNames);
					} else {
						return Promise.resolve()
							.then(() => npm.install(normalizedParam.moduleNames));
					}
				})
				.then(() => {
					// param.moduleNames は npm pack された tgz ファイルのパスを含む場合がある。しかし NodeModules#listScriptFiles() はこれを扱えない。
					// そのため tgz ファイルを解凍し package.json からモジュール名を取得し後続処理に渡す。
					installedModuleNames = normalizedParam.moduleNames.map(name => {
						return /\.t(ar\.)?gz$/.test(name) ? _getPackageNameFromTgzFile(name) : name;
					});
				})
				.then(() => {
					const listFiles = normalizedParam.noOmitPackagejson ? cmn.NodeModules.listModuleFiles : cmn.NodeModules.listScriptFiles;
					return listFiles(".", installedModuleNames, normalizedParam.logger);
				})
				.then((filePaths: string[]) => {
					conf.addToGlobalScripts(filePaths);
					const packageJsonFiles = cmn.NodeModules.listPackageJsonsFromScriptsPath(".", filePaths);
					if (packageJsonFiles) {
						const sandboxRuntime =
							conf._content.environment && conf._content.environment["sandbox-runtime"]
							? conf._content.environment["sandbox-runtime"] : "1";
						conf.addToModuleMainScripts(packageJsonFiles, sandboxRuntime);
					}
				})
				.then(() => {
					if (normalizedParam.plugin != null)
						conf.addOperationPlugin(normalizedParam.plugin, installedModuleNames[0]);
				})
				.then(() => conf.vacuumGlobalScripts())
				.then(() => {
					installedModuleNames.forEach((name) => {
						const libPath = path.resolve(".", "node_modules", name, "akashic-lib.json");
						// NOTE: akashic-lib.json の存在確認後に akashic-lib.json が削除された場合は処理が中断されてしまうことに注意
						if (!fs.existsSync(libPath)) return;

						const libJsonData: cmn.LibConfiguration = JSON.parse(fs.readFileSync(libPath, "utf8"));
						if (libJsonData.gameConfigurationData) {
							const environment = libJsonData.gameConfigurationData.environment;
							if (environment && environment.external) {
								Object.keys(environment.external).forEach(name => {
									conf.addExternal(name, environment.external![name]);
								});
							}
						}

						if (libJsonData.assetList) {
							if (!conf._content.assets) {
								conf._content.assets = {};
							}
							libJsonData.assetList.forEach(asset => {
								const assetPath = cmn.Util.makeUnixPath(path.join("node_modules", name, asset.path));
								conf._content.assets[assetPath] = {
									...asset,
									path: assetPath
								};
							});
						}
					});
				})
				.then(() => cmn.FileSystem.writeJSON<cmn.GameConfiguration>(gameJsonPath, conf.getContent()));
		})
		.then(restoreDirectory, restoreDirectory)
		.then(() => normalizedParam.logger.info("Done!"));
}

export function install(param: InstallParameterObject, cb: (err: any) => void): void {
	promiseInstall(param).then(cb, cb);
}


function _getPackageNameFromTgzFile(fileName: string): string {
	let buf: Buffer;
	const onentry = (entry: tar.FileStat): void => {
		const splitPath = entry.header.path.split("/");
		// splitPath[0] は解凍後のディレクトリ名が入る。そのディレクトリ直下のpackage.jsonのみを対象とする。
		if (splitPath[1] === "package.json") {
			const chunks: Uint8Array[]  = [];
			entry.on("data", c => chunks.push(c));
			entry.on("finish", () => buf = Buffer.concat(chunks));
		}
	};
	tar.t({
		onentry,
		file: fileName,
		sync: true
	});

	const json = JSON.parse(buf!.toString());
	return json.name;
}
