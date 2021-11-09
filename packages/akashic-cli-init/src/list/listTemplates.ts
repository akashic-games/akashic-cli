import { collectLocalTemplatesMetadata, fetchRemoteTemplatesMetadata } from "../common/TemplateMetadata";
import { ListTemplatesParameterObject, completeListTemplatesParamterObject } from "./ListTemplatesParameterObject";

export async function listTemplates(p: ListTemplatesParameterObject): Promise<void> {
	const param = await completeListTemplatesParamterObject(p);
	const metadataList = [
		...(await collectLocalTemplatesMetadata(param.localTemplateDirectory)),
		...(await fetchRemoteTemplatesMetadata(param.templateListJsonPath))
	];
	metadataList.forEach(metadata => param.logger.print(metadata.name));
}
