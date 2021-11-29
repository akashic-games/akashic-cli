import { readdir } from "@akashic/akashic-cli-commons/lib/FileSystem";

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

export type NormalizedTemplateConfig = DeepRequired<TemplateConfig>;

export async function completeTemplateConfig(templateConfig: TemplateConfig, baseDir: string): Promise<NormalizedTemplateConfig> {
	const { formatVersion, files, gameJson, guideMessage } = templateConfig;

	if (formatVersion != null && formatVersion !== "0") {
		throw new Error(
			`Unsupported formatVersion: "${formatVersion}". ` +
			"The only valid value for this version is \"0\". " +
			"Newer version of akashic-cli may support this formatVersion."
		);
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
		normalizedFiles = fileNames
			.filter(fileName => fileName !== "template.json")
			.map(fileName => ({ src: fileName, dst: "" } as Required<TemplateFileEntry>));
	}

	return {
		formatVersion,
		files: normalizedFiles,
		gameJson: gameJson ?? "game.json",
		guideMessage: guideMessage ?? null
	};
}
