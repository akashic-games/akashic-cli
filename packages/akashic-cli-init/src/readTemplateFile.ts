import * as fs from "fs";
import * as path from "path";
import { InitParameterObject } from "./InitParameterObject";
import { TemplateConfig } from "./TemplateConfig";

export function readTemplateFile(param: InitParameterObject): Promise<TemplateConfig> {
	const copySpecPath = path.join(param._realTemplateDirectory, param.type, "template.json");
	return new Promise<TemplateConfig>((resolve, reject) => {
		fs.readFile(copySpecPath, (err: any, data: any) => {
			if (err) {
				if (err.code !== "ENOENT") {
					console.log("reg", err);
					reject(err);
					return;
				}
				resolve({});
				return;
			}
			let templateConfig: TemplateConfig = JSON.parse(data);
			resolve(templateConfig);
		});
	});
}
