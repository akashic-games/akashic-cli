import * as fs from "fs";
import * as os from "os";
import path from "path";

interface FSContentDescDir {
	[filename: string]: FSContentDescDir | string;
}

export interface FsContentResult {
	path: string;
	dispose: () => void;
}

function setupFsContentImpl(baseDir: string, key: string, def: FSContentDescDir | string): void {
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
		fs.mkdirSync(dir);
		setupFsContent(dir, def);
	}
}

function setupFsContent(baseDir: string, def: FSContentDescDir): void {
	for (const [key, value] of Object.entries(def)) {
		setupFsContentImpl(baseDir, key, value);
	}
}

export function preperFsContent(def: FSContentDescDir, baseDir?: string): FsContentResult  {
	const target = baseDir ? baseDir : path.join(os.tmpdir(), "akashic-cli-test-");
	const dir = fs.mkdtempSync(target);
	setupFsContent(dir, def);
	return {
		path: dir,
		dispose: () => {
			fs.rmSync(dir, { recursive: true, force: true });
		}
	};
}
