import * as path from "path";
import * as fs from "fs";
import * as imageSize from "image-size";
import * as readdirRecursive from "fs-readdir-recursive";
import * as cmn from "@akashic/akashic-cli-commons";
import { getAudioDuration } from "./getAudioDuration";

export function _isImageFilePath(p: string): boolean { return /.*\.(png|gif|jpg|jpeg)$/i.test(p); }
export function _isAudioFilePath(p: string): boolean { return /.*\.(ogg|aac|mp4)$/i.test(p); }
export function _isScriptAssetPath(p: string): boolean { return /.*\.(js|json)$/i.test(p); }
export function _isTextAssetPath(p: string): boolean { return true; }  // no limitation...
export function _isPackageJsonPath(p: string): boolean { return /.*[\/\\]package.json$/.test(p) || (p === "package.json"); }

export function _listDirectoryContents(dir: string): string[] {
	if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory())
		return [];
	return fs.readdirSync(dir).filter((fname: string) => {
		return !(fname.length > 0 && fname[0] === ".");
	});
}

export function _assertAssetNameNoConflict(assets: cmn.Assets, aid: string, filepath: string): void {
	if (assets.hasOwnProperty(aid))
		throw new Error("Conflicted Asset ID. " + aid + " for " + filepath + " is already used.");
}

export function _assertAssetTypeNoConflict(aid: string, filepath: string, expectedType: string, actualType: string): void {
	if (expectedType !== actualType)
		throw new Error("Conflicted Asset Type. " + aid + " for " + filepath + " must be " + expectedType + " but not " + actualType + ".");
}

export function _assertAssetFilenameValid(name: string): void {
	if (!/^[a-zA-Z_$]{1}[0-9a-zA-Z_$]*$/.test(name))
		throw new Error(
			"`" + name + "` is not a valid file name for assets. " +
			"it must be a valid JavaScript's identifier name. (Only alphabets, numbers, '_' and '$' are allowed.)");
}

export interface DurationInfo {
	basename: string;
	ext: string;
	duration: number;
	path: string;
}
export type DurationMap = { [basename: string]: DurationInfo };

export interface ConfigurationParameterObject extends cmn.ConfigurationParameterObject {
	basepath: string;
	noOmitPackagejson?: boolean;
	debugNpm?: cmn.PromisedNpm;
}

export class Configuration extends cmn.Configuration {
	_basepath: string;
	_noOmitPackagejson: boolean;
	_npm: cmn.PromisedNpm;

	constructor(param: ConfigurationParameterObject) {
		super(param);
		this._basepath = param.basepath;
		this._noOmitPackagejson = param.noOmitPackagejson;
		this._npm = param.debugNpm ? param.debugNpm : new cmn.PromisedNpm({ logger: param.logger });
	}

	scanAssets(): Promise<void> {
		return Promise.resolve()
			.then(() => {
				this.scanAssetsImage();
				this.scanAssetsScript();
				this.scanAssetsText();
			})
			.then(() => this.scanAssetsAudio());
	}

	scanAssetsImage(): void {
		var files: string[] = readdirRecursive(path.join(this._basepath, "image/"));
		if (! this._content.assets)
			this._content.assets = {};
		var assets = this._content.assets;
		var revmap = cmn.Util.invertMap(assets, "path");
		files.filter(_isImageFilePath).forEach((f: string) => {
			var unixPath = cmn.Util.makeUnixPath("image/" + f);
			var size = imageSize(unixPath);
			var aidSet = revmap[unixPath];

			// If a declaration already exists for the file then just update the image size.
			if (aidSet && aidSet.length > 0) {
				aidSet.forEach((aid: string) => {
					var decl = assets[aid];
					_assertAssetFilenameValid(aid);
					_assertAssetTypeNoConflict(aid, f, "image", decl.type);
					if (decl.width !== size.width || decl.height !== size.height) {
						this._logger.info("Detected change of the image size for " + aid + " " + unixPath +
							" from " + decl.width + "x" + decl.height + " to " + size.width + "x" + size.height);
						decl.width = size.width;
						decl.height = size.height;
					}
				});
				return;
			}

			// Otherwise add a new declaration.
			var aid = path.basename(f, path.extname(f));
			_assertAssetFilenameValid(aid);
			_assertAssetNameNoConflict(assets, aid, f);

			this._logger.info("Added/updated the declaration for " + aid + " (" + unixPath + ")");
			assets[aid] = {
				type: "image",
				width: size.width,
				height: size.height,
				path: unixPath
			};
			revmap[assets[aid].path] = [aid];
		});
	}

	scanAssetsAudio(): Promise<void> {
		var files: string[] = readdirRecursive(path.join(this._basepath, "audio/")).filter(_isAudioFilePath);
		if (files.length === 0)
			return Promise.resolve();
		files = files.map((filepath: string) => path.join("audio", filepath));
		var assets = this._content.assets || (this._content.assets = {});
		var revmap = cmn.Util.invertMap(assets, "path");

		return Promise.resolve()
			.then(() => this._makeDurationMap(files, assets, revmap))
			.then((durationMap: DurationMap) => {
				for (var current in durationMap) {
					if (!durationMap.hasOwnProperty(current))
						continue;

					// If a declaration already exists for the file then just update the duration info.
					var aidSet = revmap[durationMap[current].path];
					if (aidSet && aidSet.length > 0) {
						aidSet.forEach((aid: string) => {
							if (assets[aid].duration !== durationMap[current].duration) {
								this._logger.info("Detected change of the audio duration for " + current + ": "
									+ assets[aid].path + " from " + assets[aid].duration + " to " + durationMap[current]);
								assets[aid].duration = durationMap[current].duration;
							}
						});
						continue;
					}

					// Otherwise add a new declaration.
					var f = durationMap[current].path;
					var aid = path.basename(f);
					_assertAssetFilenameValid(aid);
					_assertAssetNameNoConflict(assets, aid, f);

					this._logger.info("Added the declaration for '" + current + "' (" + durationMap[current].path + ")");
					assets[current] = {
						type: "audio",
						path: durationMap[current].path,  // Omit the extension for audio assets
						systemId: "sound",
						duration: durationMap[current].duration
					};
				}
			});
	}

	scanAssetsXXX(
		dir: string,
		filter: (value: string, index: number, array: string[]) => boolean,
		type: string
	): void {
		var files: string[] = readdirRecursive(dir);
		var assets = this._content.assets || (this._content.assets = {});
		var revmap = cmn.Util.invertMap(assets, "path");
		files.filter(filter).forEach((f: string) => {
			var unixPath = cmn.Util.makeUnixPath(path.relative(this._basepath, dir + f));
			var aidSet = revmap[unixPath];
			if (aidSet && aidSet.length > 0) {
				aidSet.forEach((aid: string) => {
					_assertAssetFilenameValid(aid);
					_assertAssetTypeNoConflict(aid, f, type, assets[aid].type);
				});
			} else {
				var aid = path.basename(f, path.extname(f));
				_assertAssetFilenameValid(aid);
				_assertAssetNameNoConflict(assets, aid, f);

				this._logger.info("Added the declaration for '" + aid + "' (" + unixPath + ")");
				assets[aid] = {
					type: type,
					path: unixPath
				};
				if (type === "script") {
					assets[aid].global = true;
				}
				revmap[assets[aid].path] = [aid];
			}
		});
	}

	scanAssetsScript(): void {
		this.scanAssetsXXX(path.join(this._basepath, "script/"), _isScriptAssetPath, "script");
	}

	scanAssetsText(): void {
		this.scanAssetsXXX(path.join(this._basepath, "text/"), _isTextAssetPath, "text");
	}

	scanGlobalScripts(): Promise<void> {
		return Promise.resolve()
			.then(() => this._fetchDependencyPackageNames())
			.then((dependencyNames) => {
				const listFiles = this._noOmitPackagejson ? cmn.NodeModules.listModuleFiles : cmn.NodeModules.listScriptFiles;
				return listFiles(this._basepath, dependencyNames, this._logger);
			})
			.then((filePaths: string[]) => {
				this._content.globalScripts = filePaths ? filePaths : [];
				return filePaths && filePaths.length !== 0 ? this.scanModuleMainScripts(filePaths) : Promise.resolve();
			});
	}

	scanModuleMainScripts(filePaths: string[]): Promise<void> {
		return Promise.resolve()
			.then(() => cmn.NodeModules.listPackageJsonsFromScriptsPath(this._basepath, filePaths))
			.then((packageJsonFiles) => cmn.NodeModules.listModuleMainScripts(packageJsonFiles))
			.then((moduleMainScripts) => {
				if (moduleMainScripts && Object.keys(moduleMainScripts).length > 0) {
					if (! this._content.moduleMainScripts) {
						this._logger.warn(
							"Newly added the moduleMainScripts property to game.json." +
							"This property, introduced by akashic-cli@>=1.12.2, is NOT supported by older versions of Akashic Engine." +
							"Please ensure that you are using akashic-engine@>=2.0.2, >=1.12.7."
						);
					}
					this._content.moduleMainScripts = Object.assign(this._content.moduleMainScripts || {}, moduleMainScripts);
				}
			});
	}

	scanGlobalScriptsFromEntryPoint(): Promise<void> {
		var entryPointPath = this._content.main || ("./" + path.join(this._basepath, this._content.assets["mainScene"].path));
		return Promise.resolve()
			.then(() => {
				const listFiles = this._noOmitPackagejson ? cmn.NodeModules.listModuleFiles : cmn.NodeModules.listScriptFiles;
				return listFiles(this._basepath, entryPointPath, this._logger);
			})
			.then((filePaths: string[]) => {
				this._content.globalScripts = filePaths ? filePaths : [];
				return filePaths && filePaths.length !== 0 ? this.scanModuleMainScripts(filePaths) : Promise.resolve();
			});
	}

	vacuumXXX(
		dir: string,
		type: string,
		pathFilter: (filepath: string) => boolean,
		pathMaker?: (filepath: string) => string
	): void {
		pathMaker = pathMaker || ((x: string) => x);
		var assets = this._content.assets;
		if (!assets) {
			return;
		}

		var relpath = path.relative(this._basepath, dir);
		var files: string[] = readdirRecursive(relpath);
		var revmap = cmn.Util.invertMap(assets, "path");
		var liveKeys: {[key: string]: boolean} = {};
		files.filter(pathFilter).map(pathMaker).forEach((f: string) => {
			var unixPath = cmn.Util.makeUnixPath(dir + f);
			(revmap[unixPath] || []).forEach((aid: string) => {
				liveKeys[aid] = true;
			});
		});

		var relUnixPath = cmn.Util.makeUnixPath(relpath);
		Object.keys(assets).forEach((k: string) => {
			if (assets[k].type === type && assets[k].path.indexOf(relUnixPath) === 0 && !liveKeys.hasOwnProperty(k)) {
				this._logger.info("Removed the declaration for '" + k + "' (" + assets[k].path + "). "
					+ "The correspondig files to the path are not found.");
				delete assets[k];
			}
		});
	}

	// アセットのうちでファイルが消えていた物を処理するためのメソッド
	vacuum(): void {
		function audioPathMaker(f: string): string {
			return path.join(path.dirname(f), path.basename(f, path.extname(f)));  // remove the extension
		}
		this.vacuumXXX("audio/", "audio", _isAudioFilePath, audioPathMaker);
		this.vacuumXXX("image/", "image", _isImageFilePath);
		this.vacuumXXX("script/", "script", _isScriptAssetPath);
		this.vacuumXXX("text/", "text", _isTextAssetPath);
	}

	/**
	 * Promise.all() の逐次実行版。
	 * 本来的には all を使うべきだが、テストの都合上 fs を利用する処理の場合はこれを使う。
	 * (fsをmockしてtestする際、fsに触るPromiseを単純にallすると、失敗時に即座にfsがrestoreされてしまいテストがクラッシュする)
	 */
	_promiseSequence<T>(ps: Promise<T>[]): Promise<T[]> {
		var ret: T[] = [];
		var ps2 = ps.map((p: Promise<T>) => p.then<void>((r: T) => void ret.push(r)));
		var seq = ps2.reduce(((cur: Promise<void>, next: Promise<void>) => cur.then<void>(() => next)), Promise.resolve<void>(null));
		return seq.then<T[]>(() => new Promise<T[]>((resolve: (result: T[]) => void, reject: (err: any) => void) => {
			resolve(ret);
		}));
	}

	private _getDurationInfo(filepath: string, assets: cmn.Assets, assetsRevmap: { [key: string]: string[] }): Promise<DurationInfo> {
		var ext = path.extname(filepath);
		var basename = path.basename(filepath, ext);
		var noextUnixPath = cmn.Util.makeUnixPath(path.join(path.dirname(filepath), basename));

		var aidSet = assetsRevmap[noextUnixPath] || [];
		return Promise.resolve()
			.then(() => {
				aidSet.forEach((aid: string) => {
					_assertAssetFilenameValid(aid);
					_assertAssetTypeNoConflict(aid, filepath, "audio", assets[aid].type);
				});
			})
			.then(() => getAudioDuration(path.join(this._basepath, filepath), this._logger))
			.then((duration: number) => {
				return {
					basename: basename,
					ext: ext,
					duration: Math.ceil(duration * 1000),
					path: noextUnixPath
				};
			});
	}

	private _makeDurationMap(filepaths: string[], assets: cmn.Assets, assetsRevmap: { [key: string]: string[] }): Promise<DurationMap> {
		var promisesDurationInfo = filepaths.map((p) => this._getDurationInfo(p, assets, assetsRevmap));

		return this._promiseSequence<DurationInfo>(promisesDurationInfo).then((durationInfoSet: DurationInfo[]) => {
			// お節介機能: 拡張子が違うだけの音声ファイル間で、500ms以上長さが違ったら警告しておく。
			// (別のファイルがまぎれているかもしれない) お節介なので数値に深い意味はない。
			var durationRevMap = cmn.Util.invertMap(<any>durationInfoSet, "path");
			for (var noextUnixPath in durationRevMap) {
				if (!durationRevMap.hasOwnProperty(noextUnixPath)) continue;
				var keys = durationRevMap[noextUnixPath];
				var durations = keys.map((k: string) => durationInfoSet[Number(k)].duration);
				var durationDiff = Math.max.apply(Math, durations) - Math.min.apply(Math, durations);
				if (durationDiff > 500)
					this._logger.warn("Detected different durations between files prefixed with " + noextUnixPath + ".");
			}

			var result: DurationMap = {};
			durationInfoSet.forEach((durationInfo) => {
				if (durationInfo.ext === ".ogg" || !result[durationInfo.basename]) {
					result[durationInfo.basename] = durationInfo;
				}
			});
			return result;
		});
	}

	private _fetchDependencyPackageNames(): Promise<string[]> {
		return Promise.resolve()
			.then(() => this._npm.ls(true))
			// lsResultオブジェクトは、package.jsonのdependenciesに書かれたモジュールと、それらの各依存モジュールをツリー構造で表したオブジェクトである。
			// これらのうち、dependenciesに直接書かれていない依存モジュールのファイルパスは、依存モジュールのバージョン・インストール順序によって不定である。
			// よって、依存モジュールのファイルパスを解決する方法として、node_modules/直下にあるモジュール名（つまりpackage.jsonのdependenciesに書かれたモジュール）のみをcmn.NodeModules.listModuleFilesに渡す。
			// これにより、requireチェーンによって依存モジュールのファイルパスが解決される。
			.then((lsResult: cmn.NpmLsResultObject) => {
				lsResult.dependencies = lsResult.dependencies || {};
				return Object.keys(lsResult.dependencies);
			});
	}
}
