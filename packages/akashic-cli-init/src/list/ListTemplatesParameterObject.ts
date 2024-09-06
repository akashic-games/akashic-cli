import type { InitCommonOptions } from "../common/InitCommonOptions.js";
import { completeInitCommonOptions } from "../common/InitCommonOptions.js";

export interface ListTemplatesParameterObject extends InitCommonOptions {
	// add nothing.
}

export type NormalizedListTemplatesParameterObject = Required<ListTemplatesParameterObject>;

export async function completeListTemplatesParamterObject(
	param: ListTemplatesParameterObject
): Promise<NormalizedListTemplatesParameterObject> {
	return completeInitCommonOptions(param);
}
