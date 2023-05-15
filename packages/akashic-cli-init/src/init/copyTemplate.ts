import { existsSync } from "fs";
import * as fs from "fs/promises";
import * as path from "path";
import { glob } from "glob";
import ignore from "ignore";
import type { InitParameterObject } from "./InitParameterObject";

/**
 * 対象のディレクトリから別のディレクトリへと init に必要なファイルをコピーする。
 */
export async function copyTemplate(source: string, destination: string, param: InitParameterObject): Promise<void> {
	try {
		const akashicInitIgnorePath = path.join(source, ".akashicinitignore");
		const pattern = "**";
		let files: string[];
		if (existsSync(akashicInitIgnorePath)) {
			const ignoreFileContent = await fs.readFile(akashicInitIgnorePath, { encoding: "utf-8" });
			const filter = ignore().add(ignoreFileContent).createFilter();
			files = (await glob(pattern, { cwd: source, nodir: true, dot: true })).filter(filter);
		} else {
			files = (await glob(pattern, { cwd: source, nodir: true, dot: true }));
		}
		for (const file of files) {
			// 必要なファイルをコピー
			const src = path.join(source, file);
			const dest = path.join(destination, file);
			param.logger?.info(`copying ${file}`);
			await copy(src, dest, param.forceCopy);
		}
	} catch (e) {
		if (e.code === "EEXIST") {
			throw new Error("the file already exists in the current directory. use the `--force` option to forcibly copy the file.");
		}
		throw new Error(e);
	}
}

async function copy(source: string, destination: string, force: boolean = false): Promise<void> {
	const sourceStat = await fs.lstat(source);

	// 対象がディレクトリであれば無視 (ファイルのみコピー)
	if (sourceStat.isDirectory()) {
		return;
	}

	const destinationDir = path.dirname(destination);
	if (!existsSync(destinationDir)) {
		await fs.mkdir(destinationDir, { recursive: true });
	}
	await fs.copyFile(source, destination, force ? undefined : fs.constants.COPYFILE_EXCL);
}
