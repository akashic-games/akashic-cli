import { completeInitCommonOptions, InitCommonOptions } from "../common/InitCommonOptions";

export interface ListTemplatesParameterObject extends InitCommonOptions {
	// add nothing.
}

export type NormalizedListTemplatesParameterObject = Required<ListTemplatesParameterObject>;

export async function completeListTemplatesParamterObject(
	param: ListTemplatesParameterObject
): Promise<NormalizedListTemplatesParameterObject> {
	return completeInitCommonOptions(param);
}
