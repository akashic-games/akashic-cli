import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { readdir } from "@akashic/akashic-cli-commons/lib/FileSystem";
import fetch from "node-fetch";
import * as unzipper from "unzipper";

// TODO: 適切な場所に移動
interface TemplateList {
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
	return Object.keys(templateListJson.templates).map(name => {
		const rawUrl = templateListJson.templates[name];
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
 * remote ならテンポラリディレクトリにダウンロードし、localなら何もしない。
 *
 * @param metadata 取得するテンプレート
 * @returns 取得したテンプレート(template.jsonがあるディレクトリ)のパス。テンポラリディレクトリでありうる。
 */
export async function fetchTemplate(metadata: TemplateMetadata): Promise<string> {
	switch (metadata.sourceType) {
		case "local": {
			return metadata.path;
		}
		case "remote": {
			const { name, url } = metadata;
			const zip = await (await fetch(url)).buffer();
			const destDir = fs.mkdtempSync(path.join(os.tmpdir(), name + "-"));
			await _extractZip(zip, destDir);
			return _findTemplateRoot(destDir);
		}
	}
}

function _extractZip(buf: Buffer, dest: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const stream = unzipper.Extract({ path: dest });
		stream.on("error", () => {
			reject(new Error("failed to extract zip file"));
		});
		stream.on("close", () => {
			resolve();
		});
		stream.end(buf, "binary");
	});
}

async function _findTemplateRoot(dirpath: string): Promise<string> {
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
