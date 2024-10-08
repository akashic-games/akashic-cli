// 本来であればv3系のg.ScriptAssetをimplementsすべきだが、ビルド時に使用しているakashic-engineはv2系なので一からクラス定義している
export class SandboxScriptAssetV3 {
	type: string = "script";
	script: string;
	id: string;
	path: string;
	originalPath: string;
	onDestroyed: Trigger<Asset>;
	loading: boolean;
	exports: string[];

	constructor(id: string, path: string, exports: string[] = []) {
		this.id = id;
		this.originalPath = path;
		this.exports = exports;
		this.path = this._assetPathFilter(path);
		this.onDestroyed = new g.Trigger<Asset>();
		// いきなり読んじゃう
		const heads = document.getElementsByTagName("head");
		const container: Node = (heads.length === 0) ? document.body : heads[0];

		const script = <HTMLScriptElement>document.createElement("script");
		script.onload = () => {
			this.script = script.text; // TODO: とれない・・
			this.loading = false;
		};
		script.onerror = () => {
			this.loading = false;
		};
		this.script = undefined;
		this.loading = true;
		script.src = this.path;
		container.appendChild(script);
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
		window.gScriptContainer[this.path](execEnv);
		return execEnv.module.exports;
	}

	_load(loader: AssetLoadHandler): void {
		const waitLoader = (): void => {
			if (this.loading) {
				setTimeout(waitLoader, 100);
				return;
			}
			if (this.script !== undefined) {
				loader._onAssetLoad(this);
			} else {
				loader._onAssetError(this, g.ExceptionFactory.createAssetLoadError("can not load script"));
			}
		};
		setTimeout(waitLoader, this.loading ? 100 : 0);
	}

	/**
	 * @private
	 */
	_assetPathFilter(path: string): string {
		// 拡張子の補完・読み替えが必要なassetはこれをオーバーライドすればよい。(対応形式が限定されるaudioなどの場合)
		return path;
	}
}
