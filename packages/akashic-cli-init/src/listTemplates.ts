import * as fs from "fs";
import * as path from "path";
import { getTemplateNameList } from "./downloadTemplate";
import { InitParameterObject, completeInitParameterObject } from "./InitParameterObject";

/**
 * サーバに存在するテンプレート一覧を表示
 */
export function listTemplates(param: InitParameterObject): Promise<void> {
	var templates: string[] = [];

	return completeInitParameterObject(param)
		.then(() => promisedReaddir(path.resolve(__dirname, "..", "templates")))
		.then((result) => {
			templates = result.filter((filename) => (path.extname(filename) === ".zip"))
				.map((filename) => path.basename(filename, path.extname(filename)));
		})
		.then(() => promisedReaddir(param._realTemplateDirectory))
		.then((localTemplates) => {
			templates = templates.concat(localTemplates);
		})
		.catch((err) => {
			if (err.code !== "ENOENT") throw err;
		})
		.then(() => {
			if (param.repository) {
				return Promise.resolve()
					.then(() => getTemplateNameList(param))
					.then(templateList => {
						templates = templates.concat(templateList);
					});
			} else {
				return Promise.resolve();
			}
		})
		.then(() => {
			(new Set(templates)).forEach(t => param.logger.print(t));
		});
}

function promisedReaddir(dir: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			if (err) return reject(err);
			resolve(files);
		});
	});
}
