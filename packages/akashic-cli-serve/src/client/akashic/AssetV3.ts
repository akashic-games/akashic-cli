import type * as pdi from "@akashic/pdi-types";
import { Trigger } from "@akashic/trigger";

export abstract class AssetV3 implements pdi.Asset {
	type!: string;
	id: string;
	path: string;
	originalPath: string;
	onDestroyed: Trigger<pdi.Asset>;

	constructor(id: string, path: string) {
		this.id = id;
		this.originalPath = path;
		this.path = this._assetPathFilter(path);
		this.onDestroyed = new Trigger<pdi.Asset>();
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

	abstract _load(loader: pdi.AssetLoadHandler): void;

	_assetPathFilter(path: string): string {
		// 拡張子の補完・読み替えが必要なassetはこれをオーバーライドすればよい。(対応形式が限定されるaudioなどの場合)
		return path;
	}
}

export class NullScriptAssetV3 extends AssetV3 implements pdi.ScriptAsset {
	type: "script" = "script";
	script!: string;
	execute(_execEnv: pdi.ScriptAssetRuntimeValue): any {
		//
	}
	_load(_loader: pdi.AssetLoadHandler): void {
		//
	}
}
