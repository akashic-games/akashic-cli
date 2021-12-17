import type * as ioc from "socket.io-client";
import parser from "../../common/MsgpackParser";

declare var io: typeof ioc.io;

export function createSocketInstance(uri: string): ioc.Socket {
	return io(uri, {
			// デフォルトはInfinityだが、過去に同じホスト・ポートで起動されたサーバに
			// 接続していたクライアントが生きている(i.e. ブラウザのタブが開いたまま)時、
			// つなぎなおして来てしまうのでやむなく1にしている。(0だとInfinity扱いされる)
			// 本当はここを 1 にするよりも、playId を起動ごとにユニークなものにすべきかもしれない。
			reconnectionAttempts: 1,
			parser
	});
}
