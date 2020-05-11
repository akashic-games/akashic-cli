import * as path from "path";
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
							.then(() => npm.install(param.moduleNames))
							.then(() => npm.shrinkwrap());
					}
				})

				.then(() => {
					// param.moduleNames は npm pack された tgz ファイルのパスを含む場合がある。しかし NodeModules#listScriptFiles() はこれを扱えない。
					// そのため tgz ファイルを解凍し package.json から name を取得する。
					param.moduleNames.forEach((moduleName) => {
						if (/\.tgz/.test(moduleName)) {
							moduleName = _getPackageNameFromTgzFile(moduleName);
						}
						installedModuleNames.push(moduleName);
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
						conf.addToModuleMainScripts(packageJsonFiles);
					}
				})
				.then(() => {
					if (param.plugin != null)
						conf.addOperationPlugin(param.plugin, installedModuleNames[0]);
				})
				.then(() => conf.vacuumGlobalScripts())
				.then(() => cmn.ConfigurationFile.write(conf.getContent(), gameJsonPath, param.logger));
		})
		.then(restoreDirectory, restoreDirectory)
		.then(() => param.logger.info("Done!"));
}

export function install(param: InstallParameterObject, cb: (err: any) => void): void {
	promiseInstall(param).then(cb, cb);
}


function _getPackageNameFromTgzFile(fileName: string): string {
	const data: any = [];
	const onentry = (entry: tar.FileStat) => {
		if (entry.header.path.indexOf("package.json") !== -1) {
			entry.on("data", c => data.push(c) );
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
