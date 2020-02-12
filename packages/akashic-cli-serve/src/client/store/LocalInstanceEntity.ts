import {action, observable, computed} from "mobx";
import {Trigger} from "@akashic/trigger";
import {TimeKeeper} from "../../common/TimeKeeper";
import {Player} from "../../common/types/Player";
import * as ApiRequest from "../api/ApiRequest";
import {GameViewManager} from "../akashic/GameViewManager";
import {ServeGameContent} from "../akashic/ServeGameContent";
import {PlayEntity} from "./PlayEntity";
import {CoePluginEntity, CreateCoeLocalInstanceParameterObject} from "./CoePluginEntity";
import {GameInstanceEntity} from "./GameInstanceEntity";
import {ExecutionMode} from "./ExecutionMode";
import {ContentEntity} from "./ContentEntity";
import {NicoPluginEntity} from "./NicoPluginEntity";
import {Store} from "./Store";
import { GameConfiguration } from "../../common/types/GameConfiguration";

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
	store: Store;
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

	private _timeKeeper: TimeKeeper;
	private _gameViewManager: GameViewManager;
	private _serveGameContent: ServeGameContent;
	private _resizeGameView: boolean;

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
			proxyAudio: params.proxyAudio,
			store: params.store
		});
		if (params.coeHandler != null) {
			this.coePlugin = new CoePluginEntity({
				gameViewManager: this._gameViewManager,
				onLocalInstanceCreate: params.coeHandler.onLocalInstanceCreate,
				onLocalInstanceDelete: params.coeHandler.onLocalInstanceDelete,
				instanceArgument: params.argument
			});
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
				}
			});
		}
	}

	@computed
	get isJoined(): boolean {
		return this.play.joinedPlayerTable.has(this.player.id);
	}

	@computed
	get gameViewSize(): {width: number, height: number} {
		return this._gameViewManager.getViewSize();
	}

	get gameContent(): ServeGameContent {
		return this._serveGameContent;
	}

	async start(): Promise<void> {
		if (this._resizeGameView) {
			const url = this.content.locator.asAbsoluteUrl();
			const contentJson = await ApiRequest.get<{ content_url: string }>(url);
			const gameJson = await ApiRequest.get<GameConfiguration>(contentJson.content_url);
			this.content.setGameJson(gameJson);
			this._gameViewManager.setViewSize(gameJson.width, gameJson.height);
		}

		await this._gameViewManager.startGameContent(this._serveGameContent);
		this._timeKeeper.start();
	}

	stop(): Promise<void> {
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
}
