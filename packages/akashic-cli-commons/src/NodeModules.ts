import * as fs from "fs";
import * as path from "path";
import * as browserify from "browserify";
import * as Util from "./Util";
import { Logger } from "./Logger";
import { ConsoleLogger } from "./ConsoleLogger";
import { StringStream } from "./StringStream";
import { ModuleMainScripts } from "./index";

export module NodeModules {
	export function listModuleFiles(basepath: string, modules: string|string[], logger: Logger = new ConsoleLogger()): Promise<string[]> {
		if (modules.length === 0) return Promise.resolve([]);
		return Promise.resolve()
			.then(() => NodeModules.listScriptFiles(basepath, modules, logger))
			.then((paths) => paths.concat(NodeModules.listPackageJsonsFromScriptsPath(basepath, paths)));
	}

	export function listPackageJsonsFromScriptsPath(basepath: string, filepaths: string[]): string[] {
		var packageJsonPaths: string[] = [];
		var alreadyProcessed: { [path: string]: boolean } = {};
		filepaths.forEach((filepath: string) => {
			var m = /(.*node_modules\/(?:@.*?\/)?(?:.*?)\/)/.exec(filepath);
			if (!m)
				return;
			var dirPath = m[1];
			if (alreadyProcessed[dirPath])
				return;
			alreadyProcessed[dirPath] = true;

			var packageJsonPath = Util.makeUnixPath(path.join(basepath, dirPath, "package.json"));
			try {
				if (!fs.lstatSync(packageJsonPath).isFile()) return;
				packageJsonPaths.push(Util.makeUnixPath(path.relative(basepath, packageJsonPath)));
			} catch (e) { /* nothing */ }
		});
		return packageJsonPaths;
	}

	export function listModuleMainScripts(packageJsonFiles: string[]): ModuleMainScripts {
		if (packageJsonFiles.length === 0) return {};
		var moduleMainScripts: ModuleMainScripts = {};

		for (var i = 0; i < packageJsonFiles.length; i++) {
			var packageJsonFile = packageJsonFiles[i];
			var packageJsonData = fs.readFileSync(packageJsonFile, "utf-8");
			var mainScript: string;
			var moduleName: string;
			try {
				var d = JSON.parse(packageJsonData);
				mainScript = path.join(path.dirname(packageJsonFile), d.main);
				moduleName = d.name;
			} catch (e) {
				// do nothing
			}
			if (moduleName && moduleName !== "" && mainScript && mainScript !== "") {
				moduleMainScripts[moduleName] = Util.makeUnixPath(mainScript);
			}
		}
		return moduleMainScripts;
	}

	export function listScriptFiles(basepath: string, modules: string|string[], logger: Logger): Promise<string[]> {
		if (modules.length === 0) return Promise.resolve([]);
		var moduleNames = (typeof modules === "string") ? [modules] : modules;

		// moduleNamesをrequireするだけのソースコード文字列を作って依存性解析の基点にする
		// (moduleNamesを直接b.require()してもよいはずだが、そうするとモジュールのエントリポイントの代わりに
		// モジュールの名前(ディレクトリ名であることが多い)が出力されてしまうので避ける)
		var dummyRootName = path.join(basepath, "__akashic-cli_dummy_require_root.js");
		var rootRequirer = moduleNames.map((name: string) => {
			return "require(\"" + Util.makeModuleNameNoVer(name) + "\");";
		}).join("\n");

		// akashicコンテンツが Node.js のコアモジュールを参照するモジュールに依存している場合、
		// akashic-cli-commons/node_modules 以下への依存として表現される。
		// これを検知した場合、そのモジュールへの依存はgame.jsonに追記せず、akashicコマンドユーザには警告を表示する。
		const ignoreModulePaths = ["/akashic-cli-commons/node_modules/"];

		var b = browserify({
			entries: new StringStream(rootRequirer, dummyRootName),
			basedir: basepath,
			builtins: true  // builtins (コアモジュール) はサポートしていないが、b.on("dep", ...) で検出するためにtrueにする
		});
		b.external("g");

		return new Promise<string[]>((resolve, reject) => {
			var filePaths: string[] = [];
			b.on("dep", (row: any) => {
				var filePath = Util.makeUnixPath(path.relative(basepath, row.file));
				if (!(/^(?:\.\/)?node_modules/.test(filePath))) {
					return;
				}
				if (/^\.\.\//.test(filePath)) {
					const rawFilePath = Util.makeUnixPath(row.file);
					if (ignoreModulePaths.find((modulePath) => rawFilePath.includes(modulePath))) {
						const detectedModuleName = path.basename(path.dirname(filePath));
						const msg = "Reference to '" + detectedModuleName
							+ "' is detected and skipped listing."
							+ " Akashic content cannot depend on core modules of Node.js."
							+ " You should build your game runnable without '" + detectedModuleName + "'.";
						logger.warn(msg);
						return;
					}
					var msg = "Unsupported module found in " + JSON.stringify(modules)
												+ ". Skipped listing '" + filePath
												+ "' that cannot be dealt with. (This may be a core module of Node.js)";
					reject(new Error(msg));
					return;
				}
				filePaths.push(filePath);
			});
			b.bundle((err: any) => {
				err ? reject(err) : resolve(filePaths);
			});
		});
	}
}
