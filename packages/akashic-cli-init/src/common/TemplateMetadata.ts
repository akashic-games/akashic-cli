import * as fs from "fs";
import * as os from "os";
import fetch from "node-fetch";
import * as request from "request";
import * as path from "path";
import * as unzipper from "unzipper";
import { readdir } from "@akashic/akashic-cli-commons/lib/FileSystem";

// TODO: 適切な場所に移動
interface TemplateList {
	templates: {[type: string]: string};
}

export type LocalTemplateMetadata = {
	sourceType: "local";
	name: string;
	path: string;
}

export type RemoteTemplateMetadata = {
	sourceType: "remote";
	name: string;
	url: string;
}

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
			// const zip = await (await fetch(url)).buffer();
			const zip = await _request({ uri: url, method: "GET", encoding: null });
			const destDir = fs.mkdtempSync(path.join(os.tmpdir(), name));
			await _extractZip(zip, destDir);
			return destDir;
		}
	}
}


interface RequestParameterObject {
	/**
	 * サーバURI
	 */
	uri: string;

	/**
	 * HTTPメソッド (例: "GET")
	 */
	method: string;

	/**
	 * 結果をjsonで返すかどうか
	 */
	json?: boolean;

	/**
	 * 結果のエンコーディング (nullを指定するとBuffer)
	 */
	encoding?: string;
}

function _request(param: RequestParameterObject): Promise<any> {
	return new Promise<any>((resolve, reject) => {
		request(param, (err: any, res: any, body: any) => {
			if (err) {
				reject(err);
				return;
			}
			if (res.statusCode !== 200) {
				reject(new Error(`download failed: code = ${res.code}`));
				return;
			}
			resolve(body);
		});
	});
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

