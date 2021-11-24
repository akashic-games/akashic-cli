import { readdirRecursice, rename, rm, writeFile } from "@akashic/akashic-cli-commons/lib/FileSystem";
import * as fs from "fs";
import * as path from "path";
import * as prompts from "prompts";
import * as ejs from "ejs";

export async function readPromptConfig(baseDir: string): Promise<prompts.PromptObject | prompts.PromptObject[] | null> {
	const promptConfigPath = path.join(baseDir, "template.prompt.js");
	if (!fs.existsSync(promptConfigPath))
		return null;
	const { VM } = await import("vm2");
	const vm = new VM({ timeout: 1000 });
	return vm.runFile(promptConfigPath) as (prompts.PromptObject | prompts.PromptObject[]);
}

export async function replaceEJSWithRendered(baseDir: string, data: any): Promise<void> {
	const filepaths = await readdirRecursice(baseDir);
	for (const filepath of filepaths) {
		if (/\.ejs$/.test(filepath)) {
			await writeFile(filepath.replace(/\.ejs$/, ""), await ejs.renderFile(filepath, data));
			await rm(filepath);
		} else if (/\.raw$/.test(filepath)) {
			await rename(filepath, filepath.replace(/\.raw$/, ""));
		}
	}
}
