import { Trigger } from "@akashic/trigger";
import type { NicoliveCommentPlugin } from "../../../common/types/NicoliveCommentPlugin";

export class NicoliveCommentClientPlugin implements agv.ExternalPlugin {
	readonly name: string = "nicoliveComment";
	readonly onStartStop: Trigger<boolean> = new Trigger();

	onload(game: agv.GameLike, _dataBus: unknown, _gameContent: agv.GameContent): void {
		const exposed: NicoliveCommentPlugin = {
			start: (_opts, callback) => {
				this.onStartStop.fire(true);
				if (callback)
					setTimeout(callback, 0);
			},
			stop: () => {
				this.onStartStop.fire(false);
			},
		};
		game.external.nicoliveComment = exposed;
	}
}
