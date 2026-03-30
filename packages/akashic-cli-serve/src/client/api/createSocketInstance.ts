import type * as ioc from "socket.io-client";
import parser from "../../common/MsgpackParser";

declare const io: typeof ioc.io;

export function createSocketInstance(uri: string): ioc.Socket {
	// SocketIO を利用しないケース (Sandbox) においては io が存在しない。
	// 既存のコードに影響を与えないよう non-null assertion で null を返している。
	// TODO: ioc.Socket | null に変更し、呼び出し元で null チェックを行うように変更する。
	if (typeof io === "undefined") return null!;

	return io(uri, {
		// サーバが切断された場合に自動再接続を行う。
		// 再接続成功時 (serverReady イベント) にページリロードを行うため、新しいサーバへ繋いだ場合も正しく初期化される。
		// TODO: 本当はここを 1 にするよりも、playId を起動ごとにユニークなものにすべきかもしれない。
		reconnectionAttempts: Infinity,
		parser
	});
}
