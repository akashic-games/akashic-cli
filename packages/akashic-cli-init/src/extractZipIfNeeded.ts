import { InitParameterObject } from "./InitParameterObject";
import { getFactoryTemplate, promisedExtract } from "./downloadTemplate";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

export async function extractZipIfNeeded(param: InitParameterObject): Promise<void> {
	const ignoreTypes = fs.readdirSync(path.resolve(__dirname, "..", "templates"))
		.filter(name => {return path.extname(name) === ".zip"; })
		.map(name => path.basename(name, path.extname(name)));
	if (ignoreTypes.indexOf(param.type) === -1) {
		param._realTemplateDirectory = param.localTemplateDirectory;
		return;
	}

	const temporaryPath = path.join(os.tmpdir(), param.type);
	param._realTemplateDirectory = temporaryPath;

	const buffer = await getFactoryTemplate(param);
	await promisedExtract(buffer, path.join(param._realTemplateDirectory, param.type));

	await showMessageIfNeeded(param, ignoreTypes);
}

function showMessageIfNeeded(param: InitParameterObject, ignoreTypes: string[]): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const templatePath = path.join(param.localTemplateDirectory, param.type);
		fs.stat(templatePath, (err: any, stats: any) => {
			if (err) {
				if (err.code === "ENOENT") return resolve();
				return reject(err);
			}
			const message = [
				`The local cache for a template type '${param.type}' found on ${templatePath}.`,
				`The cache, probably created by old akashic-cli, is ignored. `,
				`Current akashic-cli only uses built-in templates for type ${ignoreTypes.toString()}`,
				`If you want to use ${templatePath}, rename template directory from ${param.type} `,
				`to something other than ${ignoreTypes.toString()} , and run:`,
				`  $ akashic init --type renamed-your-template-name`,
				``,
				`Or if you want only hide this message, remove ${templatePath}.`,
				``
			].join("\n");
			param.logger.print(message);
			resolve();
		});
	});
}
