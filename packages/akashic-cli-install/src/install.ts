import * as path from "path";
import * as fs from "fs";
import * as tar from "tar";
import * as cmn from "@akashic/akashic-cli-commons";
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

export function _completeInstallParameterObject(param: InstallParameterObject): void {
	param.moduleNames = param.moduleNames || [];
	param.link = !!param.link;
	param.cwd = param.cwd || process.cwd();
	param.logger = param.logger || new cmn.ConsoleLogger();
	param.noOmitPackagejson = !!param.noOmitPackagejson;
}

export function promiseInstall(param: InstallParameterObject): Promise<void> {
	_completeInstallParameterObject(param);
	var npm = param.debugNpm || new cmn.PromisedNpm({ logger: param.logger });

	if (param.plugin != null && param.moduleNames.length > 1) {
		return Promise.reject(new Error("--plugin option cannot used with multiple module installing/linking."));
	}

	var restoreDirectory = cmn.Util.chdir(param.cwd);
	if (!param.link && param.moduleNames.length === 0) {
		return Promise.resolve()
			.then(() => npm.install())
			.then(() => param.logger.info("Done!"))
			.then(restoreDirectory, restoreDirectory);
	}

	let installedModuleNames: string[] = [];
	const gameJsonPath = path.join(process.cwd(), "game.json");
	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read(gameJsonPath, param.logger))
		.then((content: cmn.GameConfiguration) => {
			var conf = new Configuration({ content: content, logger: param.logger });
			if ((param.plugin != null) && conf.findExistingOperationPluginIndex(param.plugin) !== -1)
				throw new Error("Conflicted code for operation plugins: " + param.plugin + ".");

			return Promise.resolve()
				.then(() => {
					if (param.link) {
						return npm.link(param.moduleNames);
					} else {
						return Promise.resolve()
							.then(() => npm.install(param.moduleNames));
					}
				})
				.then(() => {
					// param.moduleNames は npm pack された tgz ファイルのパスを含む場合がある。しかし NodeModules#listScriptFiles() はこれを扱えない。
					// そのため tgz ファイルを解凍し package.json からモジュール名を取得し後続処理に渡す。
					installedModuleNames = param.moduleNames.map(name => {
						return /\.t(ar\.)?gz$/.test(name) ? _getPackageNameFromTgzFile(name) : name;
					});
				})
				.then(() => {
					const listFiles = param.noOmitPackagejson ? cmn.NodeModules.listModuleFiles : cmn.NodeModules.listScriptFiles;
					return listFiles(".", installedModuleNames, param.logger);
				})
				.then((filePaths: string[]) => {
					conf.addToGlobalScripts(filePaths);
					const packageJsonFiles = cmn.NodeModules.listPackageJsonsFromScriptsPath(".", filePaths);
					if (packageJsonFiles) {
						const sandboxRuntime = conf._content.environment && conf._content.environment["sandbox-runtime"] ? conf._content.environment["sandbox-runtime"] : "1";
						conf.addToModuleMainScripts(packageJsonFiles, sandboxRuntime);
					}
				})
				.then(() => {
					if (param.plugin != null)
						conf.addOperationPlugin(param.plugin, installedModuleNames[0]);
				})
				.then(() => conf.vacuumGlobalScripts())
				.then(() => {
					installedModuleNames.forEach((name) => {
						const libPath = path.resolve(".", "node_modules", name, "akashic-lib.json");
						if (!fs.existsSync(libPath)) return;

						const libJsonData: cmn.LibConfiguration = JSON.parse(fs.readFileSync(libPath, "utf8"));
						if (libJsonData.gameConfigurationData) {
							const environment = libJsonData.gameConfigurationData.environment;
							if (environment && environment.external) {
								Object.keys(environment.external).forEach(name => {
									conf.addExternal(name, environment.external[name]);
								});
							}
						}

						if (libJsonData.assetList) {
							if (!conf._content.assets) {
								conf._content.assets = {};
							}
							libJsonData.assetList.forEach(asset => {
								const assetPath = cmn.Util.makeUnixPath(path.join("node_modules", name, asset.path));
								asset.path = assetPath;
								conf._content.assets[assetPath] = asset;
							});
						}
					});
				})
				.then(() => cmn.ConfigurationFile.write(conf.getContent(), gameJsonPath, param.logger));
		})
		.then(restoreDirectory, restoreDirectory)
		.then(() => param.logger.info("Done!"));
}

export function install(param: InstallParameterObject, cb: (err: any) => void): void {
	promiseInstall(param).then(cb, cb);
}


function _getPackageNameFromTgzFile(fileName: string): string {
	let data: string;
	const onentry = (entry: tar.FileStat) => {
		const splitPath = entry.header.path.split("/");
		// splitPath[0] は解凍後のディレクトリ名が入る。そのディレクトリ直下のpackage.jsonのみを対象とする。
		if (splitPath[1] === "package.json") {
			entry.on("data", c => data = c.toString());
		}
	};
	tar.t({
		onentry,
		file: fileName,
		sync: true
	});
	const json = JSON.parse(data);
	return json.name;
}
