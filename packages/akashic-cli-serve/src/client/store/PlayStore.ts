import { observable } from "mobx";
import type { ContentLocatorData } from "../../common/types/ContentLocatorData";
import type { Player } from "../../common/types/Player";
import type {
	PlayCreateTestbedEvent,
	PlayStatusChangedTestbedEvent,
	PlayDurationStateChangeTestbedEvent,
	PlayerJoinTestbedEvent,
	PlayerLeaveTestbedEvent,
	RunnerCreateTestbedEvent,
	RunnerRemoveTestbedEvent,
	RunnerPauseTestbedEvent,
	RunnerResumeTestbedEvent,
	ClientInstanceAppearTestbedEvent,
	ClientInstanceDisappearTestbedEvent,
	PutStartPointEvent,
	PlayAudioStateChangeTestbedEvent
} from "../../common/types/TestbedEvent";
import type { GameViewManager } from "../akashic/GameViewManager";
import { apiClient } from "../api/apiClientInstance";
import * as Subscriber from "../api/Subscriber";
import type { ClientContentLocator } from "../common/ClientContentLocator";
import type { ContentStore } from "./ContentStore";
import { PlayEntity } from "./PlayEntity";

export interface PlayStoreParameterObject {
	contentStore: ContentStore;
	gameViewManager: GameViewManager;
}

export interface CreatePlayParameterObject {
	contentLocator: ContentLocatorData;
	parent?: PlayEntity;
	initialJoinPlayer?: Player;
	inheritsJoinedFromLatest?: boolean;
	inheritsAudioFromLatest?: boolean;
}

export interface CreateStandalonePlayParameterObject {
	contentLocator: ClientContentLocator;

	// TODO xnv create が playId を引数にとるのはおかしい。sessionId の管理は Play から切り離す。
	playId: string;
	parent?: PlayEntity;
}

export class PlayStore {
	@observable plays: {[key: string]: PlayEntity};
	private _gameViewManager: GameViewManager;
	private _lastPlayId: string | null;
	private _contentStore: ContentStore;
	private _creationWaiters: {[key: string]: (p: PlayEntity) => void };
	private _initializationWaiter: Promise<void>;

	constructor(param: PlayStoreParameterObject) {
		this.plays = Object.create(null);
		this._gameViewManager = param.gameViewManager;
		this._lastPlayId = null;
		this._contentStore = param.contentStore;
		this._creationWaiters = Object.create(null);
		this._initializationWaiter = this._contentStore.assertInitialized()
			.then(() => apiClient.getPlays())
			.then((res) => {
				const playsInfo = res.data;
				return Promise.all(playsInfo.map((playInfo) => {
					return apiClient.getStartPointHeaderList(playInfo.playId)
						.then((res) => {
							return {
								playInfo,
								startPointHeaders: res.data.startPointHeaderList
							};
						});
				}));
			})
			.then(async res => {
				for (const o of res) {
					this.plays[o.playInfo.playId] = new PlayEntity({
						...o.playInfo,
						gameViewManager: this._gameViewManager,
						content: this._contentStore.find(o.playInfo.contentLocatorData),
						startPointHeaders: o.startPointHeaders
					});
				}
				if (res.length > 0)
					this._lastPlayId = res[res.length - 1].playInfo.playId;
				Subscriber.onPlayCreate.add(this.handlePlayCreate);
				Subscriber.onPlayStatusChange.add(this.handlePlayStatusChange);
				Subscriber.onPlayDurationStateChange.add(this.handlePlayDurationStateChange);
				Subscriber.onPlayAudioStateChange.add(this.handlePlayAudioStateChange);
				Subscriber.onPlayerJoin.add(this.handlePlayerJoin);
				Subscriber.onPlayerLeave.add(this.handlePlayerLeave);
				Subscriber.onClientInstanceAppear.add(this.handleClientInstanceAppear);
				Subscriber.onClientInstanceDisappear.add(this.handleClientInstanceDisappear);
				Subscriber.onRunnerCreate.add(this.handleRunnerCreate);
				Subscriber.onRunnerRemove.add(this.handleRunnerRemove);
				Subscriber.onRunnerPause.add(this.handleRunnerPause);
				Subscriber.onRunnerResume.add(this.handleRunnerResume);
				Subscriber.onPutStartPoint.add(this.handlePutStartPoint);
			});
	}

	assertInitialized(): Promise<void> {
		return this._initializationWaiter;
	}

	getLastPlay(): PlayEntity | null {
		return this._lastPlayId ? this.plays[this._lastPlayId] : null;
	}

	async createPlay(param: CreatePlayParameterObject): Promise<PlayEntity> {
		const playInfo = await apiClient.createPlay(
			param.contentLocator,
			param.initialJoinPlayer,
			param.inheritsJoinedFromLatest,
			param.inheritsAudioFromLatest
		);
		const playId = playInfo.data.playId;

		// apiClient.createPlay() に対する onPlayCreate 通知が先行していれば、この時点で PlayEntity が生成済みになっている
		if (this.plays[playId])
			return this.plays[playId];

		// でなければ onPlayCreate 通知(が来て PlayEntity が生成される)を待つ
		const play = await (new Promise<PlayEntity>(resolve => (this._creationWaiters[playId] = resolve)));
		delete this._creationWaiters[playId];
		return play;
	}

	/**
	 * スタンドアロンのプレーを作成する。
	 */
	async createStandalonePlay(param: CreateStandalonePlayParameterObject): Promise<PlayEntity> {
		const playId = param.playId;

		if (this.plays[playId])
			return this.plays[playId];

		const play = new PlayEntity({
			gameViewManager: this._gameViewManager,
			playId,
			status: "running", // 暫定。standalone プレイは running しかないものとして扱う
			content: this._contentStore.find(param.contentLocator),
			parent: param.parent
		});
		this.plays[playId] = play;

		return play;
	}

	// このメソッドは onPlayCreate の通知を受けた時の処理なので完了を待たない
	private handlePlayCreate = (e: PlayCreateTestbedEvent): Promise<void> => {
		return this.handlePlayCreateImpl(e);
	};

	private handlePlayCreateImpl = async (e: PlayCreateTestbedEvent): Promise<void> => {
		const play = new PlayEntity({
			...e,
			gameViewManager: this._gameViewManager,
			content: this._contentStore.find(e.contentLocatorData)
		});
		this.plays[e.playId] = play;
		this._lastPlayId = e.playId;
		if (this._creationWaiters[e.playId]) {
			this._creationWaiters[e.playId](play);
		}
	};

	private handlePlayStatusChange = async (e: PlayStatusChangedTestbedEvent): Promise<void> => {
		const play = this.plays[e.playId];
		play.handlePlayStatusChange(e.playStatus);

		// TODO LocalInstance はここで解放すべき？
		if (e.playStatus === "suspending") {
			await play.teardown();
			delete this.plays[e.playId];
		}
	};

	private handlePlayDurationStateChange = (e: PlayDurationStateChangeTestbedEvent): void => {
		this.plays[e.playId].handlePlayDurationStateChange(e.isPaused, e.duration);
	};

	private handlePlayAudioStateChange = (e: PlayAudioStateChangeTestbedEvent): void => {
		const play = this.plays[e.playId];
		play.handlePlayAudioStateChange(e.audioState);
	};

	private handlePlayerJoin = (e: PlayerJoinTestbedEvent): void => {
		this.plays[e.playId].handlePlayerJoin(e.player);
	};

	private handlePlayerLeave = (e: PlayerLeaveTestbedEvent): void => {
		this.plays[e.playId].handlePlayerLeave(e.playerId);
	};

	private handleClientInstanceAppear = (e: ClientInstanceAppearTestbedEvent): void => {
		this.plays[e.playId].handleClientInstanceAppear(e);
	};

	private handleClientInstanceDisappear = (e: ClientInstanceDisappearTestbedEvent): void => {
		this.plays[e.playId].handleClientInstanceDisappear(e);
	};

	private handleRunnerCreate = (e: RunnerCreateTestbedEvent): void => {
		this.plays[e.playId].handleRunnerCreate(e.runnerId);
	};

	private handleRunnerRemove = (e: RunnerRemoveTestbedEvent): void => {
		this.plays[e.playId].handleRunnerRemove(e.runnerId);
	};

	private handleRunnerPause = (e: RunnerPauseTestbedEvent): void => {
		this.plays[e.playId].handleRunnerPause(/* e.runnerId */);  // runnerIdを扱う処理は未実装
	};

	private handleRunnerResume = (e: RunnerResumeTestbedEvent): void => {
		this.plays[e.playId].handleRunnerResume(/* e.runnerId */);  // runnerIdを扱う処理は未実装
	};

	private handlePutStartPoint = (e: PutStartPointEvent): void => {
		this.plays[e.playId].handleStartPointHeader(e.startPointHeader);
	};
}
