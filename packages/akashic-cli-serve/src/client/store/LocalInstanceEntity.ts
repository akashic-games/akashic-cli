import {action, observable, computed} from "mobx";
import {Trigger} from "@akashic/trigger";
import {TimeKeeper} from "../../common/TimeKeeper";
import {Player} from "../../common/types/Player";
import {GameViewManager} from "../akashic/GameViewManager";
import {PlayEntity} from "./PlayEntity";
import {GameInstanceEntity} from "./GameInstanceEntity";
import {ExecutionMode} from "./ExecutionMode";

const toAgvExecutionMode = (() => {
	const executionModeTable = {
		"active": agv.ExecutionMode.Active,
		"passive": agv.ExecutionMode.Passive,
		"replay": agv.ExecutionMode.Replay
	};
	function toAgvExecutionMode(mode: ExecutionMode): agv.ExecutionMode {
		return executionModeTable[mode];
	}
	return toAgvExecutionMode;
})();

export interface LocalInstanceEntityParameterObject {
	gameViewManager: GameViewManager;
	contentUrl: string;
	playToken: string;
	executionMode: ExecutionMode;
	play: PlayEntity;
	player: Player;
}

export class LocalInstanceEntity implements GameInstanceEntity {
	onStop: Trigger<LocalInstanceEntity>;

	@observable player: Player;
	@observable executionMode: ExecutionMode;
	@observable targetTime: number;
	@observable isPaused: boolean;

	readonly play: PlayEntity;
	readonly contentUrl: string;

	private _timeKeeper: TimeKeeper;
	private _gameViewManager: GameViewManager;
	private _agvGameContent: agv.GameContent;

	constructor(params: LocalInstanceEntityParameterObject) {
		this.onStop = new Trigger<LocalInstanceEntity>();
		this.player = params.player;
		this.executionMode = params.executionMode;
		this.play = params.play;
		this.isPaused = false;
		this.contentUrl = params.contentUrl;
		this._timeKeeper = new TimeKeeper();
		this._gameViewManager = params.gameViewManager;
		this._agvGameContent = this._gameViewManager.createGameContent({
			contentUrl: this.contentUrl,
			player: {
				id: this.player.id,
				name: this.player.name
			},
			playConfig: {
				playId: this.play.playId,
				executionMode: toAgvExecutionMode(this.executionMode),
				replayTargetTimeFunc: this._getReplayTargetTime,
				playlogServerUrl: "dummy-playlog-server-url",
				playToken: params.playToken
			} as agv.PlaylogConfig,
			gameLoaderCustomizer: {
				createCustomAmflowClient: () => this.play.amflow
			}
		});
	}

	@computed
	get isJoined(): boolean {
		return this.play.joinedPlayerTable.has(this.player.id);
	}

	async start(): Promise<void> {
		await this._gameViewManager.startGameContent(this._agvGameContent);
		this._timeKeeper.start();
	}

	stop(): Promise<void> {
		this._gameViewManager.removeGameContent(this._agvGameContent);
		this.onStop.fire(this);
		return Promise.resolve();
	}

	togglePause(pause: boolean): Promise<void> {
		return (pause) ? this.pause() : this.resume();
	}

	@action
	pause(): Promise<void> {
		if (this.isPaused)
			return;
		this._agvGameContent.pause();
		this._timeKeeper.pause();
		this.isPaused = true;
		return Promise.resolve();
	}

	@action
	resume(): Promise<void> {
		if (!this.isPaused)
			return;
		this._agvGameContent.resume();
		this._timeKeeper.start();
		this.isPaused = false;
		return Promise.resolve();
	}

	@action
	setExecutionMode(mode: ExecutionMode): void {
		if (this.executionMode === mode)
			return;
		this.executionMode = mode;
		this._agvGameContent.setExecutionMode(toAgvExecutionMode(mode));
	}

	@action
	setTargetTime(targetTime?: number): void {
		this._timeKeeper.setTime(targetTime);
		this.targetTime = Math.min(this._timeKeeper.now(), this.play.duration);
	}

	@action.bound
	_getReplayTargetTime(): number {
		const t = Math.min(this._timeKeeper.now(), this.play.duration);
		this.targetTime = t;
		return t;
	}
}
