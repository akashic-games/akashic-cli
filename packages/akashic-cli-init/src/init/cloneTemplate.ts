import * as childProcess from "child_process";
import * as fs from "fs/promises";
import * as path from "path";
import * as util from "util";
import type { GitProtocol, InitParameterObject } from "./InitParameterObject.js";
const exec = util.promisify(childProcess.exec);

interface GitCloneParameterObject {
	owner: string | null;
	repo: string | null;
	branch: string | null;
	targetPath: string;
	preserveGitDirectory?: boolean;
	shallow?: boolean;
}

export interface CloneTargetInfo {
	gitType: string | null;
	owner: string | null;
	repo: string | null;
	branch: string | null;
}

/**
 * GitHub または GitHub Enterprise から リポジトリを clone する。
 */
export async function cloneTemplate(
	host: string,
	protocol: GitProtocol,
	o: GitCloneParameterObject,
	param: InitParameterObject
): Promise<void> {
	const opts = completeParameter(o);
	const { owner, repo, targetPath } = opts;
	const uri = createGitUri(host, protocol, owner, repo);
	const gitBinPath = process.env.GIT_BIN_PATH ?? param.gitBinPath ?? "git";
	const command = createGitCloneCommand(gitBinPath, uri, targetPath, opts);

	try {
		param.logger?.info(`clone git repository from "${host}/${owner}/${repo}".`);
		await exec(`${command}`, { encoding: "utf-8" });
	} catch (e) {
		throw new Error(e.stderr);
	}

	if (!opts.preserveGitDirectory) {
		await fs.rm(path.join(targetPath, ".git"), { recursive: true, force: true });
	}
}

function completeParameter(opts: GitCloneParameterObject): Required<GitCloneParameterObject> {
	return {
		...opts,
		preserveGitDirectory: opts.preserveGitDirectory ?? false,
		shallow: opts.shallow ?? !opts.preserveGitDirectory
	};
}

export function createGitUri(host: string, protocol: GitProtocol, owner: string | null, repo: string | null): string {
	if (protocol === "https") {
		return `${protocol}://${host}/${owner}/${repo}.git`;
	} else if (protocol === "ssh") {
		return `git@${host}:${owner}/${repo}.git`;
	}
	throw new Error(`unknown protocol: ${protocol}`);
}

function createGitCloneCommand(gitBinPath: string, uri: string, targetPath: string, opts: GitCloneParameterObject): string {
	const args: string[] = [];
	if (opts.shallow) {
		args.push("--depth 1");
	}
	if (opts.branch) {
		args.push(`--branch ${opts.branch}`);
	}

	return `${gitBinPath} clone ${args.join(" ")} ${uri} ${targetPath}`;
}

/**
 * type オプションの値をパースする。
 * @param type -t オプションの値
 */
export function parseCloneTargetInfo(type: string): CloneTargetInfo {
	const m = type.match(/(.+):(.+)\/([^#]+)(?:#(.*))?/) ?? [];
	const gitType = m[1] ?? null;
	const owner = m[2] ?? null;
	const repo = m[3] ?? null;
	const branch = m[4] ?? null;
	return {
		gitType,
		owner,
		repo,
		branch
	};
}
