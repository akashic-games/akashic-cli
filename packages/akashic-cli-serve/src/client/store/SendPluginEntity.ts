export interface SendMessageEventLike {
	type: string;
}

export class SendPluginEntity {
	send: (message: SendMessageEventLike) => void;

	constructor() {
		this.send = (message: SendMessageEventLike) => {
			console.log("game.external.send: ", message);
		}
	}
}
