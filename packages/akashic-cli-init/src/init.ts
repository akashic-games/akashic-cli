import { updateConfigurationFile } from "./BasicParameters";
import * as copyTemplate from "./copyTemplate";
import { downloadTemplateIfNeeded } from "./downloadTemplate";
import { extractZipIfNeeded } from "./extractZipIfNeeded";
import { InitParameterObject, completeInitParameterObject } from "./InitParameterObject";
import { collectTemplatesNames } from "./listTemplates";
import { readTemplateFile } from "./readTemplateFile";
import { showTemplateMessage } from "./showTemplateMessage";
import { TemplateConfig } from "./TemplateConfig";

export function promiseInit(param: InitParameterObject): Promise<void> {
	let templateConfig: TemplateConfig;

	return Promise.resolve<void>(undefined)
		.then(() => completeInitParameterObject(param))
		.then(() => {
			return collectTemplatesNames(param)
				.then(templates => {
					if (!templates.has(param.type)) throw new Error ("unknown template name " + param.type);
				});
		})
		.then(() => extractZipIfNeeded(param))
		.then(() => downloadTemplateIfNeeded(param))
		.then(() => readTemplateFile(param))
		.then((template) => {
			templateConfig = template;
		})
		.then(() => copyTemplate.copyTemplate(templateConfig, param))
		.then(confPath => updateConfigurationFile(confPath, param.logger, param.skipAsk))
		.then(() => showTemplateMessage(templateConfig, param))
		.then(() => param.logger.info("Done!"));
}

export function init(param: InitParameterObject, cb: (err?: any) => void): void {
	promiseInit(param).then<void>(cb);
}
