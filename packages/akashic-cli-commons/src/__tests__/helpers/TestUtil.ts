import * as fs from "fs";
import path from "path";

interface FsContentDefinition {
	[filename: string]: FsContentDefinition | string;
}

export interface PrepareFsContentResult {
	path: string;
	dispose: () => void;
}

function setupFsContentImpl(baseDir: string, key: string, def: FsContentDefinition | string): void {
	if (typeof def === "string") {
		if (def.startsWith("symlink:")) {
			// シンボリックリンク指定は "symlink:<link to path>" の形とする
			const symlinkPath = def.split(":")[1];
			const linkPath = path.join(baseDir, key);
			fs.symlinkSync(symlinkPath, linkPath, "dir");
		} else {
			const filePath = path.join(baseDir, key);
			fs.writeFileSync(filePath, def);
		}
	} else {
		const dir = path.join(baseDir, key);
		if (!fs.existsSync(dir)) fs.mkdirSync(dir);
		setupFsContent(dir, def);
	}
}

function setupFsContent(baseDir: string, def: FsContentDefinition): void {
	for (const [key, value] of Object.entries(def)) {
		setupFsContentImpl(baseDir, key, value);
	}
}

export function prepareFsContent(def: FsContentDefinition, baseDir: string): PrepareFsContentResult  {
	setupFsContent(baseDir, def);
	return {
		path: baseDir,
		dispose: () => {
			fs.rmSync(baseDir, { recursive: true, force: true });
		}
	};
}
