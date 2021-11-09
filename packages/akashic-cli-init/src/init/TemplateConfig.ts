import { readdir } from "@akashic/akashic-cli-commons/lib/FileSystem";

export interface TemplateFileEntry {
	src: string;
	dst?: string;
}

export interface TemplateConfig {
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

// ref. https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
type RecursiveRequired<T> = {
	[P in keyof T]?:
		T[P] extends (infer U)[] ? RecursiveRequired<U>[] :
		T[P] extends object ? RecursiveRequired<T[P]> :
		T[P];
};

export type NormalizedTemplateConfig = RecursiveRequired<TemplateConfig>;

export async function completeTemplateConfig(templateConfig: TemplateConfig, baseDir: string): Promise<NormalizedTemplateConfig> {
	const { files, gameJson, guideMessage } = templateConfig;

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
		files: normalizedFiles,
		gameJson: gameJson ?? "game.json",
		guideMessage: guideMessage ?? null
	};
}
