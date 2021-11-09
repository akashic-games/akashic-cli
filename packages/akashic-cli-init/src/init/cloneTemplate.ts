import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import { GitProtocol, InitParameterObject } from "./InitParameterObject";
const exec = util.promisify(childProcess.exec);

interface GitCloneParameterObject {
	owner: string;
	repo: string;
	targetPath: string;
	preserveGitDirectory?: boolean;
	shallow?: boolean;
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
		await rmPromise(path.join(targetPath, ".git"), { recursive: true });
	}
}

function completeParameter(opts: GitCloneParameterObject): Required<GitCloneParameterObject> {
	return {
		...opts,
		preserveGitDirectory: opts.preserveGitDirectory ?? false,
		shallow: opts.shallow ?? !opts.preserveGitDirectory
	};
}

function createGitUri(host: string, protocol: GitProtocol, owner: string, repo: string): string {
	if (protocol === "https") {
		return `${protocol}://${host}/${owner}/${repo}.git`;
	} else if (protocol === "ssh") {
		return `git@${host}:${owner}/${repo}.git`;
	}
	throw new Error(`unknown protocol: ${protocol}`);
}

function createGitCloneCommand(gitBinPath: string, uri: string, targetPath: string, opts: GitCloneParameterObject): string {
	const args = [];
	if (opts.shallow) {
		args.push("--depth 1");
	}

	return `${gitBinPath} clone ${args.join(" ")} ${uri} ${targetPath}`;
}

// for Node 12
async function rmPromise(path: string, opts?: fs.RmOptions): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, stat) => {
			if (err) {
				if (err.code === "ENOENT") {
					// NOTE: 存在しない場合は何もせず終了
					return void resolve();
				}
				return void reject(err);
			}
			if (stat.isDirectory()) {
				// TODO: fs.rm() に移行
				fs.rmdir(path, opts, err => {
					if (err) {
						return void reject(err);
					}
					resolve();
				});
			} else {
				fs.unlink(path, err => {
					if (err) {
						return void reject(err);
					}
					resolve();
				});
			}
		});
	});
}
