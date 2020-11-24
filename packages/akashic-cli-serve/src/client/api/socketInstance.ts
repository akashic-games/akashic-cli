const socket = io("ws://" + window.location.host, {
	reconnectionAttempts: 1800,
	reconnectionDelay: 1000
});

export function socketInstance(): SocketIOClient.Socket {
	return socket;
}
