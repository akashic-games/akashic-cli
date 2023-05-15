import * as fs from "fs/promises";
import * as path from "path";
import { readJSON } from "@akashic/akashic-cli-commons/lib/FileSystem";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import { copySync, existsSync } from "fs-extra";
import {
	collectLocalTemplatesMetadata,
	digestOfTemplateMetadata,
	fetchRemoteTemplatesMetadata,
	fetchTemplate
} from "../common/TemplateMetadata";
import { updateConfigurationFile } from "./BasicParameters";
import { cloneTemplate, parseCloneTargetInfo } from "./cloneTemplate";
import { copyTemplate } from "./copyTemplate";
import type { InitParameterObject} from "./InitParameterObject";
import { completeInitParameterObject } from "./InitParameterObject";
import type { TemplateConfig, NormalizedTemplateConfig } from "./TemplateConfig";
import { completeTemplateConfig } from "./TemplateConfig";

export async function promiseInit(p: InitParameterObject): Promise<void> {
	const param = await completeInitParameterObject(p);
	const { gitType, owner, repo } = parseCloneTargetInfo(param.type);

	if (gitType === "github" || gitType === "ghe") {
		const targetPath = await fs.mkdtemp("init-");
		// completeInitParameterObject() で gitType が "ghe" の場合は gheHost が非 null であることは保証されている。
		const host = gitType === "github" ? param.githubHost : param.gheHost!;
		const protocol = gitType === "github" ? param.githubProtocol : param.gheProtocol;
		try {
			await cloneTemplate(
				host,
				protocol,
				{
					owner,
					repo,
					targetPath
				},
				param
			);
			await copyTemplate(targetPath, ".", param);
		} finally {
			if (existsSync(targetPath)) {
				await fs.rm(targetPath, { recursive: true });
			}
		}
	} else {
		const { type, cwd, logger, skipAsk, forceCopy, repository, templateListJsonPath, localTemplateDirectory } = param;

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
		const template = await fetchTemplate(metadata);

		// template.json を元にファイルを抽出
		const rawConf = await _readJSONWithDefault<TemplateConfig>(path.join(template, "template.json"), {});
		const conf = await completeTemplateConfig(rawConf, template);
		await _extractFromTemplate(conf, template, cwd, { forceCopy, logger });

		// ユーザ入力でゲーム設定を更新
		const gameJsonPath = path.join(cwd, conf.gameJson);
		await updateConfigurationFile(gameJsonPath, logger, skipAsk);

		if (conf.guideMessage)
			logger.print(conf.guideMessage);
	}

	param.logger.info("Done!");
}

export function init(param: InitParameterObject, cb: (err?: any) => void): Promise<void> | void {
	promiseInit(param).then<void>(cb);
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
		copySync(req.src, req.dest, { overwrite: forceCopy });
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

export const internals = {
	_extractFromTemplate
};
