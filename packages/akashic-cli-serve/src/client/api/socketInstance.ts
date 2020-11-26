const socket = io("ws://" + window.location.host, {
	reconnectionAttempts: 1
});

export function socketInstance(): SocketIOClient.Socket {
	return socket;
}
