interface Window {
	gScriptContainer: {[key: string]: Function};
}

// 本来であればv3系のg.ScriptAssetをimplementsすべきだが、ビルド時に使用しているakashic-engineはv2系なので一からクラス定義している
class LocalScriptAssetV3 {
	type: string = "script";
	script: string;
	id: string;
	path: string;
	originalPath: string;
	onDestroyed: g.Trigger<g.Asset>;
	func: Function;

	constructor(id: string, path: string) {
		this.id = id;
		this.originalPath = path;
		this.path = this._assetPathFilter(path);
		this.onDestroyed = new g.Trigger<g.Asset>();
		this.func = window.gLocalAssetContainer[id]; // gLocalScriptContainer は index.ect 上のscriptタグ内で宣言されている 
	}

	destroy(): void {
		this.onDestroyed.fire(this);
		this.id = undefined!;
		this.originalPath = undefined!;
		this.path = undefined!;
		this.onDestroyed.destroy();
		this.onDestroyed = undefined!;
	}

	destroyed(): boolean {
		return this.id === undefined;
	}

	inUse(): boolean {
		return false;
	}

	// 引数の型はg.ScriptAssetRuntimeValueだが、v2系には無いものなのでanyを指定している
	execute(execEnv: any): any {
		this.func(execEnv);
		return execEnv.module.exports;
	}

	_load(loader: g.AssetLoadHandler): void {
		if (this.func !== undefined) {
			setTimeout(() => {
				loader._onAssetLoad(this);
			}, 0);
		} else {
			setTimeout(() => {
				loader._onAssetError(this, g.ExceptionFactory.createAssetLoadError("can not load script asset"));
			}, 0);
		}
	}

	/**
	 * @private
	 */
	_assetPathFilter(path: string): string {
		// 拡張子の補完・読み替えが必要なassetはこれをオーバーライドすればよい。(対応形式が限定されるaudioなどの場合)
		return path;
	}
}
