import * as fs from "fs";
import * as path from "path";
import type { ModuleMainPathsMap, ModuleMainScriptsMap } from "@akashic/game-configuration";
import browserify from "browserify";
import { ConsoleLogger } from "./ConsoleLogger";
import type { Logger } from "./Logger";
import { StringStream } from "./StringStream";
import * as Util from "./Util";

interface ModuleMainInfo {
	moduleName: string;
	mainScriptPath: string;
}

export module NodeModules {
	export function listModuleFiles(basepath: string, modules: string|string[], logger: Logger = new ConsoleLogger()): Promise<string[]> {
		if (modules.length === 0) return Promise.resolve([]);
		return Promise.resolve()
			.then(() => NodeModules.listScriptFiles(basepath, modules, logger))
			.then((paths) => paths.concat(NodeModules.listPackageJsonsFromScriptsPath(basepath, paths)));
	}

	export function listPackageJsonsFromScriptsPath(basepath: string, filepaths: string[]): string[] {
		const packageJsonPaths: string[] = [];
		const alreadyProcessed: { [path: string]: boolean } = {};
		filepaths.forEach((filepath: string) => {
			const m = /(.*node_modules\/(?:@.*?\/)?(?:.*?)\/)/.exec(filepath);
			if (!m)
				return;
			const dirPath = m[1];
			if (alreadyProcessed[dirPath])
				return;
			alreadyProcessed[dirPath] = true;

			const packageJsonPath = Util.makeUnixPath(path.join(basepath, dirPath, "package.json"));
			try {
				if (!fs.lstatSync(packageJsonPath).isFile()) return;
				packageJsonPaths.push(Util.makeUnixPath(path.relative(basepath, packageJsonPath)));
			} catch (e) { /* nothing */ }
		});
		return packageJsonPaths;
	}

	export function listModuleMainScripts(packageJsonFiles: string[]): ModuleMainScriptsMap {
		if (packageJsonFiles.length === 0) return {};
		const moduleMainScripts: ModuleMainScriptsMap = {};

		for (let i = 0; i < packageJsonFiles.length; i++) {
			const packageJsonFile = packageJsonFiles[i];
			try {
				const { mainScriptPath, moduleName } = NodeModules.extractModuleMainInfo(packageJsonFile);
				moduleMainScripts[moduleName] = Util.makeUnixPath(mainScriptPath);
			} catch (e) {
				// do nothing
			}
		}
		return moduleMainScripts;
	}

	export function listModuleMainPaths(packageJsonFiles: string[]): ModuleMainPathsMap {
		if (packageJsonFiles.length === 0) return {};
		const moduleMainPaths: ModuleMainPathsMap = {};

		for (let i = 0; i < packageJsonFiles.length; i++) {
			const packageJsonFile = packageJsonFiles[i];
			try {
				const { mainScriptPath } = NodeModules.extractModuleMainInfo(packageJsonFile);
				moduleMainPaths[packageJsonFile] = Util.makeUnixPath(mainScriptPath);
			} catch (e) {
				// do nothing
			}
		}
		return moduleMainPaths;
	}

	export function extractModuleMainInfo(packageJsonPath: string): ModuleMainInfo {
		const packageJsonData = fs.readFileSync(packageJsonPath, "utf-8");
		const d = JSON.parse(packageJsonData);
		const paths = [path.join(path.dirname(packageJsonPath))];
		const basedir = packageJsonPath;
		let mainScriptPath = Util.requireResolve(d.name, { paths, basedir });
		if (!mainScriptPath) {
			throw new Error(`No ${d.name} in node_modules`);
		}
		mainScriptPath = mainScriptPath.replace(path.resolve(".") + path.sep, "");
		return { moduleName: d.name, mainScriptPath };
	}

	// TODO: node_modules/ 以下以外でも利用するメソッドのため、NodeModules ではなく別の適切な場所に移動する
	// checkAllModules は実験的なものです。 akashic-cli の外部から利用しないでください
	export function listScriptFiles(
		basepath: string,
		modules: string|string[],
		logger: Logger,
		checkAllModules: boolean = false
	): Promise<string[]> {
		if (modules.length === 0) return Promise.resolve([]);
		const moduleNames = (typeof modules === "string") ? [modules] : modules;

		// moduleNamesをrequireするだけのソースコード文字列を作って依存性解析の基点にする
		// (moduleNamesを直接b.require()してもよいはずだが、そうするとモジュールのエントリポイントの代わりに
		// モジュールの名前(ディレクトリ名であることが多い)が出力されてしまうので避ける)
		const dummyRootName = "__akashic-cli_dummy_require_root.js";
		const dummyRootPath = path.join(basepath, dummyRootName);
		const rootRequirer = moduleNames.map((name: string) => {
			return "require(\"" + Util.makeModuleNameNoVer(name) + "\");";
		}).join("\n");

		// akashicコンテンツが Node.js のコアモジュールを参照するモジュールに依存している場合、
		// akashic-cli-commons/node_modules 以下への依存として表現される。
		// これを検知した場合、そのモジュールへの依存はgame.jsonに追記せず、akashicコマンドユーザには警告を表示する。
		const ignoreModulePaths = ["/akashic-cli-commons/node_modules/"];

		const b = browserify({
			entries: new StringStream(rootRequirer, dummyRootPath),
			basedir: basepath,
			preserveSymlinks: true, // npm link で node_modules 以下に置かれたモジュールを symlink パスのまま扱う
			builtins: true  // builtins (コアモジュール) はサポートしていないが、b.on("dep", ...) で検出するためにtrueにする
		});
		b.external("g");

		return new Promise<string[]>((resolve, reject) => {
			const filePaths: string[] = [];
			b.on("dep", (row: any) => {
				const filePath = Util.makeUnixPath(path.relative(basepath, row.file));
				if (filePath === dummyRootName || (!checkAllModules && !(/^(?:\.\/)?node_modules/.test(filePath)))) {
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
					const msg = "Unsupported module found in " + JSON.stringify(modules)
												+ ". Skipped listing '" + filePath
												+ "' that cannot be dealt with. (This may be a core module of Node.js)";
					reject(new Error(msg));
					return;
				}
				filePaths.push(filePath);
			});
			b.bundle((err: any) => {
				void (err ? reject(err) : resolve(filePaths));
			});
		});
	}
}
