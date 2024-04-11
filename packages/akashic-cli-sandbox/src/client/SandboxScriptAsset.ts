// Windowオブジェクトの定義のため、未使用の lint エラーを抑止
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
	gScriptContainer: {[key: string]: Function};
}

// ビルド時はnode_modules下のakashic-engineモジュールのgを参照しているが、実際に利用するgはjs下のengineFilesV*_*_*.jsのものなので、本来なら実行時に参照するgを動的に決定できるようにすべき
// game.ejs で参照されるため、未使用の lint エラーを抑止
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SandboxScriptAsset extends g.ScriptAsset {
	loading: boolean;
	script: string;
	path: string;
	id: string;
	constructor(id: string, path: string) {
		super(id, path);
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

	_load(loader: g.AssetLoadHandler): void {
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

	execute(execEnv: g.ScriptAssetExecuteEnvironment): any {
		window.gScriptContainer[this.path](execEnv);
		return execEnv.module.exports;
	}
}
