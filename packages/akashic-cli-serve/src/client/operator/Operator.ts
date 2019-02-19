import { PlayBroadcastTestbedEvent } from "../../common/types/TestbedEvent";
import * as ApiClient from "../api/ApiClient";
import * as Subscriber from "../api/Subscriber";
import { GameViewManager } from "../akashic/GameViewManager";
import { PlayEntity } from "../store/PlayEntity";
import { Store } from "../store/Store";
import { PlayOperator } from "./PlayOperator";
import { LocalInstanceOperator } from "./LocalInstanceOperator";
import { UiOperator } from "./UiOperator";
import { ExternalPluginOperator } from "./ExternalPluginOperator";

export interface OperatorParameterObject {
	store: Store;
	gameViewManager: GameViewManager;

	contentUrl: string;
	clientContentUrl?: string;
}

export class Operator {
	play: PlayOperator;
	localInstance: LocalInstanceOperator;
	ui: UiOperator;
	externalPlugin: ExternalPluginOperator;
	private store: Store;
	private gameViewManager: GameViewManager;
	private contentUrl: string;
	private clientContentUrl: string | null;

	constructor(param: OperatorParameterObject) {
		const store = param.store;
		this.play = new PlayOperator(store);
		this.localInstance = new LocalInstanceOperator(store);
		this.ui = new UiOperator(store);
		this.externalPlugin = new ExternalPluginOperator(param.gameViewManager);
		this.store = param.store;
		this.gameViewManager = param.gameViewManager;
		this.contentUrl = param.contentUrl;
		this.clientContentUrl = param.clientContentUrl;

		Subscriber.onBroadcast.add(this._handleBroadcast);
	}

	async bootstrap(): Promise<void> {
		const store = this.store;
		await store.playStore.assertInitialized();
		const playIds = Object.keys(store.playStore.plays);
		const play = (playIds.length === 0) ? await this._createServerLoop() : store.playStore.plays[playIds[playIds.length - 1]];
		await this.setCurrentPlay(play);
	}

	setCurrentPlay = async (play: PlayEntity): Promise<void> => {
		const store = this.store;
		if (store.currentPlay === play)
			return;

		if (store.currentPlay) {
			store.currentPlay.deleteAllLocalInstances();
		}

		// TODO play からコンテンツを引くべき？
		const gameJson = await ApiClient.getGameConfiguration();
		this.gameViewManager.setViewSize(gameJson.width, gameJson.height);

		const sandboxConfigResult = await ApiClient.getSandboxConfig();
		store.setSandboxConfig(sandboxConfigResult.data || {});

		const tokenResult = await ApiClient.createPlayToken(play.playId, store.player.id, false, store.player.name);
		const instance = await play.createLocalInstance({
			gameViewManager: this.gameViewManager,
			playId: play.playId,
			playToken: tokenResult.data.playToken,
			playlogServerUrl: "dummy-playlog-server-url",
			executionMode: "passive",
			player: store.player,
			coeHandler: {
				onLocalInstanceCreate: async params => {
					// TODO: local === true のみ対応
					if (!params.local) {
						// TODO: エラーハンドリング
						throw new Error("Not supported");
					}
					const childPlay = await this._createClientLoop(params.contentUrl, params.playId);
					return await childPlay.createLocalInstance({
						gameViewManager: this.gameViewManager,
						contentUrl: params.contentUrl,
						player: this.store.player,
						playId: params.playId,
						executionMode: "active",
						argument: {
							coe: {
								permission: {
									advance: true,
									advanceRequest: true,
									aggregation: true
								},
								roles: ["broadcaster"],
								debugMode: false
							}
						},
						initialEvents: params.initialEvents
					});
				},
				onLocalInstanceDelete: async playId => {
					const play = this.store.playStore.plays[playId];
					if (play == null) {
						throw new Error("Play not found" + playId);
					}
					await play.teardown();
				}
			}
		});

		store.setCurrentPlay(play);
		store.setCurrentLocalInstance(instance);
	}

	restartWithNewPlay = async (): Promise<void> => {
		const play = await this._createServerLoop();
		await ApiClient.broadcast(this.store.currentPlay.playId, { type: "switchPlay", nextPlayId: play.playId });
		await this.store.currentPlay.deleteAllServerInstances();
	}

	private async _createServerLoop(): Promise<PlayEntity> {
		const play = await this.store.playStore.createPlay({
			contentUrl: this.contentUrl,
			clientContentUrl: this.clientContentUrl
		});
		const tokenResult = await ApiClient.createPlayToken(play.playId, "", true);  // TODO 空文字列でなくnullを使う
		play.createServerInstance({ playToken: tokenResult.data.playToken });
		ApiClient.resumePlayDuration(play.playId);
		return play;
	}

	private async _createClientLoop(contentUrl: string, playId: string): Promise<PlayEntity> {
		const play = await this.store.playStore.createStandalonePlay({
			contentUrl,
			playId
		});
		return play;
	}

	private _handleBroadcast = (arg: PlayBroadcastTestbedEvent): void => {
		try {
			switch (arg.message.type) {
			case "switchPlay":  // TODO typeを型づける
				this.setCurrentPlay(this.store.playStore.plays[arg.message.nextPlayId]);
				break;
			default:
				throw new Error("invalid type: " + arg.message.type);
			}
		} catch (e) {
			console.error("_handleBroadcast()", e);
		}
	}
}
