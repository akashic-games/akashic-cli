import { observable } from "mobx";
import { ContentLocatorData } from "../../common/types/ContentLocatorData";
import {
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
	PlayAudioStateChangeTestbedEvent
} from "../../common/types/TestbedEvent";
import * as ApiClient from "../api/ApiClient";
import * as Subscriber from "../api/Subscriber";
import { ClientContentLocator } from "../common/ClientContentLocator";
import { ContentStore } from "./ContentStore";
import { PlayEntity } from "./PlayEntity";

export interface PlayStoreParameterObject {
	contentStore: ContentStore;
}

export interface CreatePlayParameterObject {
	contentLocator: ContentLocatorData;
	parent?: PlayEntity;
}

export interface CreateStandalonePlayParameterObject {
	contentLocator: ClientContentLocator;

	// TODO xnv create が playId を引数にとるのはおかしい。sessionId の管理は Play から切り離す。
	playId: string;
	parent?: PlayEntity;
}

export class PlayStore {
	@observable plays: {[key: string]: PlayEntity};
	private _contentStore: ContentStore;
	private _creationWaiters: {[key: string]: (p: PlayEntity) => void };
	private _initializationWaiter: Promise<void>;

	constructor(param: PlayStoreParameterObject) {
		this.plays = Object.create(null);
		this._contentStore = param.contentStore;
		this._creationWaiters = Object.create(null);
		this._initializationWaiter = ApiClient.getPlays().then(res => {
			const playsInfo = res.data;
			playsInfo.forEach(playInfo => {
				this.plays[playInfo.playId] = new PlayEntity({
					...playInfo,
					content: this._contentStore.findOrRegister(playInfo.contentLocatorData)
				});
			});
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
		});
	}

	assertInitialized(): Promise<void> {
		return this._initializationWaiter;
	}

	playsList(): PlayEntity[] {
		return Object.keys(this.plays).map(playId => this.plays[playId]);
	}

	async createPlay(param: CreatePlayParameterObject): Promise<PlayEntity> {
		const playInfo = await ApiClient.createPlay(param.contentLocator);
		const playId = playInfo.data.playId;

		// ApiClient.createPlay() に対する onPlayCreate 通知が先行していれば、この時点で PlayEntity が生成済みになっている
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
			playId,
			content: this._contentStore.findOrRegister(param.contentLocator),
			parent: param.parent
		});
		this.plays[playId] = play;

		return play;
	}

	private handlePlayCreate = (e: PlayCreateTestbedEvent): void => {
		const play = new PlayEntity({
			...e,
			content: this._contentStore.findOrRegister(e.contentLocatorData)
		});
		this.plays[e.playId] = play;
		if (this._creationWaiters[e.playId]) {
			this._creationWaiters[e.playId](play);
		}
	};

	private handlePlayStatusChange = (e: PlayStatusChangedTestbedEvent): void => {
		const play = this.plays[e.playId];
		play.handlePlayStatusChange(e.playStatus);

		// TODO LocalInstance はここで解放すべき？
		if (e.playStatus === "suspending") {
			play.teardown();
			delete this.plays[e.playId];
		}
	};

	private handlePlayDurationStateChange = (e: PlayDurationStateChangeTestbedEvent): void => {
		this.plays[e.playId].handlePlayDurationStateChange(e.isPaused, e.duration);
	};

	private handlePlayAudioStateChange = (e: PlayAudioStateChangeTestbedEvent): void => {
		const play = this.plays[e.playId];
		play.handlePlayAudioStateChange(e.audioState);
	}

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
}
