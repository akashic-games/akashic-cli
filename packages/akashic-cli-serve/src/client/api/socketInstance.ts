import type * as ioc from "socket.io-client";
import parser from "../../common/MsgpackParser";

declare var io: typeof ioc.io;

const wsProtocol = window.location.protocol.includes("https") ? "wss" : "ws";
let socket: ioc.Socket | null = null;

export function socketInstance(host?: string): ioc.Socket {
	// PlaylogClientV*_*_*ではioの読み込みが遅れることがあるのでグローバル定義せずここで遅延評価する
	if (socket === null) {
		socket = io(`${wsProtocol}://${host ?? window.location.host}`, {
			// デフォルトはInfinityだが、過去に同じホスト・ポートで起動されたサーバに
			// 接続していたクライアントが生きている(i.e. ブラウザのタブが開いたまま)時、
			// つなぎなおして来てしまうのでやむなく1にしている。(0だとInfinity扱いされる)
			// 本当はここを 1 にするよりも、playId を起動ごとにユニークなものにすべきかもしれない。
			reconnectionAttempts: 1,
			parser
		});
	}
	return socket;
}
