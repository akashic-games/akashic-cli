import { observable, action, ObservableMap } from "mobx";
import * as playlog from "@akashic/playlog";
import { TimeKeeper } from "../../common/TimeKeeper";
import { PlayStatus } from "../../common/types/PlayStatus";
import { PlayDurationState } from "../../common/types/PlayDurationState";
import { RunnerDescription, ClientInstanceDescription } from "../../common/types/TestbedEvent";
import * as ApiClient from "../api/ApiClient";
import { socketInstance } from "../api/socketInstance";
import { GameViewManager } from "../akashic/GameViewManager";
import { SocketIOAMFlowClient } from "../akashic/SocketIOAMFlowClient";
import { Player } from "../../common/types/Player";
import { ExecutionMode } from "./ExecutionMode";
import { LocalInstanceEntity } from "./LocalInstanceEntity";
import { ServerInstanceEntity } from "./ServerInstanceEntity";

export interface CreateLocalInstanceParameterObject {
	gameViewManager: GameViewManager;
	playToken: string;
	executionMode: ExecutionMode;
	player: Player;
	contentUrl?: string;
}

export interface CreateServerInstanceParameterObject {
	playToken: string;
}

export interface PlayEntityParameterObject {
	playId: string;
	joinedPlayers?: Player[];
	contentUrl: string;  // 今のところ不使用だが渡しておく
	clientContentUrl: string;
	runners?: RunnerDescription[];
	clientInstances?: ClientInstanceDescription[];
	durationState?: PlayDurationState;
}

export class PlayEntity {
	readonly playId: string;
	readonly amflow: SocketIOAMFlowClient;

	@observable activePlaybackRate: number;
	@observable isActivePausing: boolean;
	@observable duration: number;

	@observable clientInstances: ClientInstanceDescription[];
	@observable joinedPlayerTable: ObservableMap;
	@observable status: PlayStatus;

	@observable localInstances: LocalInstanceEntity[];
	@observable serverInstances: ServerInstanceEntity[];

	private readonly _timeKeeper: TimeKeeper;
	private readonly _clientContentUrl: string;
	private _serverInstanceWaiters: {[key: string]: (p: ServerInstanceEntity) => void };
	private _timerId: any;

	constructor(param: PlayEntityParameterObject) {
		this.playId = param.playId;
		this.amflow = new SocketIOAMFlowClient(socketInstance());
		this.activePlaybackRate = 1;
		this.isActivePausing = !!param.durationState && param.durationState.isPaused;
		this.duration = param.durationState ? param.durationState.duration : 0;
		this.clientInstances = param.clientInstances || [];
		this.joinedPlayerTable = observable.map((param.joinedPlayers || []).map(p => [p.id, p]));
		this.status = "preparing";
		this.localInstances = [];
		this.serverInstances = !param.runners ? [] : param.runners.map(desc => new ServerInstanceEntity({ runnerId: desc.runnerId, play: this }));
		this._timeKeeper = new TimeKeeper();
		this._clientContentUrl = param.clientContentUrl!;
		this._serverInstanceWaiters = {};
		this._timerId = null;

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
		await ApiClient.suspendPlay(this.playId);
	}

	async createLocalInstance(param: CreateLocalInstanceParameterObject): Promise<LocalInstanceEntity> {
		const i = new LocalInstanceEntity({ play: this, contentUrl: this._clientContentUrl, ...param });
		i.onStop.add(this._handleLocalInstanceStopped);
		this.localInstances.push(i);
		await i.start();
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
		const runnerResult = await ApiClient.createRunner(this.playId, true, param.playToken);
		const runnerId = runnerResult.data.runnerId;

		// ApiClient.createRunner() に対する onRunnerCreate 通知が先行していれば、この時点で ServerInstanceEntity が生成済みになっている
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
		this.amflow.sendEvent([playlog.EventCode.Join, highestPriority, playerId, name]);
	}

	leave(playerId: string): void {
		const highestPriority = 3;
		this.amflow.sendEvent([playlog.EventCode.Leave, highestPriority, playerId]);
	}

	pauseActive(): void {
		// 手抜き実装: サーバインスタンスは全てアクティブ(つまり一つしかない)前提
		this.serverInstances.forEach(si => si.pause());
		ApiClient.pausePlayDuration(this.playId);
	}

	resumeActive(): void {
		// 手抜き実装: サーバインスタンスは全てアクティブ(つまり一つしかない)前提
		this.serverInstances.forEach(si => si.resume());
		ApiClient.resumePlayDuration(this.playId);
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

	teardown(): void {
		this._pauseTimeKeeper();
	}

	private _handleLocalInstanceStopped = (instance: LocalInstanceEntity): void => {
		this.localInstances = this.localInstances.filter(i => i !== instance);
	}

	private _startTimeKeeper(): void {
		this._timeKeeper.start();
		this._timerId = setInterval(this._handleFrame, 200);
	}

	private _pauseTimeKeeper(): void {
		this._timeKeeper.pause();
		if (this._timerId) {
			// cancelAnimationFrame(this._timerId);
			clearInterval(this._timerId);
			this._timerId = null;
		}
	}

	@action
	private _handleFrame = (): void => {
		this.duration = this._timeKeeper.now();
		// this._timerId = setTimeout(this._handleFrame, 200);
	}
}
