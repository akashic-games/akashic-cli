import type * as pdi from "@akashic/pdi-types";

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
export const generateTestbedScriptAsset = <T extends Constructor<pdi.ScriptAsset>>(Class: T): any => {
	return class TestbedScriptAsset extends Class {
		loading: boolean;
		_createAssetLoadError: () => any;

		/**
		 * 自作のconstructor-functionを利用する場合、現状のtypescriptではシグニチャとしてany配列しか利用できない
		 * 引数には次のものを指定することとする
		 * @param args[0] script アセットの ID
		 * @param args[1] script アセットの path
		 * @param args[2] script アセットの exports
		 * @param args[3] () => g.AssetLoadError アセット読み込みエラー時のエラーハンドリングを返す関数
		 */
		constructor(...args: any[]) {
			super(args[0], args[1], args[2]);
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
			this.script = undefined!;
			this.loading = true;
			this._createAssetLoadError = args[3];
			script.src = this.path;
			container.appendChild(script);
		}

		_load(loader: AssetLoadHandler): void {
			const waitLoader = (): void => {
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
			const key = (new URL(this.path)).pathname;
			window.gScriptContainer[key](execEnv);
			return execEnv.module.exports;
		}
	};
};
