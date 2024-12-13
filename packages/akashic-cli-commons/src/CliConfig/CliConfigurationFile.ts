import { createRequire } from "module";
import { join } from "path";
import { existsSync, statSync } from "fs";
import type { CliConfiguration } from "./CliConfiguration.js";
import { loadModule } from "../loadModule.js";

const require = createRequire(import.meta.url);

const priority = [
	"akashic.config.mjs",
	"akashic.config.cjs",
	"akashic.config.js",
];

/**
 * akashic-cli の設定ファイルを取り扱うモジュール。
 */
export namespace CliConfigurationFile {
	/**
	 * akashic.config.js ファイルを読み込む。
	 * @deprecated CliConfigurationFile.load() を使用すべき。
	 *
	 * @param confPath akashic.config.js があるディレクトリ。絶対パスであることを期待する。
	 * @param callback コールバック。
	 */
	export function read(confPath: string, callback: (error: Error | undefined, conf: CliConfiguration | undefined) => void): void {
		let cliConfig: CliConfiguration = { commandOptions: {} };
		try {
			cliConfig = require(confPath);
			delete require.cache[require.resolve(confPath)];
			setImmediate(() => callback(undefined, cliConfig));
		} catch (error) {
			if (error.code === "MODULE_NOT_FOUND") {
				setImmediate(() => callback(undefined, cliConfig));
			} else {
				setImmediate(() => callback(error, undefined));
			}
		}
	}

	/**
	 * akashic-cli の設定ファイルを読み込む。
	 * ファイルを指定した場合はそのファイルを、ディレクトリを指定した場合は以下の優先順位で読み込む。
	 * 1. akashic.config.mjs
	 * 2. akashic.config.cjs
	 * 3. akashic.config.js
	 *
	 * @param confDir 設定ファイルがあるディレクトリ。
	 */
	export async function load(confDir: string): Promise<CliConfiguration> {
		const candidateConfigPaths = isDirectory(confDir) ? priority.map(filename => join(confDir, filename)) : [confDir];

		for (const candidateConfigPath of candidateConfigPaths) {
			if (!existsSync(candidateConfigPath)) continue;
			return loadModule(candidateConfigPath);
		}

		return { commandOptions: {} };
	}
}

function isDirectory(path: string): boolean {
	try {
		const stats = statSync(path);
		return stats.isDirectory();
	} catch {
		return false;
	}
}
