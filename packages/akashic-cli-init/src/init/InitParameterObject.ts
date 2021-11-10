import { InitCommonOptions, completeInitCommonOptions } from "../common/InitCommonOptions";

export type GitProtocol = "https" | "ssh";

export interface InitParameterObject extends InitCommonOptions {
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
	 * 省略された場合 `null` 。
	 */
	gheHost?: string | null;

	/**
	 * GitHub Enterprise からクローンする際のプロトコル。
	 * 省略された場合 `https` 。
	 */
	gheProtocol?: GitProtocol;
}

export type NormalizedInitParameterObject = Required<InitParameterObject>;

/**
 * 未代入のパラメータを補完する
 */
export async function completeInitParameterObject(param: InitParameterObject): Promise<NormalizedInitParameterObject> {
	const {
		logger,
		configFile,
		repository,
		templateListJsonPath,
		localTemplateDirectory
	} = await completeInitCommonOptions(param);

	const cwd = param.cwd || process.cwd();
	const gitBinPath = param.gitBinPath || process.env.GIT_BIN_PATH || "git";

	const type = await _complete(param.type, configFile.getItem("init.defaultTemplateType"), "javascript");
	const githubHost = await _complete(param.githubHost, configFile.getItem("init.github.host"), "github.com");
	const githubProtocol = await _complete(param.githubProtocol, configFile.getItem("init.github.protocol"), "https");
	const gheHost = await _complete(param.gheHost, configFile.getItem("init.ghe.host"), null);
	const gheProtocol = await _complete(param.gheProtocol, configFile.getItem("init.ghe.protocol"), "https");

	if (!isGitProtocol(githubProtocol))
		throw new Error(`invalid option githubProtocol: ${githubProtocol}`);
	if (!isGitProtocol(gheProtocol))
		throw new Error(`invalid option gheProtocol: ${gheProtocol}`);

	return {
		logger,
		configFile,
		cwd,
		templateListJsonPath,
		gitBinPath,
		repository,
		localTemplateDirectory,
		forceCopy: !!param.forceCopy,
		skipAsk: !!param.skipAsk,
		type: type.toLowerCase(),
		githubHost,
		githubProtocol,
		gheHost,
		gheProtocol
	};
}

function isGitProtocol(s: string): s is GitProtocol {
	return s === "https" || s === "ssh";
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
