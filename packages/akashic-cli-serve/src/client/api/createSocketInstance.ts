import type * as ioc from "socket.io-client";
import parser from "../../common/MsgpackParser";

declare const io: typeof ioc.io;

export function createSocketInstance(uri: string): ioc.Socket {
	// SocketIO を利用しないケース (Sandbox) においては io が存在しない。
	// 既存のコードに影響を与えないよう non-null assertion で null を返している。
	// TODO: ioc.Socket | null に変更し、呼び出し元で null チェックを行うように変更する。
	if (typeof io === "undefined") return null!;

	return io(uri, {
		// デフォルトはInfinityだが、過去に同じホスト・ポートで起動されたサーバに
		// 接続していたクライアントが生きている(i.e. ブラウザのタブが開いたまま)時、
		// つなぎなおして来てしまうのでやむなく1にしている。(0だとInfinity扱いされる)
		// 本当はここを 1 にするよりも、playId を起動ごとにユニークなものにすべきかもしれない。
		reconnectionAttempts: 1,
		parser
	});
}
