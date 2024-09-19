import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { readdir } from "@akashic/akashic-cli-commons/lib/FileSystem";
import * as unzipper from "unzipper";

// TODO: 適切な場所に移動
interface TemplateList {
	/**
	 * このテンプレートリストのフォーマット。現在 "0" のみがサポートされている。
	 * 省略された場合、 `"0"` 。
	 */
	formatVersion?: "0";

	/**
	 * テンプレート名と URL (またはパス) のテーブル。
	 */
	templates: {[type: string]: string};
}

export type LocalTemplateMetadata = {
	sourceType: "local";
	name: string;
	path: string;
};

export type RemoteTemplateMetadata = {
	sourceType: "remote";
	name: string;
	url: string;
};

export type TemplateMetadata =
	LocalTemplateMetadata |
	RemoteTemplateMetadata;

export function digestOfTemplateMetadata(metadata: TemplateMetadata): string {
	switch (metadata.sourceType) {
		case "local": return metadata.path;
		case "remote": return metadata.url;
	}
}

export async function collectLocalTemplatesMetadata(templateDirectory: string): Promise<LocalTemplateMetadata[]> {
	try {
		const dirnames = await readdir(templateDirectory);
		return dirnames.map(dirname => ({
			sourceType: "local",
			name: dirname,
			path: path.join(templateDirectory, dirname)
		}));
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
		return [];
	}
}

export async function fetchRemoteTemplatesMetadata(templateListJsonUri: string): Promise<RemoteTemplateMetadata[]> {
	const res = await fetch(templateListJsonUri);
	const templateListJson = (await res.json()) as TemplateList;
	const { formatVersion, templates } = templateListJson;

	if (formatVersion != null && formatVersion !== "0") {
		throw new Error(
			`Unsupported formatVersion "${formatVersion}" found in ${templateListJsonUri}. ` +
			"The only valid value for this version is \"0\". " +
			"Newer version of akashic-cli may support this formatVersion."
		);
	}

	return Object.keys(templates).map(name => {
		const rawUrl = templates[name];
		return {
			sourceType: "remote",
			name,
			url: new URL(rawUrl, templateListJsonUri).toString()
		};
	});
}

/**
 * テンプレートを取得する。
 *
 * remote ならテンポラリディレクトリにダウンロードし、local ならテンポラリディレクトリにコピーする。
 *
 * @param metadata 取得するテンプレート
 * @returns 取得したテンプレート(template.jsonがあるディレクトリ)のパス。テンポラリディレクトリでありうる。
 */
export async function fetchTemplate(metadata: TemplateMetadata): Promise<string> {
	switch (metadata.sourceType) {
		case "local": {
			const destDir = fs.mkdtempSync(path.join(os.tmpdir(), metadata.name + "-"));
			fs.cpSync(metadata.path, destDir, { recursive: true });
			return destDir;
		}
		case "remote": {
			const { name, url } = metadata;
			const res = await fetch(url);
			const arrayBuffer = await res.arrayBuffer();
			const zip = Buffer.from(arrayBuffer);
			const dest = fs.mkdtempSync(path.join(os.tmpdir(), name + "-"));
			await _extractZip(zip, dest);
			const templateRoot = await _findTemplateRoot(dest);
			if (!templateRoot)
				throw new Error(`No template root in ${dest} (obtained from ${url})`);
			return templateRoot;
		}
	}
}

async function _extractZip(buf: Buffer, dest: string): Promise<void> {
	const directory = await unzipper.Open.buffer(buf);
	await directory.extract({ path: dest });
}

async function _findTemplateRoot(dirpath: string): Promise<string | null> {
	const fileNames = await readdir(dirpath);
	if (fileNames.includes("template.json") || fileNames.includes("game.json"))
		return dirpath;

	// 中身がフォルダ一つならその中も探す (フォルダごと .zip にされていたり、.zip の展開時にフォルダが作られるケース救済)
	if (fileNames.length === 1) {
		const childDir = path.join(dirpath, fileNames[0]);
		if (fs.statSync(childDir).isDirectory()) // TODO commons に promise 版の stat() を作る
			return _findTemplateRoot(childDir);
	}
	return null;
}
