import * as fs from "fs";
import * as path from "path";
import { getTemplateNameList } from "../init/downloadTemplate";
import { InitParameterObject, completeInitParameterObject } from "../init/InitParameterObject";

/**
 * サーバに存在するテンプレート一覧を表示
 */
export function listTemplates(param: InitParameterObject): Promise<void> {
	return collectTemplatesNames(param)
		.then((templates) => {
			templates.forEach(t => param.logger.print(t));
		});
}

/**
 * 利用できるテンプレート一覧を取得
 */
export function collectTemplatesNames(param: InitParameterObject): Promise<Set<string>> {
	var templates: string[] = [];

	return completeInitParameterObject(param)
		.then(() => promisedReaddir(path.resolve(__dirname, "..", "templates")))
		.then((result) => {
			templates = result.filter((filename) => (path.extname(filename) === ".zip"))
				.map((filename) => path.basename(filename, path.extname(filename)));
			param._realTemplateDirectory = param.localTemplateDirectory;
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
			return new Set(templates);
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
