interface WindowForTestbedScriptAsset extends Window {
	gScriptContainer: {[key: string]: Function};
}

/**
 * namespace gが参照できないので、g.AssetLoadHandlerと同様の定義を行う
 * interface内でnamespace g内のモジュールが指定されているものはanyに変換している
 */
interface AssetLoadHandler {
	_onAssetError(asset: any, error: any): void;
	_onAssetLoad(asset: any): void;
}

/**
 * namespace gが参照できないので、g.ScriptAssetExecuteEnvironmentと同様の定義を行う
 * interface内でnamespace g内のモジュールが指定されているものはanyに変換している
 */
interface ScriptAssetExecuteEnvironment {
	game: any;
	exports: any;
	dirname: string;
	filename: string;
	module: any;
}

declare const window: WindowForTestbedScriptAsset;

type Constructor<T> = new(...args: any[]) => T;

/**
 * 以下のような問題があるのでTestbedScriptAssetクラスを実行時に生成する作りにした
 * ・agvがakashic-engineのgをengineFilesから参照しているため、コンパイル時にgを参照できない
 * ・@akashic/akashic-engineをinstallしてコンパイルできても、実行時に利用されるgが異なるのでTestbedScriptAssetはg.ScriptAssetの派生クラスとして認識されない
 */
export const generateTestbedScriptAsset = <T extends Constructor<{}>>(Class: T) => {
	return class TestbedScriptAsset extends Class {
		loading: boolean;
		script: string;
		path: string;
		id: string;
		_createAssetLoadError: () => any;

		/**
		 * 自作のconstructor-functionを利用する場合、現状のtypescriptではシグニチャとしてany配列しか利用できない
		 * 引数には次のものを指定することとする
		 * @param args[0] string アセットのID
		 * @param args[1] string アセットのpath
		 * @param args[2] () => g.AssetLoadError アセット読み込みエラー時のエラーハンドリングを返す関数
		 */
		constructor(...args: any[]) {
			super(args[0], args[1]);
			const heads = document.getElementsByTagName("head");
			const container: Node = (heads.length === 0) ? document.body : heads[0];

			const script = <HTMLScriptElement>document.createElement("script");
			script.onload = () => {
				this.script = script.text; // TODO: スクリプト取れないので取れるようにする
				this.loading = false;
			};
			script.onerror = () => {
				this.loading = false;
			};
			this.script = undefined;
			this.loading = true;
			this._createAssetLoadError = args[2];
			script.src = this.path;
			container.appendChild(script);
		}

		_load(loader: AssetLoadHandler): void {
			const waitLoader = () => {
				if (this.loading) {
					setTimeout(waitLoader, 100);
					return;
				}
				if (this.script !== undefined) {
					loader._onAssetLoad(this as any);
				} else {
					loader._onAssetError(this as any, this._createAssetLoadError());
				}
			};
			setTimeout(waitLoader, this.loading ? 100 : 0);
		}

		execute(execEnv: ScriptAssetExecuteEnvironment): any {
			// クライアント側でゲームコンテンツを一つしか実行しない前提なのでscriptIDをキーにしている
			// TODO: ゲームコンテンツを複数起動する場合のキーを考える
			window.gScriptContainer[this.id](execEnv);
			return execEnv.module.exports;
		}
	};
};
