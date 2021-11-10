import * as os from "os";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import * as config from "@akashic/akashic-cli-extra/lib/config";
import { initConfigValidator } from "../common/initConfigValidator";

export interface ListTemplatesParameterObject {
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

export type NormalizedListTemplatesParameterObject = Required<ListTemplatesParameterObject>;

/**
 * 未代入のパラメータを補完する
 */
export async function completeListTemplatesParamterObject(
	param: ListTemplatesParameterObject
): Promise<NormalizedListTemplatesParameterObject> {
	const logger = param.logger || new ConsoleLogger();
	const configFile = param.configFile || new config.AkashicConfigFile(initConfigValidator);
	const templateListJsonPath = param.templateListJsonPath || "template-list.json";

	await configFile.load();
	const repository = param.repository ?? (await configFile.getItem("init.repository")) ?? "";
	const localTemplateDirectory =
		param.localTemplateDirectory ??
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
