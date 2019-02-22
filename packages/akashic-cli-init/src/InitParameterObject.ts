import * as commons from "@akashic/akashic-cli-commons";
import * as config from "@akashic/akashic-cli-config";
import * as os from "os";
import * as path from "path";

export interface InitParameterObject {
	/**
	 * コマンドの出力を受け取るロガー。
	 * 省略された場合、akashic-cli-commons の `new ConsoleLogger()` 。
	 */
	logger?: commons.Logger;

	/**
	 * 利用する設定ファイル
	 * 省略された場合、`akashic-config` のデフォルトディレクトリから読み込む。
	 */
	configFile?: config.AkashicConfigFile;

	/**
	 * 作業ディレクトリ。
	 * 省略された場合、 `process.cwd()` 。
	 */
	cwd?: string;

	/**
	 * 出力するテンプレートの種別。大文字小文字は区別されない。
	 * 省略された場合、`akashic-config` の設定値を利用。
	 */
	type?: string;

	/**
	 * テンプレートをダウンロード可能なサーバURL。
	 * 省略された場合、`akashic-config` の設定値を利用。
	 */
	repository?: string;

	/**
	 * サーバ上でテンプレート一覧を保持するJSONのパス。
	 * 省略された場合、 "template-list.json" を利用。
	 */
	templateListJsonPath?: string;

	/**
	 * ローカルファイルシステムでテンプレートを保存している場所。
	 * 省略された場合、`akashic-config` の設定値を利用。
	 */
	localTemplateDirectory?: string;

	/**
	 * 利用すべきテンプレートの実体を指すパスを保存している場所。
	 * この値はコマンド外部から指定できず、指定された場合、その値は破棄される。
	 */
	_realTemplateDirectory?: string;

	/**
	 * コピー先に既にファイルが存在していてもコピーするかどうか
	 */
	forceCopy?: boolean;
}

const templateConfigValidator: config.StringMap = {
	"init.repository": "",
	"init.localTemplateDirectory": "",
	"init.defaultTemplateType": ""
};

/**
 * 未代入のパラメータを補完する
 */
export function completeInitParameterObject(param: InitParameterObject): Promise<void> {
	param.logger = param.logger || new commons.ConsoleLogger();
	param.configFile = param.configFile || new config.AkashicConfigFile(templateConfigValidator);
	param.cwd = param.cwd || process.cwd();
	param.templateListJsonPath = param.templateListJsonPath || "template-list.json";
	return Promise.resolve()
		.then(() => param.configFile.load())
		.then(() => param.configFile.getItem("init.repository"))
		.then(repository => {
			param.repository = param.repository || repository || "";
			return param.configFile.getItem("init.localTemplateDirectory");
		})
		.then(directory => {
			param.localTemplateDirectory =
				param.localTemplateDirectory ||
				directory ||
				path.join(os.homedir(), ".akashic-templates");
			return param.configFile.getItem("init.defaultTemplateType");
		})
		.then<void>(defaultType => {
			param.type = (param.type || defaultType || "javascript").toLowerCase();
			// 以下の正規表現は、akashic-configのvalidatorとそろえる必要があります。
			if (!/^[\w\-]+$/.test(param.type))
				return Promise.reject(new Error("invalid template type name"));
			return Promise.resolve();
		});
}
