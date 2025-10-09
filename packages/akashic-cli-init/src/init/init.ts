import { existsSync } from "fs";
import * as fs from "fs/promises";
import { spawn } from "node:child_process";
import * as path from "path";
import { readJSON } from "@akashic/akashic-cli-commons/lib/FileSystem.js";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger.js";
import checkbox from "@inquirer/checkbox";
import fsx from "fs-extra";
import {
	collectLocalTemplatesMetadata,
	digestOfTemplateMetadata,
	fetchRemoteTemplatesMetadata,
	fetchTemplate
} from "../common/TemplateMetadata.js";
import { updateConfigurationFile } from "./BasicParameters.js";
import { cloneTemplate, parseCloneTargetInfo } from "./cloneTemplate.js";
import type { InitParameterObject} from "./InitParameterObject.js";
import { completeInitParameterObject } from "./InitParameterObject.js";
import type { TemplateConfig, NormalizedTemplateConfig } from "./TemplateConfig.js";
import { completeTemplateConfig } from "./TemplateConfig.js";

export async function promiseInit(p: InitParameterObject): Promise<void> {
	const param = await completeInitParameterObject(p);
	const { type, cwd, logger, skipAsk, forceCopy, repository, templateListJsonPath, localTemplateDirectory } = param;
	const { gitType, owner, repo, branch } = parseCloneTargetInfo(type);
	let templatePath: string | null = null;

	try {
		if (gitType === "github" || gitType === "ghe") {
			// completeInitParameterObject() で gitType が "ghe" の場合は gheHost が非 null であることは保証されている。
			const host = gitType === "github" ? param.githubHost : param.gheHost!;
			const protocol = gitType === "github" ? param.githubProtocol : param.gheProtocol;
			templatePath = await fs.mkdtemp("init-");
			await cloneTemplate(
				host,
				protocol,
				{
					owner,
					repo,
					branch,
					targetPath: templatePath
				},
				param
			);
		} else {
			// テンプレート決定
			const templateListJsonUri = new URL(templateListJsonPath, repository).toString();
			const allMetadataList = [
				...(await fetchRemoteTemplatesMetadata(templateListJsonUri)),
				...(await collectLocalTemplatesMetadata(localTemplateDirectory))
			];
			const metadataList = allMetadataList.filter(metadata => metadata.name === type);
			if (metadataList.length === 0)
				throw new Error(`Unknown template name: ${type}`);
			const metadata = metadataList[0];
			if (metadataList.length > 1)
				logger.warn(`Found multiple templates named ${type}. Using ${digestOfTemplateMetadata(metadata)}`);

			// テンプレート取得
			templatePath = await fetchTemplate(metadata);
		}

		// template.json を元にファイルを抽出
		const rawConf = await _readJSONWithDefault<TemplateConfig>(path.join(templatePath, "template.json"), {});
		const conf = await completeTemplateConfig(rawConf, templatePath, logger);
		await _extractFromTemplate(conf, templatePath, cwd, { forceCopy, logger });

		// GitHub 経由以外の場合はユーザ入力でゲーム設定を更新
		if (!(gitType === "github" || gitType === "ghe")) {
			const gameJsonPath = path.join(cwd, conf.gameJson);
			await updateConfigurationFile(gameJsonPath, logger, skipAsk);
		}

		if (conf.extensions.length > 0) {
			logger.warn("⚠️ Installing extensions from untrusted templates or modules may be risky.");

			const extensions = await checkbox({
				message: "Select the extensions you want to install for this template:",
				choices: conf.extensions.map(({ module, version }) => ({ name: module, value: { module, version } })),
			});

			if (extensions.length > 0) {
				for (const { module, version } of extensions) {
					await _addExtensionToPackageJSON(module, version);
				}
				logger.info("The selected extensions have been added to your package.json. To actually install them, run `npm install`.");
			}
		}

		if (conf.guideMessage)
			logger.print(conf.guideMessage);
	} finally {
		if (templatePath && existsSync(templatePath)) {
			await fs.rm(templatePath, { recursive: true });
		}
	}

	param.logger.info("Done!");
}

export function init(param: InitParameterObject, cb: (err?: any) => void): Promise<void> | void {
	return promiseInit(param).then<void>(cb);
}

interface ExtractFromTemplateOptions {
	forceCopy?: boolean;
	logger?: Logger;
}

async function _extractFromTemplate(
	conf: NormalizedTemplateConfig,
	src: string,
	dest: string,
	opts: ExtractFromTemplateOptions
): Promise<void> {
	const { forceCopy, logger } = opts;
	const copyReqs = conf.files.map(entry => ({
		srcRelative: entry.src,
		destRelative: entry.dst || entry.src,
		src: path.join(src, entry.src),
		dest: path.join(dest, entry.dst || entry.src)
	}));
	if (!forceCopy) {
		const existings = copyReqs.filter(req => existsSync(req.dest)).map(req => req.destRelative);
		if (existings.length > 0)
			throw new Error(`aborted to copy files, because followings already exist. [${existings.join(", ")}]`);
	}
	copyReqs.forEach(req => {
		fsx.copySync(req.src, req.dest, { overwrite: forceCopy });
		logger?.info(`copied ${req.srcRelative}.`);
	});
}

async function _readJSONWithDefault<T>(filepath: string, defaultValue: T): Promise<T> {
	try {
		return await readJSON(filepath);
	} catch (e) {
		if (e.code === "ENOENT")
			return defaultValue;
		throw e;
	}
}

let spawnFn: typeof spawn = spawn;

function _setSpawnFn(mockSpawnFn: typeof spawn | undefined): void {
	spawnFn = mockSpawnFn ?? spawn;
}

/**
 * 与えられた拡張機能をパッケージとして package.json に追加する。
 * インストールはしない。
 */
function _addExtensionToPackageJSON(module: string, version: string): Promise<void> {
	return new Promise((resolve, reject) => {
		// 与えられた値をコマンドの引数として直接渡すことでコマンドインジェクションのリスクを低減
		const options = ["--save", "--package-lock-only", "--no-package-lock", "--save-prefix", _extractVersionPrefix(version)];
		const p = spawnFn("npm", ["install", ...options, `${module}@${version}`], { stdio: "inherit" });
		p.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`npm install failed with code ${code}`));
			}
		});
	});
}

/**
 * バージョン文字列から接頭辞 (^, ~, なし) を抽出する。
 * 例外として "latest" の場合は "^" を付与。
 */
function _extractVersionPrefix(version: string): string {
	if (version === "latest") return "^";
	const match = version.match(/^(\^|~)/);
	return match?.[1] ?? "";
}

export const internals = {
	_extractFromTemplate,
	_addExtensionToPackageJSON,
	_extractVersionPrefix,
	_setSpawnFn,
};
