const socket = io("ws://" + window.location.host, {
	// デフォルトはInifinityだが、過去に同じホスト・ポートで起動されたサーバに
	// 接続していたクライアントが生きている(i.e. ブラウザのタブが開いたまま)時、
	// つなぎなおして来てしまうのでやむなく1にしている。(0だとInfinity扱いされる)
	// 本当はここを 1 にするよりも、playId を起動ごとにユニークなものにすべきかもしれない。
	reconnectionAttempts: 1
});

export function socketInstance(): SocketIOClient.Socket {
	return socket;
}
