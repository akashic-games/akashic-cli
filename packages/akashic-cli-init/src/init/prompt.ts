import * as fs from "fs";
import * as path from "path";
import type { PromptObject } from "prompts";
import { readdirRecursice, rename, rm, writeFile } from "@akashic/akashic-cli-commons/lib/FileSystem";

export async function readPromptConfig(baseDir: string): Promise<PromptObject | PromptObject[] | null> {
	const promptConfigPath = path.join(baseDir, "template.prompt.js");
	if (!fs.existsSync(promptConfigPath))
		return null;
	const { NodeVM } = await import("vm2");
	const vm = new NodeVM();
	return vm.runFile(promptConfigPath) as (PromptObject | PromptObject[]);
}

export async function replaceEJSWithRendered(baseDir: string, data: any): Promise<void> {
	const ejs = await import("ejs");
	const filepaths = await readdirRecursice(baseDir);
	for (const filepath of filepaths) {
		if (/\.ejs$/.test(filepath)) {
			const dest = filepath.replace(/\.ejs$/, "");
			const rendered = (await ejs.renderFile(filepath, data)) as string;
			const cont = /\.json$/.test(dest) ? prettyPrintJson(rendered) : rendered;
			await writeFile(dest, cont);
			await rm(filepath);
		} else if (/\.raw$/.test(filepath)) {
			await rename(filepath, filepath.replace(/\.raw$/, ""));
		}
	}
}

function prettyPrintJson(str: string): string {
	const m = str.match(/(?:\r|\n)(\s+)/);
	const spacer = m ? m[1] : 2;
	return JSON.stringify(JSON.parse(str), null, spacer);
}