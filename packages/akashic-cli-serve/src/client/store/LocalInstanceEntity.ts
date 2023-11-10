import type * as amf from "@akashic/amflow";
import type * as pl from "@akashic/playlog";
import { Trigger } from "@akashic/trigger";
import { action, observable, computed } from "mobx";
import { TimeKeeper } from "../../common/TimeKeeper";
import type { PlayAudioStateSummary } from "../../common/types/PlayAudioState";
import type { Player } from "../../common/types/Player";
import type { GameViewManager } from "../akashic/GameViewManager";
import type { RuntimeWarning } from "../akashic/RuntimeWarning";
import type { ServeGameContent } from "../akashic/ServeGameContent";
import * as ApiRequest from "../api/ApiRequest";
import type { ProfilerValue } from "../common/types/Profiler";
import type { ScreenSize } from "../common/types/ScreenSize";
import type { ContentEntity } from "./ContentEntity";
import type { ExecutionMode } from "./ExecutionMode";
import type { GameInstanceEntity } from "./GameInstanceEntity";
import type { PlayEntity } from "./PlayEntity";
import "../AkashicServeWindow";

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
	initialEvents?: pl.Event[];
	playToken?: string;
	playlogServerUrl?: string;
	proxyAudio?: boolean;
	runInIframe?: boolean;
	useNonDebuggableScript?: boolean;
}

export class LocalInstanceEntity implements GameInstanceEntity {
	onStop: Trigger<LocalInstanceEntity>;
	onWarn: Trigger<RuntimeWarning>;

	@observable player: Player;
	@observable executionMode: ExecutionMode;
	@observable targetTime: number;
	@observable resetTime: number;
	@observable isPaused: boolean;
	@observable intrinsicSize: ScreenSize;

	readonly play: PlayEntity;
	readonly content: ContentEntity;

	private _timeKeeper: TimeKeeper;
	private _gameViewManager: GameViewManager;
	private _serveGameContent: ServeGameContent;
	private _resizeGameView: boolean;
	private _initializationWaiter: Promise<void>;

	constructor(params: LocalInstanceEntityParameterObject) {
		this.onStop = new Trigger<LocalInstanceEntity>();
		this.onWarn = new Trigger<RuntimeWarning>();
		this.player = params.player;
		this.executionMode = params.executionMode;
		this.targetTime = 0; // 値は _timeKeeper を元に更新される
		this.resetTime = 0;
		this.play = params.play;
		this.isPaused = false;
		this.intrinsicSize = { width: 0, height: 0 };
		this.content = params.content;
		this._timeKeeper = new TimeKeeper();
		this._gameViewManager = params.gameViewManager;
		this._resizeGameView = !!params.resizeGameView;

		const playConfig: agv.PlaylogConfig = {
			playId: this.play.playId,
			executionMode: toAgvExecutionMode(this.executionMode),
			replayTargetTimeFunc: this._getReplayTargetTime
		};
		const gameLoaderCustomizer: agv.GameLoaderCustomizer = {};
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
			initialEvents: params.initialEvents,
			proxyAudio: params.proxyAudio,
			runInIframe: params.runInIframe,
			useNonDebuggableScript: params.useNonDebuggableScript
		});
		this._serveGameContent.onReset.add(this._handleReset, this);
		this._initializationWaiter = this._initialize();
	}

	assertInitialized(): Promise<void> {
		return this._initializationWaiter;
	}

	@computed
	get playAudioStateSummary(): PlayAudioStateSummary {
		const audioState = this.play.audioState;
		switch (audioState.muteType) {
			case "all": {
				return "all-player-muted";
			}
			case "solo": {
				return (this.player?.id === audioState.soloPlayerId) ?
					"only-this-player-unmuted" :
					"only-other-player-unmuted";
			}
			case "none": {
				return "all-player-unmuted";
			}
		}
	}

	@computed
	get isJoined(): boolean {
		return this.play.joinedPlayerTable.has(this.player.id);
	}

	@computed
	get isResettable(): boolean {
		return this._serveGameContent.isResettable();
	}

	get gameContent(): ServeGameContent {
		return this._serveGameContent;
	}

	async start(): Promise<void> {
		this._serveGameContent.onWarn.add(this.onWarn.fire, this.onWarn);
		window.akashicServe.scriptHelper.onScriptWarn.add(this.onWarn.fire, this.onWarn);
		await this._gameViewManager.startGameContent(this._serveGameContent);
		this.followPlayAudioStateChange(); // 生成時にすでに指定されていた play.audioState を反映する
		this._timeKeeper.start();
	}

	stop(): Promise<void> {
		this._gameViewManager.removeGameContent(this._serveGameContent);
		this._serveGameContent.onWarn.remove(this.onWarn.fire, this.onWarn);
		window.akashicServe.scriptHelper.onScriptWarn.remove(this.onWarn.fire, this.onWarn);
		this.onStop.fire(this);
		return Promise.resolve();
	}

	/**
	 * ローカルインスタンスの内部状態を startPoint でリセットする。
	 * 内部状態が変化するだけで、targetTime はそのままであることに注意。
	 * (リセット後また targetTime に向けて進行する)
	 *
	 * isResettable が真でない場合、何もしない。
	 */
	reset(startPoint: amf.StartPoint): void {
		if (!this.isResettable)
			return;
		this._serveGameContent.reset(startPoint);
	}

	togglePause(pause: boolean): Promise<void> {
		return (pause) ? this.pause() : this.resume();
	}

	@action
	pause(): Promise<void> {
		if (this.isPaused)
			return Promise.resolve();
		this._serveGameContent.agvGameContent.pause();
		this._timeKeeper.pause();
		this.isPaused = true;
		return Promise.resolve();
	}

	@action
	resume(): Promise<void> {
		if (!this.isPaused)
			return Promise.resolve();
		this._serveGameContent.agvGameContent.resume();
		this._timeKeeper.start();
		this.isPaused = false;
		return Promise.resolve();
	}

	/**
	 * 擬似ポーズ。
	 *
	 * 外部観測的にはポーズと同じだが、_timeKeeper だけを止めるので、インスタンスは _timeKeeper.now() まで進む。
	 * ゲーム開始時に特定時間まで進めてポーズしたい場合に使う。
	 * (通常ポーズではインスタンスが完全に止まるので目的の時間まで進められない)
	 */
	@action
	targetTimePause(): void {
		if (this.isPaused)
			return;
		this._timeKeeper.pause();
		this.isPaused = true;
	}

	@action
	setExecutionMode(mode: ExecutionMode): void {
		if (this.executionMode === mode)
			return;
		this.executionMode = mode;
		this._serveGameContent.agvGameContent.setExecutionMode(toAgvExecutionMode(mode));
	}

	@action
	setTargetTime(targetTime: number): void {
		this._timeKeeper.setTime(targetTime);
		this.targetTime = Math.min(this._timeKeeper.now(), this.play.duration);
	}

	@action.bound
	_getReplayTargetTime(): number {
		const t = Math.min(this._timeKeeper.now(), this.play.duration);
		this.targetTime = t;
		return t;
	}

	setProfilerValueTrigger(cb: (value: ProfilerValue) => void): void {
		this._serveGameContent.setProfilerValueTrigger(cb);
	}

	followPlayAudioStateChange(): void {
		const audioState = this.play.audioState;
		const muted = (
			(audioState.muteType === "all") ||
			(audioState.muteType === "solo" && this.player?.id !== audioState.soloPlayerId)
		);
		this._serveGameContent.agvGameContent.setMasterVolume(muted ? 0 : 1);
	}

	makeScreenshotData(): string {
		return this._serveGameContent.makeScreenShotData();
	}

	private async _initialize(): Promise<void> {
		if (!this._resizeGameView)
			return;
		const url = this.content.locator.asAbsoluteUrl();
		const contentJson = await ApiRequest.get<{ content_url: string }>(url);
		const gameJson = await ApiRequest.get<{ width: number; height: number }>(contentJson.content_url);
		this.intrinsicSize = { width: gameJson.width, height: gameJson.height };
	}

	@action
	private _handleReset(sp: amf.StartPoint): void {
		const startedAt = this.play.amflow.getStartedAt();
		if (startedAt != null)
			this.resetTime = sp.timestamp - startedAt;
	}
}
