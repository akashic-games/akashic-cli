import type { InitCommonOptions} from "../common/InitCommonOptions";
import { completeInitCommonOptions, confirmAccessToUrl } from "../common/InitCommonOptions";
import { createGitUri, parseCloneTargetInfo } from "./cloneTemplate";

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
	if (!type)
		throw new Error(`invalid option type: ${type}`);
	if (!githubHost)
		throw new Error(`invalid option githubHost: ${githubHost}`);

	const { gitType, owner, repo } = parseCloneTargetInfo(type);
	if (gitType === "github" && owner !== "akashic-games" ) {
		const url = createGitUri(githubHost, githubProtocol, owner, repo);
		const accepted = await confirmAccessToUrl(url);
		if (!accepted) process.exit(1);

	} else if (gitType === "ghe") {
		if (!gheHost) {
			throw new Error(
				`Type '${param.type}' requires GHE host configuraton. ` +
				"Run akashic config set init.ghe.host <url>"
			);
		}
		const url = createGitUri(gheHost, gheProtocol, owner, repo);
		const accepted = await confirmAccessToUrl(url);
		if (!accepted) process.exit(1);
	}

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

function isGitProtocol(s: string | null): s is GitProtocol {
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
