import { GameViewManager } from "../akashic/GameViewManager";

export class ExternalPluginOperator {
	constructor(gameViewManager: GameViewManager) {
		gameViewManager.registerExternalPlugin({
			name: "coe",
			onload: (_game: agv.GameLike, _dataBus: any, gameContent: agv.GameContent) => {
				gameContent.onExternalPluginRegister.fire("coe");
				gameContent.onExternalPluginRegister.fire("nico");
				gameContent.onExternalPluginRegister.fire("send");
			}
		});
	}
}
