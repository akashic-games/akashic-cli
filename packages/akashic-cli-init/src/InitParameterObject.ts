import * as os from "os";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import * as config from "@akashic/akashic-cli-extra/lib/config";

export type GitProtocol = "https" | "ssh";

export interface InitParameterObject {
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

	/**
	 * ユーザー入力無しでプロジェクトの作成を行うかどうか
	 */
	skipAsk?: boolean;

	/**
	 * git コマンドのパス。
	 */
	 gitBinPath?: string;

	/**
	 * GitHub のホスト。
	 * 省略された場合 `github.com` 。
	 */
	githubHost?: string;

	/**
	 * GitHub からクローンする際のプロトコル。
	 * 省略された場合 `https` 。
	 */
	githubProtocol?: GitProtocol;

	/**
	 * GitHub Enterprise のホスト。
	 * 省略された場合 `undefined` 。
	 */
	gheHost?: string;

	/**
	 * GitHub Enterprise からクローンする際のプロトコル。
	 * 省略された場合 `https` 。
	 */
	gheProtocol?: GitProtocol;
}

const templateConfigValidator: config.StringMap = {
	"init.repository": "",
	"init.localTemplateDirectory": "",
	"init.defaultTemplateType": "",
	"init.github.host": "",
	"init.github.protocol": "",
	"init.ghe.host": "",
	"init.ghe.protocol": ""
};

/**
 * 未代入のパラメータを補完する
 */
export async function completeInitParameterObject(param: InitParameterObject): Promise<void> {
	const logger = param.logger || new ConsoleLogger();
	const configFile = param.configFile || new config.AkashicConfigFile(templateConfigValidator);
	const cwd = param.cwd || process.cwd();
	const templateListJsonPath = param.templateListJsonPath || "template-list.json";
	const gitBinPath = param.gitBinPath || process.env.GIT_BIN_PATH || "git";

	await configFile.load();
	const repository = await _complete(param.repository, configFile.getItem("init.repository"), "");
	const localTemplateDirectory = await _complete(
		param.localTemplateDirectory,
		configFile.getItem("init.localTemplateDirectory"),
		path.join(os.homedir(), ".akashic-templates")
	);
	const defaultType = await _complete(param.type, configFile.getItem("init.defaultTemplateType"), "javascript");
	const githubHost = await _complete(param.githubHost, configFile.getItem("init.github.host"), "github.com");
	const githubProtocol = await _complete(param.githubProtocol, configFile.getItem("init.github.protocol"), "https");
	const gheHost = await _complete(param.gheHost, configFile.getItem("init.ghe.host"), undefined);
	const gheProtocol = await _complete(param.gheProtocol, configFile.getItem("init.ghe.protocol"), "https");

	param.logger = logger;
	param.configFile = configFile;
	param.cwd = cwd;
	param.templateListJsonPath = templateListJsonPath;
	param.gitBinPath = gitBinPath;
	param.repository = repository;
	param.localTemplateDirectory = localTemplateDirectory;
	param.type = defaultType.toLowerCase();
	param.githubHost = githubHost;
	param.githubProtocol =githubProtocol as GitProtocol;
	param.gheHost = gheHost;
	param.gheProtocol = gheProtocol as GitProtocol;
}

async function _complete<T>(val: T | undefined, altVal: Promise<T | undefined>, defaultVal: T): Promise<T> {
	if (val != null) {
		return val;
	} else {
		const resolved = await altVal;
		if (resolved != null) {
			return resolved;
		} else {
			return defaultVal;
		}
	}
}
