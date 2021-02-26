interface Window {
		gLocalAssetContainer: {[key: string]: any};
	}

class LocalScriptAsset extends g.ScriptAsset {
	func: Function;

	constructor(id: string, path: string) {
		super(id, path);
		this.func = window.gLocalAssetContainer[id]; // gLocalScriptContainer は index.ect 上のscriptタグ内で宣言されている 
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

	execute(execEnv: g.ScriptAssetExecuteEnvironment): any {
		this.func(execEnv);
		return execEnv.module.exports;
	}
}
