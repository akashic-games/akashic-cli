import type * as akashicEngine from "@akashic/akashic-engine";
declare var g: typeof akashicEngine;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class LocalTextAsset extends g.TextAsset {
	data: string;

	constructor(id: string, path: string) {
		super(id, path);
		this.data = decodeURIComponent(window.gLocalAssetContainer[id]);
	}

	_load(loader: akashicEngine.AssetLoadHandler): void {
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
