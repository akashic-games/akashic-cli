import * as fs from "fs";

const FIRST_FEW_BYTES = 8000;

/**
 * @see https://qiita.com/okuoku/items/a21bfa68570ca67817ac
 */
export function isBinaryFile(path: string): boolean {
	const fd = fs.openSync(path, "r");
	const buff = Buffer.alloc(FIRST_FEW_BYTES);
	try {
		const bytes = fs.readSync(fd, buff, 0, FIRST_FEW_BYTES, 0);
		fs.closeSync(fd);
		const index = buff.indexOf(0x00);
		return index !== -1 && index < bytes;
	} catch (error) {
		fs.closeSync(fd);
		throw error;
	}
}
