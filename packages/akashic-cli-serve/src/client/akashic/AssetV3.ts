import * as types from "@akashic/pdi-types";
import { Trigger } from "@akashic/trigger";

export abstract class AssetV3 implements types.Asset {
	type: string;
	id: string;
	path: string;
	originalPath: string;
	onDestroyed: Trigger<types.Asset>;

	constructor(id: string, path: string) {
		this.id = id;
		this.originalPath = path;
		this.path = this._assetPathFilter(path);
		this.onDestroyed = new Trigger<types.Asset>();
	}

	destroy(): void {
		this.onDestroyed.fire(this);
		this.id = undefined;
		this.originalPath = undefined;
		this.path = undefined;
		this.onDestroyed.destroy();
		this.onDestroyed = undefined;
	}

	destroyed(): boolean {
		return this.id === undefined;
	}

	inUse(): boolean {
		return false;
	}

	abstract _load(loader: types.AssetLoadHandler): void;

	_assetPathFilter(path: string): string {
		// 拡張子の補完・読み替えが必要なassetはこれをオーバーライドすればよい。(対応形式が限定されるaudioなどの場合)
		return path;
	}
}

export class NullScriptAssetV3 extends AssetV3 implements types.ScriptAsset {
	type: "script" =  "script"; // 型指定のみの場合ビルド後に情報が消えてしまうので明示的に値を代入する
	script: string;
    execute(_execEnv: types.ScriptAssetRuntimeValue): any {
		//
	}
	_load(_loader: types.AssetLoadHandler): void {
		//
	}
}
