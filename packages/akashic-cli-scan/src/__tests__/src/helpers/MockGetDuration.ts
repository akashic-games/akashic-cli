import { createHash } from "crypto";
import { extname } from "path";
import { readFileSync } from "fs";

// !! FIXME: !!
// getDuration() を common js の jest 環境でモックする関数
// 本リポジトリが ES Module へ移行した際に削除する暫定モック実装であることに注意。
export async function mockGetDuration(filepath: string, logger?: any): Promise<number> {
	const ext = extname(filepath);
	if (![".aac", ".ogg", ".mp4", ".m4a"].includes(ext)) {
		throw new Error("unsupported ext");
	}
	const content = readFileSync(filepath);
	const hash = createHash("sha1").update(content).digest("hex");
	if (ext === ".mp4") {
		logger?.warn("[deprecated] " + ext + " uses deprecated format. Use AAC or M4A instead of MP4(AAC).");
	}
	if (hash === "1f8cee292bc4079c727ed037fb7113019c02b2c4") {
		// dummy.ogg
		return 1.25;
	}
	if (hash === "f23a7c89300c99361d6be27c04f817988cb454d0") {
		// dummy.mp4
		return 0.302;
	}
	if (hash === "2f1d7105184ac83833c433bb87c8d410bec3199b") {
		// dummy.aac
		return 0.302;
	}
	if (hash === "509bd767a5ba2fc45cf0a24d769fc20e7b07e386") {
		// dummy.a4a
		return 28;
	}
	if (hash === "7953a559ff65328b58913a6b075af3d14d90bbf6") {
		// dummy2.ogg
		return 8;
	}
	if (hash === "5ba93c9db0cff93f52b521d7420e43f6eda2784f") {
		// 空 Buffer (Buffer.from([0])) のファイル
		throw new Error("not aac");
	}
	if (hash === "da39a3ee5e6b4b0d3255bfef95601890afd80709") {
		// 空文字列 ("") のファイル
		if (ext === ".aac") {
			throw new Error("not aac");
		} else {
			return NaN;
		}
	}
	return 0;
}
