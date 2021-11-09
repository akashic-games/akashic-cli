import { InitParameterObject } from "./InitParameterObject";
import { TemplateConfig } from "./TemplateConfig";

/**
 * template.json の guideMessage 要素を出力する
 */
export function showTemplateMessage(templateConfig: TemplateConfig, param: InitParameterObject): Promise<void> {
	return showTemplateGuideMessage(templateConfig, param);
}

function showTemplateGuideMessage(templateConfig: TemplateConfig, param: InitParameterObject): Promise<void> {
	const guideMessage = templateConfig.guideMessage;
	if (!guideMessage) return Promise.resolve();
	const texts = guideMessage.split("\n");
	texts.forEach((text: string) => {
		param.logger.print(text);
	});
	Promise.resolve();
}
