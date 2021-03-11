class LocalTextAsset extends g.TextAsset {
	data: string;

	constructor(id: string, path: string) {
		super(id, path);
		this.data = decodeURIComponent(window.gLocalAssetContainer[id]);
	}

	_load(loader: g.AssetLoadHandler): void {
		if (this.data !== undefined) {
			setTimeout(() => {
				loader._onAssetLoad(this);
			}, 0);
		} else {
			setTimeout(() => {
				loader._onAssetError(this, g.ExceptionFactory.createAssetLoadError("can not load text asset"));
			}, 0);
		}
	}
}
