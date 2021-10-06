import { updateConfigurationFile } from "./BasicParameters";
import { cloneTemplate } from "./cloneTemplate";
import * as copyTemplate from "./copyTemplate";
import { downloadTemplateIfNeeded } from "./downloadTemplate";
import { extractZipIfNeeded } from "./extractZipIfNeeded";
import { InitParameterObject, completeInitParameterObject } from "./InitParameterObject";
import { collectTemplatesNames } from "./listTemplates";
import { readTemplateFile } from "./readTemplateFile";
import { showTemplateMessage } from "./showTemplateMessage";

export async function promiseInit(param: InitParameterObject): Promise<void> {
	await completeInitParameterObject(param);
	const m = param.type.match(/(.+):(.+)\/(.+)/) ?? [];

	if (m[1] === "github") {
		const owner = m[2];
		const repo = m[3];
		await cloneTemplate(
			{
				owner,
				repo,
				targetPath: param.cwd
			},
			param
		);
	} else {
		const templates = await collectTemplatesNames(param);
		if (!templates.has(param.type)) {
			throw new Error ("unknown template name " + param.type);
		}
		await extractZipIfNeeded(param);
		await downloadTemplateIfNeeded(param);
		const templateConfig = await readTemplateFile(param);

		const confPath = await copyTemplate.copyTemplate(templateConfig, param);
		await updateConfigurationFile(confPath, param.logger, param.skipAsk);
		await showTemplateMessage(templateConfig, param);
	}

	param.logger.info("Done!");
}

export function init(param: InitParameterObject, cb: (err?: any) => void): void {
	promiseInit(param).then<void>(cb);
}
