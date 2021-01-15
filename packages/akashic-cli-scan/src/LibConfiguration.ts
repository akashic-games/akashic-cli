import * as cmn from "@akashic/akashic-cli-commons";
import { scanAudioAssets, scanImageAssets } from "./scanUtils";

export interface LibConfigurationParameterObject {
	content: cmn.LibConfiguration;
	basepath: string;
	logger?: cmn.Logger;
}

export class LibConfiguration {
	_content: cmn.LibConfiguration;
	_basepath: string;
	_logger: cmn.Logger;

	constructor(param: LibConfigurationParameterObject) {
		this._content = param.content;
		this._basepath = param.basepath;
		this._logger = param.logger || new cmn.ConsoleLogger();
	}

	getContent(): cmn.LibConfiguration {
		return this._content;
	}

	/**
	 * 対象のディレクトリに存在するすべてのアセットをスキャンし assetList に追加する。
	 * 現状は以下の種別のみに対応。
	 * * image
	 * * audio
	 * @param dirs アセットをスキャンする対象のディレクトリ
	 */
	async scanAssets(dirs: string[]): Promise<this> {
		await this.scanImageAssets(dirs);
		await this.scanAudioAssets(dirs);
		return this;
	}

	async scanImageAssets(dirs: string[]): Promise<this> {
		this.clearImageAssets();
		for (const dir of dirs) {
			const assets = await scanImageAssets(this._basepath, dir, this._logger);
			for (const asset of assets) {
				this.addAsset(asset);
			}
		}
		return this;
	}

	async scanAudioAssets(dirs: string[]): Promise<this> {
		this.clearAudioAssets();
		for (const dir of dirs) {
			const assets = await scanAudioAssets(this._basepath, dir, this._logger);
			for (const asset of assets) {
				this.addAsset(asset);
			}
		}
		return this;
	}

	clearAllAssets(): this {
		delete this._content.assetList;
		return this;
	}

	clearImageAssets(): this {
		if (!this._content.assetList) return this;
		this._content.assetList = this._content.assetList.filter(a => a.type !== "image");
		if (!this._content.assetList.length) {
			delete this._content.assetList;
		}
		return this;
	}

	clearAudioAssets(): this {
		if (!this._content.assetList) return this;
		this._content.assetList = this._content.assetList.filter(a => a.type !== "audio");
		if (!this._content.assetList.length) {
			delete this._content.assetList;
		}
		return this;
	}

	addAsset(asset: cmn.AssetConfiguration): this {
		if (!this._content.assetList) {
			this._content.assetList = [];
		}
		if (this._content.assetList.some(a => a.path === asset.path)) {
			return this;
		}
		this._content.assetList.push(asset);
		return this;
	}

	removeAssetByPath(assetPath: string): this {
		if (!this._content.assetList) return this;
		this._content.assetList = this._content.assetList.filter(asset => asset.path !== assetPath);
		if (!this._content.assetList.length) {
			delete this._content.assetList;
		}
		return this;
	}

	sortAssets(): this {
		if (!this._content.assetList) return this;
		this._content.assetList.sort((a, b) => {
			if (a.path < b.path) {
				return -1;
			} else if (a.path > b.path) {
				return 1;
			}
			return 0;
		});
		return this;
	}
}
