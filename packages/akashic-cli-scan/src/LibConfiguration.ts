import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { AssetConfiguration } from "@akashic/akashic-cli-commons/lib/GameConfiguration";
import * as cmnlibconf from "@akashic/akashic-cli-commons/lib/LibConfiguration";
import { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import { scanAudioAssets, scanImageAssets } from "./scanUtils";

export interface LibConfigurationParameterObject {
	content: cmnlibconf.LibConfiguration;
	basepath: string;
	logger?: Logger;
}

export class LibConfiguration {
	_content: cmnlibconf.LibConfiguration;
	_basepath: string;
	_logger: Logger;

	constructor(param: LibConfigurationParameterObject) {
		this._content = param.content;
		this._basepath = param.basepath;
		this._logger = param.logger || new ConsoleLogger();
	}

	getContent(): cmnlibconf.LibConfiguration {
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

	addAsset(asset: AssetConfiguration): this {
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
