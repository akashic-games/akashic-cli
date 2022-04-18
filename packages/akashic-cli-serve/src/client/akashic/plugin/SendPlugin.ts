export class SendPlugin implements agv.ExternalPlugin {
	readonly name: string = "send";

	onload(game: any, _dataBus: unknown, _gameContent: agv.GameContent): void {
		game.external.send = (message: any) => {
			console.log("game.external.send: ", message);
		};
	}
}
