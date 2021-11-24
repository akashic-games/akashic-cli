import { readdir } from "@akashic/akashic-cli-commons/lib/FileSystem";
import { existsSync } from "fs";
import path = require("path");
import { PromptObject } from "prompts";
import { readPromptConfig } from "./prompt";

export interface TemplateFileEntry {
	src: string;
	dst?: string;
}

export interface NormalizedTemplateFileEntry extends Required<TemplateFileEntry> {
	// nothing
}

export interface TemplateConfig {
	/**
	 * このテンプレートのフォーマット。現在 "0" のみがサポートされている。
	 * 省略された場合、 `"0"` 。
	 */
	formatVersion?: "0" | "1";

	/**
	 * このテンプレートでユーザ入力を求める指定。
	 * formatVersion が "0" の場合、無視される。
	 * この値が null または省略された時、 template.json と同じディレクトリに template.prompt.js があるなら、
	 * それを実行して module.exports に代入された値が利用される。
	 */
	promptConfig?: PromptObject | PromptObject[] | null;

	/**
	 * コピーするファイルの指定。
	 * 省略された場合、直下の全て (ただし template.json を除く) がコピーされる。
	 * 省略された場合、直下に game.json がなければならない。
	 */
	files?: TemplateFileEntry[];

	/**
	 * 中に含まれる game.json のパス。
	 * 省略された場合、 "game.json" 。
	 */
	gameJson?: string;

	/**
	 * テンプレートからのゲーム生成の後に表示する説明文。
	 * `null` なら何も表示しない。
	 * 省略された場合、 `null` 。
	 */
	guideMessage?: string | null;
}

export interface NormalizedTemplateConfig extends Required<TemplateConfig> {
	files: NormalizedTemplateFileEntry[];
}

export async function completeTemplateConfig(templateConfig: TemplateConfig, baseDir: string): Promise<NormalizedTemplateConfig> {
	const { formatVersion, promptConfig, files, gameJson, guideMessage } = templateConfig;

	const normalizedFormatVersion = formatVersion ?? "0";
	if (!/^[01]$/.test(normalizedFormatVersion)) {
		throw new Error(
			`Unsupported formatVersion: "${formatVersion}". ` +
			"The valid value for this version is \"0\" or \"1\". " +
			"Newer version of akashic-cli may support this formatVersion."
		);
	}

	let normalizedPromptConfig: PromptObject | PromptObject[] | null = null;
	if (normalizedFormatVersion !== "0") {
		normalizedPromptConfig = promptConfig ?? await readPromptConfig(baseDir);
	}

	let normalizedFiles: Required<TemplateFileEntry>[];
	if (files) {
		normalizedFiles = files.map(({ src, dst }) => {
			if (/\.\./.test(src) || (dst && /\.\./.test(dst)))
				throw new Error("template.json has an invalid file name:");
			return { src, dst: dst ?? "" };
		});

	} else {
		const fileNames = await readdir(baseDir);
		const filterFun =
			(normalizedFormatVersion === "0") ?
				((f: string) => f !== "template.json") :
				((f: string) => !/^template\./.test(f));
		normalizedFiles = fileNames
			.filter(filterFun)
			.map(fileName => ({ src: fileName, dst: "" } as NormalizedTemplateFileEntry));
	}

	return {
		formatVersion: normalizedFormatVersion,
		promptConfig: normalizedPromptConfig,
		files: normalizedFiles,
		gameJson: gameJson ?? "game.json",
		guideMessage: guideMessage ?? null
	};
}
