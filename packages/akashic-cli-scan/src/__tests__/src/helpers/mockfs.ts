// mockfs を実際のディレクトリに展開するモックスクリプト。

import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type FileStructure = {
	[key: string]: FileStructure | string | Buffer;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tmpBaseDir = join(__dirname, "..", "..", "tmp-expanded-fixtures");

function createFiles(baseDir: string, structure: FileStructure): void {
	for (const key in structure) {
		const targetPath = join(baseDir, key);
		const value = structure[key];

		if (typeof value === "object" && value !== null && !Buffer.isBuffer(value)) {
			// ディレクトリ
			if (!existsSync(targetPath)) {
				mkdirSync(targetPath, { recursive: true });
			}
			createFiles(targetPath, value);
		} else {
			// ファイル
			writeFileSync(targetPath, value);
		}
	}
}

export function restore(base: string): void {
	if (existsSync(join(tmpBaseDir, base))) {
		rmSync(join(tmpBaseDir, base), { recursive: true, force: true });
	}
}

export function create(base: string, structure: FileStructure): string {
	const baseDir = join(tmpBaseDir, base);
	mkdirSync(baseDir, { recursive: true });

	const tmpDir = mkdtempSync(join(baseDir, `${Date.now()}-`));
	createFiles(tmpDir, structure);

	return tmpDir;
}
