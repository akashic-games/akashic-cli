import { createRequire } from "module";
import * as path from "path";
import { readdir } from "@akashic/akashic-cli-commons/lib/FileSystem.js";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger.js";
import { glob } from "glob";

// FIXME: ignore@6.0.2 において型に齟齬があるため暫定的に require() を用いている
const require = createRequire(import.meta.url);
const ignore = require("ignore");

export interface TemplateFileEntry {
	src: string;
	dst?: string;
}

export interface TemplateConfig {
	/**
	 * このテンプレートのフォーマット。現在 "0" のみがサポートされている。
	 * 省略された場合、 `"0"` 。
	 */
	formatVersion?: "0";

	/**
	 * コピーするファイルの指定。
	 * 省略された場合、直下の全て (ただし template.json を除く) がコピーされる。
	 * 省略された場合、直下に game.json がなければならない。
	 */
	files?: TemplateFileEntry[];

	/**
	 * コピーから除外するファイルの指定。glob 形式のワイルドカードがサポートされる。
	 * 省略した場合は files で指定されたすべてのファイルがコピーさせる。
	 */
	exclude?: string[];

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

// ref. https://off.tokyo/blog/typescript-saiki-utility-types/#DeepRequired
type IsPrimitive<T> = T extends Array<any> ? never : T extends { [key: string]: any } ? never : T;
type DeepRequired<T> = {
	[P in keyof T]-?: T[P] extends IsPrimitive<T[P]> ? T[P] : DeepRequired<T[P]>;
};

export type NormalizedTemplateConfig = DeepRequired<Omit<TemplateConfig, "exclude">>;

export async function completeTemplateConfig(
	templateConfig: TemplateConfig,
	baseDir: string,
	logger?: Logger
): Promise<NormalizedTemplateConfig> {
	const { formatVersion, files, exclude, gameJson, guideMessage } = templateConfig;

	if (formatVersion != null && formatVersion !== "0") {
		throw new Error(
			`Unsupported formatVersion: "${formatVersion}". ` +
			"The only valid value for this version is \"0\". " +
			"Newer version of akashic-cli may support this formatVersion."
		);
	}

	if (logger && (files && files.length > 0) && (exclude && exclude.length > 0)) {
		logger.warn("Both \"files\" and \"exclude\" are found in template.json, \"exclude\" is ignored.");
	}

	let normalizedFiles: Required<TemplateFileEntry>[];
	if (files) {
		normalizedFiles = files.map(({ src, dst }) => {
			if (/\.\./.test(src) || (dst && /\.\./.test(dst)))
				throw new Error("template.json has an invalid file name:");
			return { src, dst: dst ?? "" };
		});
	} else if (exclude && exclude.length > 0) {
		const filter = ignore().add(exclude).createFilter();
		const filepaths = (await glob("**", { cwd: baseDir, nodir: true, dot: true, posix: true })).filter(filter);
		normalizedFiles = filepaths
			.filter(filepath => path.basename(filepath) !== "template.json")
			.map(filepath => ({ src: filepath, dst: "" } as Required<TemplateFileEntry>));
	} else {
		// files を省略した際の既存挙動
		const fileNames = await readdir(baseDir);
		normalizedFiles = fileNames
			.filter(fileName => fileName !== "template.json")
			.map(fileName => ({ src: fileName, dst: "" } as Required<TemplateFileEntry>));
	}

	return {
		formatVersion: formatVersion ?? "0",
		files: normalizedFiles,
		gameJson: gameJson ?? "game.json",
		guideMessage: guideMessage ?? null
	};
}
