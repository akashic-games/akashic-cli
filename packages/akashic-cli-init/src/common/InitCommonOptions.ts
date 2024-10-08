import * as os from "os";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger.js";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger.js";
import * as config from "@akashic/akashic-cli-extra/lib/config/config.js";
import Prompt from "prompt";

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

const DEFAULT_TEMPLATE_REPOSITORY = "https://akashic-contents.github.io/templates/";

/**
 * 未代入のパラメータを補完する。
 * 戻り値の .configFile は .load() が呼ばれた状態で返される点に注意。
 */
export async function completeInitCommonOptions(opts: InitCommonOptions): Promise<NormalizedInitCommonOptions> {
	const logger = opts.logger || new ConsoleLogger();
	await validateRepositoryValue(logger, opts.repository);

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

async function validateRepositoryValue(logger: Logger, repository: string | undefined): Promise<void> {
	if (repository) {
		if (/(^(github|ghe):)|(\.git$)/.test(repository)) {
			logger.warn("Misused -r, --repository options. Use -t option for Github repository");
		}

		if (repository !== DEFAULT_TEMPLATE_REPOSITORY) {
			const accepted = await confirmAccessToUrl(repository);
			if (!accepted) process.exit(1);
		}
	}
}

export async function confirmAccessToUrl(url: string): Promise<boolean> {
	const akashicConfigFile = new config.AkashicConfigFile(KNOWN_URL_VALIDATOR);
	const exists = await existsKnownUrl(url, akashicConfigFile);
	if (exists) return true;

	return new Promise<boolean>((resolve: (result: boolean) => void, reject: (err: any) => void) => {
		const schema = {
			properties: {
				confirm: {
					pattern: /^(yes|no|y|n)$/gi,
					description: `Attempting to connect to ${url}\n`
						+ "The template obtained here may cause arbitrary command execution"
						+ "(not by this command but by using the template).\n"
						+ "You should not use this URL unless you trust its owners and contents.\n"
						+ "Do you trust the owners and contents of this URL? (y/N)",
					required: true,
					default: "n"
				}
			}
		};
		Prompt.start();
		Prompt.get(schema, async (err: any, result: any) => {
			const value = result.confirm.toLowerCase();
			const ret = value === "y" || value === "yes";
			if (err) {
				reject(err);
			} else {
				if (ret) await saveKnownUrlToAkashicConfig(url, akashicConfigFile);
				resolve(ret);
			}
		});
	});
}

const MAX_NUM_KNOWN_URL = 4;
const KNOWN_URL_VALIDATOR = {
	"cache.initKnownUrl": ""
};

/**
 * アクセス対象の URL が .akashicrc に存在するかどうか。
 */
async function existsKnownUrl(url: string, configFile: config.AkashicConfigFile): Promise<boolean> {
	await configFile.load();
	const itemValue = await configFile.getItem("cache.initKnownUrl");
	const itemArray = itemValue ? JSON.parse(itemValue) : [];
	return itemArray.includes(url);
}

/**
 * アクセス許可した URL を .akashicrc へ保存する。
 */
async function saveKnownUrlToAkashicConfig(url: string, configFile: config.AkashicConfigFile): Promise<void> {
	await configFile.load();
	const itemValue = await configFile.getItem("cache.initKnownUrl");
	const itemArray = itemValue ? JSON.parse(itemValue) : [];

	if (!itemArray.includes(url)) {
		if (itemArray.length >= MAX_NUM_KNOWN_URL) itemArray.shift();
		itemArray.push(url);

		const items = JSON.stringify(itemArray);
		await configFile.setItem("cache.initKnownUrl", items);
		await configFile.save();
	}
}
