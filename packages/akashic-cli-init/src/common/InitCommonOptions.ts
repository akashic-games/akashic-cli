import * as os from "os";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import * as config from "@akashic/akashic-cli-extra/lib/config";

export interface InitCommonOptions {
	/**
	 * コマンドの出力を受け取るロガー。
	 * 省略された場合、akashic-cli-commons の `new ConsoleLogger()` 。
	 */
	logger?: Logger;

	/**
	 * 利用する設定ファイル
	 * 省略された場合、`akashic-config` のデフォルトディレクトリから読み込む。
	 */
	configFile?: config.AkashicConfigFile;

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
}

export type NormalizedInitCommonOptions = Required<InitCommonOptions>;

const initConfigValidator: config.StringMap = {
	"init.repository": "",
	"init.localTemplateDirectory": "",
	"init.defaultTemplateType": "",
	"init.github.host": "",
	"init.github.protocol": "",
	"init.ghe.host": "",
	"init.ghe.protocol": ""
};

export const DEFAULT_TEMPLATE_REPOSITORY = "https://akashic-contents.github.io/templates/";

/**
 * 未代入のパラメータを補完する。
 * 戻り値の .configFile は .load() が呼ばれた状態で返される点に注意。
 */
export async function completeInitCommonOptions(opts: InitCommonOptions): Promise<NormalizedInitCommonOptions> {
	const logger = opts.logger || new ConsoleLogger();
	const configFile = opts.configFile || new config.AkashicConfigFile(initConfigValidator);
	const templateListJsonPath = opts.templateListJsonPath || "template-list.json";

	await configFile.load();
	const repository = opts.repository ?? (await configFile.getItem("init.repository")) ?? DEFAULT_TEMPLATE_REPOSITORY;
	const localTemplateDirectory =
		opts.localTemplateDirectory ??
		await configFile.getItem("init.localTemplateDirectory") ??
		path.join(os.homedir(), ".akashic-templates");

	return {
		logger,
		configFile,
		templateListJsonPath,
		repository,
		localTemplateDirectory,
	};
}

