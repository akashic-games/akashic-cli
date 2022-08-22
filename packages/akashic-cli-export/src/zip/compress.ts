import * as fs from "fs";
import * as path from "path";
import archiver = require("archiver");
import readdir = require("fs-readdir-recursive");

export function compress(srcDir: string, dest: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const files = readdir(srcDir).map(p => ({
			src: path.resolve(srcDir, p),
			entryName: p
		}));
		const ostream = fs.createWriteStream(dest);
		const archive = archiver("zip");
		ostream.on("close", () => resolve());
		archive.on("error", (err) => reject(err));
		archive.pipe(ostream);
		files.forEach((f) => archive.file(f.src, { name: f.entryName }));
		archive.finalize();
	});
}
