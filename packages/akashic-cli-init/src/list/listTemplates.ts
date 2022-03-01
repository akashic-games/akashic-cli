import { collectLocalTemplatesMetadata, fetchRemoteTemplatesMetadata } from "../common/TemplateMetadata";
import type { ListTemplatesParameterObject} from "./ListTemplatesParameterObject";
import { completeListTemplatesParamterObject } from "./ListTemplatesParameterObject";

export async function listTemplates(p: ListTemplatesParameterObject): Promise<void> {
	const param = await completeListTemplatesParamterObject(p);
	const templateListJsonUri = new URL(param.templateListJsonPath, param.repository).toString();
	const metadataList = [
		...(await fetchRemoteTemplatesMetadata(templateListJsonUri)),
		...(await collectLocalTemplatesMetadata(param.localTemplateDirectory))
	];
	metadataList.forEach(metadata => param.logger.print(metadata.name));
}
