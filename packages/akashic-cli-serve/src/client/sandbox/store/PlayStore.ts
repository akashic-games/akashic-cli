import { observable } from "mobx";
import type { DumpedPlaylog } from "../../../common/types/DumpedPlaylog";
import type { PlayDurationState } from "../../../common/types/PlayDurationState";
import type { GameViewManager } from "../../akashic/GameViewManager";
import type { ServeMemoryAmflowClient } from "../../akashic/ServeMemoryAMFlowClient";
import type { ContentEntity } from "../../store/ContentEntity";
import { PlayEntity } from "../../store/PlayEntity";

export interface PlayStoreParameterObject {
	gameViewManager: GameViewManager;
}

export interface CreatePlayParameterObject {
	playId: string;
	content: ContentEntity;
	amflow: ServeMemoryAmflowClient;
	playlog?: DumpedPlaylog;
	durationState?: PlayDurationState;
}

export class PlayStore {
	@observable plays: Record<string, PlayEntity>;
	private _gameViewManager: GameViewManager;

	constructor(param: PlayStoreParameterObject) {
		this.plays = Object.create(null);
		this._gameViewManager = param.gameViewManager;
	}

	createStandalonePlay = async (param: CreatePlayParameterObject): Promise<PlayEntity> => {
		const { playId, content, amflow, playlog, durationState } = param;

		if (this.plays[playId])
			return this.plays[playId];

		const playEntity = new PlayEntity({
			gameViewManager: this._gameViewManager,
			playId,
			status: "running",
			content,
			amflow,
			disableFastForward: !!playlog,
			durationState,
		});
		amflow.onPutStartPoint.add(playEntity.handleStartPointHeader, playEntity);

		this.plays[playId] = playEntity;

		return playEntity;
	};

	deletePlay = async (playId: string): Promise<void> => {
		const play = this.plays[playId];
		if (play == null)
			throw new Error("Play not found: " + playId);

		await play.teardown();
	};
}
