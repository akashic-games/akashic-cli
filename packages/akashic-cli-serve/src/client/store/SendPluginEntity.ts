export interface SendMessageEventLike {
	type: string;
}

export class SendPluginEntity {

	async bootstrap(game: agv.GameLike, _gameContent: agv.GameContent): Promise<void> {
		console.log("send bootstrap");
		game.external.send = this.send;
	}

	send = (message: SendMessageEventLike) => {
		console.log("game.external.send: ", message);
	}

}
