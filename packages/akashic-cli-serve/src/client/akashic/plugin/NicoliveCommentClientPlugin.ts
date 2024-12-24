import { Trigger } from "@akashic/trigger";
import { callOrThrow } from "../../../common/callOrThrow";
import type { NicoliveCommentPlugin } from "../../../common/types/NicoliveCommentPlugin";

export class NicoliveCommentClientPlugin implements agv.ExternalPlugin {
	readonly name: string = "nicoliveComment";
	readonly onStartStop: Trigger<boolean> = new Trigger();

	onload(game: agv.GameLike, _dataBus: unknown, _gameContent: agv.GameContent): void {
		let started = false;

		const exposed: NicoliveCommentPlugin = {
			start: (_opts, callback) => {
				if (started) {
					callOrThrow(callback, new Error("g.game.nicoliveComment.start(): already started"));
					return;
				}
				started = true;
				this.onStartStop.fire(true);
				if (callback)
					setTimeout(callback, 0);
			},
			stop: () => {
				if (!started)
					throw new Error("g.game.nicoliveComment.stop(): not started");
				started = false;
				this.onStartStop.fire(false);
			},
		};
		game.external.nicoliveComment = exposed;
	}
}
