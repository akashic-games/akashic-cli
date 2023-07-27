import * as fs from "fs";

const FIRST_FEW_BYTES = 8000;

/**
 * @see https://qiita.com/okuoku/items/a21bfa68570ca67817ac
 */
export function isBinaryFile(filePath: string): boolean {
	let fd: number;
	try {
		fd = fs.openSync(filePath, "r");
		const buff = Buffer.alloc(FIRST_FEW_BYTES);
		const bytes = fs.readSync(fd, buff, 0, FIRST_FEW_BYTES, 0);
		const index = buff.indexOf(0x00);
		// ファイルが8000B以下の場合、余剰なバッファの0埋めされた箇所をindexが指すことがある。
		// そのため、実際に読んだファイルサイズの内側にindexがあることも条件とする。
		return index !== -1 && index < bytes;
	} catch (error) {
		throw error;
	} finally {
		if (fd) fs.closeSync(fd);

	}
}
