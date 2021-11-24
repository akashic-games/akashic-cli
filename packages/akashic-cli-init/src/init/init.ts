import * as path from "path";
import { readJSONWithDefault } from "@akashic/akashic-cli-commons/lib/FileSystem";
import { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import { copySync, existsSync } from "fs-extra";
import * as prompts from "prompts";
import {
	collectLocalTemplatesMetadata,
	digestOfTemplateMetadata,
	fetchRemoteTemplatesMetadata,
	fetchTemplate
} from "../common/TemplateMetadata";
import { updateConfigurationFile } from "./BasicParameters";
import { cloneTemplate } from "./cloneTemplate";
import { InitParameterObject, completeInitParameterObject } from "./InitParameterObject";
import { TemplateConfig, completeTemplateConfig, NormalizedTemplateConfig } from "./TemplateConfig";
import { readPromptConfig, replaceEJSWithRendered } from "./prompt";

export async function promiseInit(p: InitParameterObject): Promise<void> {
	const param = await completeInitParameterObject(p);
	const m = param.type.match(/(.+):(.+)\/(.+)/) ?? [];

	if (m[1] === "github" || m[1] === "ghe") {
		const { type, cwd, githubHost, githubProtocol, gheHost, gheProtocol } = param;
		const isGhe = m[1] === "ghe";
		if (isGhe && !gheHost) {
			throw new Error(
				`Type '${type}' requires GHE host configuraton. ` +
				"Run akashic config set init.ghe.host <url>"
			);
		}
		const owner = m[2];
		const repo = m[3];
		await cloneTemplate(
			isGhe ? gheHost : githubHost,
			isGhe ? gheProtocol : githubProtocol,
			{
				owner,
				repo,
				targetPath: cwd
			},
			param
		);

		const promptConfig = await readPromptConfig(cwd);
		if (promptConfig) {
			await replaceEJSWithRendered(cwd, await prompts(promptConfig));
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

		// tempate.json を元にファイルを抽出
		const rawConf = await readJSONWithDefault<TemplateConfig>(path.join(template, "template.json"), {});
		const conf = await completeTemplateConfig(rawConf, template);
		await _extractFromTemplate(conf, template, cwd, { forceCopy, logger });

		// ユーザ入力でゲーム設定を更新
		if (!conf.promptConfig) {
			await updateConfigurationFile(path.join(cwd, conf.gameJson), logger, skipAsk);
		} else {
			await replaceEJSWithRendered(cwd, await prompts(conf.promptConfig));
		}

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
		destRelative: path.join(entry.dst, entry.src),
		src: path.join(src, entry.src),
		dest: path.join(dest, entry.dst, entry.src)
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

export const internals = {
	_extractFromTemplate
};
