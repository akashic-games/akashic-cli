const socket = io("ws://" + window.location.host, {
	reconnectionDelay: 1000
});

export function socketInstance(): SocketIOClient.Socket {
	return socket;
}
