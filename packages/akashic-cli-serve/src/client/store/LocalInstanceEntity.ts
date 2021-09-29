import {Trigger} from "@akashic/trigger";
import {action, observable, computed} from "mobx";
import {TimeKeeper} from "../../common/TimeKeeper";
import {PlayAudioStateSummary} from "../../common/types/PlayAudioState";
import {Player} from "../../common/types/Player";
import {GameViewManager} from "../akashic/GameViewManager";
import {ServeGameContent} from "../akashic/ServeGameContent";
import * as ApiRequest from "../api/ApiRequest";
import {ProfilerValue} from "../common/types/Profiler";
import {CoeLimitedPluginEntity} from "./CoeLimitedPluginEntity";
import {CoePluginEntity, CreateCoeLocalInstanceParameterObject} from "./CoePluginEntity";
import {ContentEntity} from "./ContentEntity";
import {ExecutionMode} from "./ExecutionMode";
import {GameInstanceEntity} from "./GameInstanceEntity";
import {NicoPluginEntity} from "./NicoPluginEntity";
import {PlayEntity} from "./PlayEntity";

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
	content: ContentEntity;
	executionMode: ExecutionMode;
	play: PlayEntity;
	player: Player;
	resizeGameView?: boolean;
	argument?: any;
	playToken?: string;
	playlogServerUrl?: string;
	proxyAudio?: boolean;
	coeHandler?: {
		onLocalInstanceCreate: (params: CreateCoeLocalInstanceParameterObject) => Promise<LocalInstanceEntity>;
		onLocalInstanceDelete: (playId: string) => Promise<void>;
	};
}

export class LocalInstanceEntity implements GameInstanceEntity {
	onStop: Trigger<LocalInstanceEntity>;

	@observable player: Player;
	@observable executionMode: ExecutionMode;
	@observable targetTime: number;
	@observable isPaused: boolean;

	readonly play: PlayEntity;
	readonly coePlugin: CoePluginEntity;
	readonly nicoPlugin: NicoPluginEntity;
	readonly content: ContentEntity;
	readonly coeLimitedPlugin: CoeLimitedPluginEntity;

	private _timeKeeper: TimeKeeper;
	private _gameViewManager: GameViewManager;
	private _serveGameContent: ServeGameContent;
	private _resizeGameView: boolean;
	private _initializationWaiter: Promise<void>;

	constructor(params: LocalInstanceEntityParameterObject) {
		this.onStop = new Trigger<LocalInstanceEntity>();
		this.player = params.player;
		this.executionMode = params.executionMode;
		this.play = params.play;
		this.isPaused = false;
		this.content = params.content;
		this._timeKeeper = new TimeKeeper();
		this._gameViewManager = params.gameViewManager;
		this._resizeGameView = !!params.resizeGameView;

		const playConfig: agv.PlaylogConfig = {
			playId: this.play.playId,
			executionMode: toAgvExecutionMode(this.executionMode),
			replayTargetTimeFunc: this._getReplayTargetTime
		};
		let gameLoaderCustomizer: agv.GameLoaderCustomizer = {};
		if (params.playlogServerUrl != null) {
			playConfig.playlogServerUrl = params.playlogServerUrl;
			gameLoaderCustomizer.createCustomAmflowClient = () => this.play.amflow;
		}
		if (params.playToken != null) {
			playConfig.playToken = params.playToken;
		}
		this._serveGameContent = this._gameViewManager.createGameContent({
			contentLocator: this.content.locator,
			player: {
				id: this.player.id,
				name: this.player.name
			},
			playConfig,
			gameLoaderCustomizer,
			argument: params.argument,
			proxyAudio: params.proxyAudio
		});
		if (params.coeHandler != null) {
			this.coePlugin = new CoePluginEntity({
				gameViewManager: this._gameViewManager,
				onLocalInstanceCreate: params.coeHandler.onLocalInstanceCreate,
				onLocalInstanceDelete: params.coeHandler.onLocalInstanceDelete,
				instanceArgument: params.argument
			});
			this.coeLimitedPlugin = new CoeLimitedPluginEntity();
			const agvGameContent = this._serveGameContent.agvGameContent;
			agvGameContent.onExternalPluginRegister.add((name: string) => {
				const game = agvGameContent.getGame();
				if (name === "coe") {
					this.coePlugin.bootstrap(game, agvGameContent);
				} else if (name === "nico") {
					game.external.nico = new NicoPluginEntity();
				} else if (name === "send") {
					game.external.send = (message: any) => {
						console.log("game.external.send: ", message);
					};
				} else if (name === "coeLimited") {
					game.external.coeLimited = this.coeLimitedPlugin;
				}
			});
		}
		this._initializationWaiter = this._initialize();
	}

	assertInitialized(): Promise<void> {
		return this._initializationWaiter;
	}

	@computed
	get playAudioStateSummary(): PlayAudioStateSummary {
		const { muteType, soloPlayerId } = this.play.audioState;
		switch (muteType) {
			case "mute": {
				return "anyone-muted";
			}
			case "solo": {
				return (this.player?.id === soloPlayerId) ? "only-me-unmuted" : "only-someone-unmuted";
			}
			case "none": {
				return "anyone-unmuted";
			}
		}
	}

	@computed
	get isJoined(): boolean {
		return this.play.joinedPlayerTable.has(this.player.id);
	}

	@computed
	get gameViewSize(): {width: number; height: number} {
		return this._gameViewManager.getViewSize();
	}

	get gameContent(): ServeGameContent {
		return this._serveGameContent;
	}

	async start(): Promise<void> {
		await this._gameViewManager.startGameContent(this._serveGameContent);
		this.followPlayAudioStateChange(); // 生成時にすでに指定されていた play.audioState を反映する
		this._timeKeeper.start();
	}

	stop(): Promise<void> {
		if (this.coeLimitedPlugin) {
			this.coeLimitedPlugin.stopToDisplayResolver();
		}
		this._gameViewManager.removeGameContent(this._serveGameContent);
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
		this._serveGameContent.agvGameContent.pause();
		this._timeKeeper.pause();
		this.isPaused = true;
		return Promise.resolve();
	}

	@action
	resume(): Promise<void> {
		if (!this.isPaused)
			return;
		this._serveGameContent.agvGameContent.resume();
		this._timeKeeper.start();
		this.isPaused = false;
		return Promise.resolve();
	}

	@action
	setExecutionMode(mode: ExecutionMode): void {
		if (this.executionMode === mode)
			return;
		this.executionMode = mode;
		this._serveGameContent.agvGameContent.setExecutionMode(toAgvExecutionMode(mode));
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

	@action
	setProfilerValueTrigger(cb: (value: ProfilerValue) => void): void {
		const gameDriver = this._serveGameContent.agvGameContent.getGameDriver();
		if (gameDriver) {
			// TODO gameDriver の中身を触る処理なので ServeGameContent に移すべき
			gameDriver._gameLoop._clock._profiler._calculateProfilerValueTrigger.add(cb);
		} else {
			this._serveGameContent.agvGameContent.addContentLoadListener(() => this.setProfilerValueTrigger(cb));
		}
	}

	followPlayAudioStateChange(): void {
		const { muteType, soloPlayerId } = this.play.audioState;
		const muted = (muteType === "mute") || (muteType === "solo" && this.player?.id !== soloPlayerId);
		this._serveGameContent.agvGameContent.setMasterVolume(muted ? 0 : 1);
	}

	private async _initialize(): Promise<void> {
		if (!this._resizeGameView)
			return;
		const url = this.content.locator.asAbsoluteUrl();
		const contentJson = await ApiRequest.get<{ content_url: string }>(url);
		const gameJson = await ApiRequest.get<{ width: number; height: number }>(contentJson.content_url);
		this._gameViewManager.setViewSize(gameJson.width, gameJson.height);
	}
}
