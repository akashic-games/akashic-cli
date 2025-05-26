import { Trigger } from "@akashic/trigger";
import { callOrThrow } from "../../../common/callOrThrow";
import type { NamagameCommentPlugin } from "../../../common/types/NamagameCommentPlugin";

export class NamagameCommentClientPlugin implements agv.ExternalPlugin {
	readonly name: string = "namagameComment";
	readonly onStartStop: Trigger<boolean> = new Trigger();

	onload(game: agv.GameLike, _dataBus: unknown, _gameContent: agv.GameContent): void {
		let started = false;

		const exposed: NamagameCommentPlugin = {
			start: (_opts, callback) => {
				if (started) {
					callOrThrow(callback, new Error("g.game.namagameComment.start(): already started"));
					return;
				}
				started = true;
				this.onStartStop.fire(true);
				if (callback)
					setTimeout(callback, 0);
			},
			stop: () => {
				if (!started)
					throw new Error("g.game.namagameComment.stop(): not started");
				started = false;
				this.onStartStop.fire(false);
			},
		};
		game.external.namagameComment = exposed;
	}
}
