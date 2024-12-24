import * as playlog from "@akashic/playlog";
import { Trigger } from "@akashic/trigger";
import type { ObservableMap } from "mobx";
import { observable, action } from "mobx";
import { TimeKeeper } from "../../common/TimeKeeper";
import type { PlayPatchApiResponse } from "../../common/types/ApiResponse";
import type { NicoliveCommentEventComment } from "../../common/types/NicoliveCommentPlugin";
import type { PlayAudioState } from "../../common/types/PlayAudioState";
import type { PlayDurationState } from "../../common/types/PlayDurationState";
import type { Player } from "../../common/types/Player";
import type { PlayStatus } from "../../common/types/PlayStatus";
import type { StartPointHeader } from "../../common/types/StartPointHeader";
import type { RunnerDescription, ClientInstanceDescription } from "../../common/types/TestbedEvent";
import type { GameViewManager } from "../akashic/GameViewManager";
import { SocketIOAMFlowClient } from "../akashic/SocketIOAMFlowClient";
import { apiClient } from "../api/apiClientInstance";
import { socketInstance } from "../api/socketInstance";
import type { ScenarioEventData } from "../common/types/ScenarioEventData";
import type { ContentEntity } from "./ContentEntity";
import type { ExecutionMode } from "./ExecutionMode";
import { LocalInstanceEntity } from "./LocalInstanceEntity";
import { ServerInstanceEntity } from "./ServerInstanceEntity";

export interface CreateLocalInstanceParameterObject {
	executionMode: ExecutionMode;
	player: Player;
	playId: string;
	playToken?: string;
	playlogServerUrl?: string;
	argument?: any;
	initialEvents?: playlog.Event[];
	proxyAudio?: boolean;
	runInIframe?: boolean;
	useNonDebuggableScript?: boolean;
	resizeGameView?: boolean;
}

export interface CreateServerInstanceParameterObject {
	playToken: string;
	isPaused: boolean;
}

export interface PlayEntityParameterObject {
	gameViewManager: GameViewManager;
	playId: string;
	status: PlayStatus;
	joinedPlayers?: Player[];
	content: ContentEntity;
	runners?: RunnerDescription[];
	clientInstances?: ClientInstanceDescription[];
	durationState?: PlayDurationState;
	audioState?: PlayAudioState;
	parent?: PlayEntity;
	startPointHeaders?: StartPointHeader[];
}

export class PlayEntity {
	onTeardown: Trigger<PlayEntity>;

	readonly playId: string;
	readonly amflow: SocketIOAMFlowClient;
	readonly content: ContentEntity;

	@observable activePlaybackRate: number;
	@observable isActivePausing: boolean;
	@observable duration: number;

	@observable clientInstances: ClientInstanceDescription[];
	@observable joinedPlayerTable: ObservableMap;
	@observable status: PlayStatus;
	@observable startPointHeaders: StartPointHeader[];
	@observable audioState: PlayAudioState;

	@observable localInstances: LocalInstanceEntity[];
	@observable serverInstances: ServerInstanceEntity[];

	private readonly _gameViewManager: GameViewManager;
	private readonly _timeKeeper: TimeKeeper;
	private _serverInstanceWaiters: {[key: string]: (p: ServerInstanceEntity) => void };
	private _timerId: number | null;
	private _parent?: PlayEntity;

	constructor(param: PlayEntityParameterObject) {
		this.playId = param.playId;
		this.amflow = new SocketIOAMFlowClient(socketInstance);
		this.activePlaybackRate = 1;
		this.isActivePausing = !!param.durationState && param.durationState.isPaused;
		this.duration = param.durationState ? param.durationState.duration : 0;
		this.clientInstances = param.clientInstances ?? [];
		this.startPointHeaders = param.startPointHeaders ?? [];
		this.joinedPlayerTable = observable.map((param.joinedPlayers || []).map(p => [p.id, p] as [string, Player]));
		this.status = param.status;
		this.audioState = param.audioState ?? { muteType: "none" };
		this.localInstances = [];
		this.serverInstances = !param.runners ? [] : param.runners.map(desc => {
			return new ServerInstanceEntity({ runnerId: desc.runnerId, play: this });
		});
		this.onTeardown = new Trigger();
		this.content = param.content;
		this._gameViewManager = param.gameViewManager;
		this._timeKeeper = new TimeKeeper();
		this._serverInstanceWaiters = {};
		this._timerId = null;

		if (param.parent) {
			this._parent = param.parent;
			this._parent.onTeardown.addOnce(this._handleParentTeardown);
		}

		if (param.durationState) {
			this._timeKeeper.setTime(param.durationState.duration);
			if (!param.durationState.isPaused) {
				this._startTimeKeeper();
			}
		}
	}

	deleteAllServerInstances(): Promise<void[]> {
		return Promise.all(this.serverInstances.map(instance => instance.stop()));
	}

	async suspend(): Promise<void> {
		await this.deleteAllServerInstances();
		await apiClient.suspendPlay(this.playId);
	}

	async createLocalInstance(param: CreateLocalInstanceParameterObject): Promise<LocalInstanceEntity> {
		const i = new LocalInstanceEntity({
			play: this,
			content: this.content,
			gameViewManager: this._gameViewManager,
			...param
		});
		i.onStop.add(this._handleLocalInstanceStopped);
		this.localInstances.push(i);
		await i.assertInitialized();
		return i;
	}

	async deleteAllLocalInstances(): Promise<void> {
		await Promise.all<void>(this.localInstances.map(i => {
			i.onStop.removeAll({ func: this._handleLocalInstanceStopped });
			return i.stop();
		}));
		this.localInstances = [];
	}

	async createServerInstance(param: CreateServerInstanceParameterObject): Promise<ServerInstanceEntity> {
		const runnerResult = await apiClient.createRunner(this.playId, true, param.playToken, param.isPaused);
		const runnerId = runnerResult.data.runnerId;

		// apiClient.createRunner() に対する onRunnerCreate 通知が先行していれば、この時点で ServerInstanceEntity が生成済みになっている
		const rs = this.serverInstances.filter(r => r.runnerId === runnerId);
		if (rs.length > 0)
			return rs[0];

		// でなければ、onRunnerCreate 通知(が来て ServerInstanceEntity が生成される)を待つ
		const instance = await (new Promise<ServerInstanceEntity>(resolve => (this._serverInstanceWaiters[runnerId] = resolve)));
		delete this._serverInstanceWaiters[runnerId];
		return instance;
	}

	join(playerId: string, name?: string): void {
		const highestPriority = 3;
		this.amflow.enqueueEvent([
			// @ts-expect-error src/clent/ は isolatedModules: true なので const enum の EventCode がエラーになるが、
			// 実際は playlog が preserveConstEnums でビルドされているため問題にならない。
			playlog.EventCode.Join,
			highestPriority,
			playerId,
			name
		]);
	}

	leave(playerId: string): void {
		const highestPriority = 3;
		this.amflow.enqueueEvent([
			// @ts-expect-error src/clent/ は isolatedModules: true なので const enum の EventCode がエラーになるが、
			// 実際は playlog が preserveConstEnums でビルドされているため問題にならない。
			playlog.EventCode.Leave,
			highestPriority,
			playerId
		]);
	}

	sendScenarioEvent(playerId: string, data: ScenarioEventData): void {
		this.amflow.sendEvent([
			// @ts-expect-error src/clent/ は isolatedModules: true なので const enum の EventCode がエラーになるが、
			// 実際は playlog が preserveConstEnums でビルドされているため問題にならない。
			playlog.EventCode.Message,
			0,
			playerId,
			data
		]);
	}

	pauseActive(): Promise<PlayPatchApiResponse> {
		// 手抜き実装: サーバインスタンスは全てアクティブ(つまり一つしかない)前提
		this.serverInstances.forEach(si => si.pause());
		return apiClient.pausePlayDuration(this.playId);
	}

	resumeActive(): Promise<PlayPatchApiResponse> {
		// 手抜き実装: サーバインスタンスは全てアクティブ(つまり一つしかない)前提
		this.serverInstances.forEach(si => si.resume());
		return apiClient.resumePlayDuration(this.playId);
	}

	stepActive(): Promise<PlayPatchApiResponse> {
		// 手抜き実装: サーバインスタンスは全てアクティブ(つまり一つしかない)前提
		this.serverInstances.forEach(si => si.step());
		return apiClient.stepPlayDuration(this.playId);
	}

	muteAll(): Promise<void> {
		return apiClient.changePlayAudioState(this.playId, { muteType: "all" });
	}

	muteOthers(): Promise<void> {
		const soloPlayerId = this.localInstances[0]?.player?.id;
		return apiClient.changePlayAudioState(this.playId, { muteType: "solo", soloPlayerId });
	}

	unmuteAll(): Promise<void> {
		return apiClient.changePlayAudioState(this.playId, { muteType: "none" });
	}

	async sendNicoliveCommentByTemplate(templateName: string): Promise<void> {
		await apiClient.requestToSendNicoliveCommentByTemplate(this.playId, templateName);
	}

	async sendNicoliveComment(comment: NicoliveCommentEventComment): Promise<void> {
		await apiClient.requestToSendNicoliveComment(this.playId, comment);
	}

	@action
	handlePlayerJoin(player: Player): void {
		this.joinedPlayerTable.set(player.id, player);
	}

	@action
	handlePlayerLeave(playerId: string): void {
		this.joinedPlayerTable.delete(playerId);
	}

	@action
	handleClientInstanceAppear(instanceDesc: ClientInstanceDescription): void {
		this.clientInstances.push(instanceDesc);
	}

	@action
	handleClientInstanceDisappear(instanceDesc: ClientInstanceDescription): void {
		this.clientInstances = this.clientInstances.filter(i => i.id !== instanceDesc.id);
	}

	@action
	handlePlayStatusChange(status: PlayStatus): void {
		this.status = status;
	}

	@action
	handlePlayDurationStateChange(isPaused: boolean, duration?: number): void {
		if (isPaused) {
			this._pauseTimeKeeper();
		} else {
			this._startTimeKeeper();
		}
		if (duration != null) {
			this._timeKeeper.setTime(duration);
		}
	}

	@action
	handlePlayAudioStateChange(audioState: PlayAudioState): void {
		this.audioState = audioState;
		this.localInstances.forEach(li => li.followPlayAudioStateChange());
	}

	@action
	handleRunnerCreate(runnerId: string): void {
		const instance = new ServerInstanceEntity({ runnerId, play: this });
		this.serverInstances.push(instance);
		if (this._serverInstanceWaiters[runnerId]) {
			this._serverInstanceWaiters[runnerId](instance);
		}
	}

	@action
	handleRunnerRemove(runnerId: string): void {
		this.serverInstances = this.serverInstances.filter(i => i.runnerId !== runnerId);
	}

	@action
	handleRunnerPause(): void {
		// TODO ServerInstanceEntity#isPaused を持たせる
		// 現状のこの処理は1プレイ内にサーバインスタンスがアクティブ一つしかない前提
		this.isActivePausing = true;
	}

	@action
	handleRunnerResume(): void {
		this.isActivePausing = false;
	}

	@action
	handleStartPointHeader(startPointHeader: StartPointHeader): void {
		this.startPointHeaders.push(startPointHeader);
	}

	async teardown(): Promise<void> {
		this._pauseTimeKeeper();
		await this.deleteAllLocalInstances();
		await this.deleteAllServerInstances();
		this.onTeardown.fire(this);
	}

	private _handleLocalInstanceStopped = (instance: LocalInstanceEntity): void => {
		this.localInstances = this.localInstances.filter(i => i !== instance);
	};

	private _startTimeKeeper(): void {
		this._timeKeeper.start();
		this._timerId = window.setInterval(this._handleFrame, 200);
	}

	private _pauseTimeKeeper(): void {
		this._timeKeeper.pause();
		if (this._timerId) {
			// cancelAnimationFrame(this._timerId);
			window.clearInterval(this._timerId);
			this._timerId = null;
		}
	}

	private _handleParentTeardown = (): Promise<void> => {
		return this.teardown();
	};

	/* eslint-disable @typescript-eslint/indent */
	// annotation の次行の関数式でインデントエラーとなるため disable とする。
	@action
	private _handleFrame = (): void => {
		this.duration = this._timeKeeper.now();
		// this._timerId = setTimeout(this._handleFrame, 200);
	};
	/* eslint-enable @typescript-eslint/indent */
}
