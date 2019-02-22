import * as cmn from "@akashic/akashic-cli-commons";
import { Configuration } from "./Configuration";

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
	var npm = param.debugNpm || new cmn.PromisedNpm({ logger: param.logger });

	if (param.plugin && param.moduleNames.length > 1) {
		return Promise.reject(new Error("'plugin' option cannot be used with multiple module uninstalling/unlinking."));
	}

	var restoreDirectory = cmn.Util.chdir(param.cwd);
	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read("./game.json", param.logger))
		.then((content: cmn.GameConfiguration) => {
			return Promise.resolve()
				.then(() => {
					if (param.unlink) {
						return npm.unlink(param.moduleNames);
					} else {
						return Promise.resolve()
							.then(() => npm.uninstall(param.moduleNames))
							.then(() => npm.shrinkwrap());
					}
				})
				.then(() => {
					var conf = new Configuration({ content: content, logger: param.logger });
					if (param.plugin)
						conf.removeOperationPlugin(param.moduleNames[0]);
					conf.vacuumGlobalScripts();
					var globalScripts = conf._content.globalScripts;
					var packageJsons = cmn.NodeModules.listPackageJsonsFromScriptsPath(".", globalScripts);
					var moduleMainScripts = cmn.NodeModules.listModuleMainScripts(packageJsons);
					if (moduleMainScripts && Object.keys(moduleMainScripts).length > 0) {
						conf._content.moduleMainScripts = moduleMainScripts;
					} else {
						delete conf._content.moduleMainScripts;
					}
					return cmn.ConfigurationFile.write(conf.getContent(), "./game.json", param.logger);
				});
		})
		.then(restoreDirectory, restoreDirectory)
		.then(() => param.logger.info("Done!"));
}

export function uninstall(param: UninstallParameterObject, cb: (err: any) => void): void {
	promiseUninstall(param).then(cb, cb);
}
