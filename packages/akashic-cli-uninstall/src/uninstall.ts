import * as path from "path";
import * as fs from "fs";
import * as cmn from "@akashic/akashic-cli-commons";
import { Configuration } from "./Configuration";
import { file } from "mock-fs/lib/filesystem";

export interface UninstallParameterObject {
	/**
	 * npm uninstall でアンインストールするモジュール名。
	 * 省略された場合、引数なしの `npm uninstall` が実行される。
	 */
	moduleNames?: string[];

	/**
	 * unlinkするか否か。
	 * 真の場合、 `npm uninstall` ではなく `npm unlink` を行う。
	 * 省略された場合、偽。
	 */
	unlink?: boolean;

	/**
	 * 対応する操作プラグインの定義を併せて削除するか否か。
	 * 省略された場合、偽。
	 */
	plugin?: boolean;

	/**
	 * 作業ディレクトリ。
	 * 省略された場合、 `process.cwd()` 。
	 */
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
}

export function _completeUninstallParameterObject(param: UninstallParameterObject): void {
	param.moduleNames = param.moduleNames || [];
	param.unlink = !!param.unlink;
	param.plugin = !!param.plugin;
	param.cwd = param.cwd || process.cwd();
	param.logger = param.logger || new cmn.ConsoleLogger();
}

export function promiseUninstall(param: UninstallParameterObject): Promise<void> {
	_completeUninstallParameterObject(param);
	const npm = param.debugNpm || new cmn.PromisedNpm({ logger: param.logger });

	if (param.plugin && param.moduleNames.length > 1) {
		return Promise.reject(new Error("'plugin' option cannot be used with multiple module uninstalling/unlinking."));
	}

	const restoreDirectory = cmn.Util.chdir(param.cwd);
	const gameJsonPath = path.join(process.cwd(), "game.json");
	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read(gameJsonPath, param.logger))
		.then((content: cmn.GameConfiguration) => {
			const conf = new Configuration({ content: content, logger: param.logger });
			const uninstallExternals: {[key: string]: string} = {}; // uninstall前にexternalを保持する

			return Promise.resolve()
				.then(() => {
					param.moduleNames.forEach((name) => {
						const libPath = path.resolve(".", "node_modules", name, "akashic-lib.json");
						try {
							const libJsonData: cmn.LibConfiguration = JSON.parse(fs.readFileSync(libPath, "utf8"));
							if (libJsonData.gameConfigurationData &&
									libJsonData.gameConfigurationData.environment &&
									libJsonData.gameConfigurationData.environment.external) {
									const environment = libJsonData.gameConfigurationData.environment;
									Object.keys(environment.external).forEach(externalName => {
										uninstallExternals[externalName] = environment.external[externalName];
								});
							}
						} catch (error) {
							if (error.code === "ENOENT") return; // akashic-lib.jsonを持っていないケース
							throw error;
						}
					});
				})
				.then(() => {
					if (param.unlink) {
						return npm.unlink(param.moduleNames);
					} else {
						return Promise.resolve()
							.then(() => npm.uninstall(param.moduleNames));
					}
				})
				.then(() => {
					if (param.plugin)
						conf.removeOperationPlugin(param.moduleNames[0]);
					conf.vacuumGlobalScripts();
					const globalScripts = conf._content.globalScripts;
					const packageJsons = cmn.NodeModules.listPackageJsonsFromScriptsPath(".", globalScripts);
					const moduleMainScripts = cmn.NodeModules.listModuleMainScripts(packageJsons);
					if (moduleMainScripts && Object.keys(moduleMainScripts).length > 0) {
						conf._content.moduleMainScripts = moduleMainScripts;
					} else {
						delete conf._content.moduleMainScripts;
					}
				})
				.then(() => {
					// 依存しなくなったexternalをgame.jsonから削除する
					const globalScripts = conf._content.globalScripts;
					const libPaths = cmn.NodeModules.listPackageJsonsFromScriptsPath(".", globalScripts).map((filepath) => {
						return path.join(path.dirname(filepath), "akashic-lib.json");
					});
					const remainExternals: {[key: string]: string} = {};
					libPaths.forEach((libPath) => {
						try {
							const libJsonData: cmn.LibConfiguration = JSON.parse(fs.readFileSync(libPath, "utf8"));
							const environment = libJsonData.gameConfigurationData.environment;
							if (libJsonData.gameConfigurationData && environment && environment.external) {
								Object.keys(environment.external).forEach((name) => {
									remainExternals[name] = environment.external[name];
								});
							}
						} catch (error) {
							if (error.code === "ENOENT") return; // akashic-lib.jsonを持っていないケース
							throw error;
						}
					});
					Object.keys(uninstallExternals).forEach((externalName) => {
						if (!remainExternals[externalName]) conf.removeExternal(externalName);
					});
				})
				.then(() => {
					return cmn.ConfigurationFile.write(conf.getContent(), gameJsonPath, param.logger);
				});
		})
		.then(restoreDirectory, restoreDirectory)
		.then(() => param.logger.info("Done!"));
}

export function uninstall(param: UninstallParameterObject, cb: (err: any) => void): void {
	promiseUninstall(param).then(cb, cb);
}
