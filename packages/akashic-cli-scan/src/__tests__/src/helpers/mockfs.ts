// mockfs を実際のディレクトリに展開するモックスクリプト。

import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type FileStructure = {
	[key: string]: FileStructure | string | Buffer;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tmpDir = join(__dirname, "..", "..", "fixtures", "tmp");

function createFiles(baseDir: string, structure: FileStructure): void {
	for (const key in structure) {
		const targetPath = join(baseDir, key);
		const value = structure[key];

		if (typeof value === "object" && value !== null && !Buffer.isBuffer(value) && typeof value !== "string") {
			// ディレクトリ
			if (!existsSync(targetPath)) {
				mkdirSync(targetPath, { recursive: true });
			}
			createFiles(targetPath, value);
		} else {
			// ファイル
			if (!existsSync(targetPath)) {
				writeFileSync(targetPath, value);
			}
		}
	}
}

export function restore(base: string): void {
	if (existsSync(join(tmpDir, base))) {
		rmSync(join(tmpDir, base), { recursive: true, force: true });
	}
}

export function create(base: string, structure: FileStructure): string {
	const rootDirname = `${Date.now()}-${randomBytes(8).toString("hex")}`;
	const baseDir = join(tmpDir, base, rootDirname);
	mkdirSync(baseDir, { recursive: true });
	createFiles(baseDir, structure);
	return baseDir;
}
