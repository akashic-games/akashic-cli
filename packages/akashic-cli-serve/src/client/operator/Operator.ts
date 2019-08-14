import { PlayBroadcastTestbedEvent } from "../../common/types/TestbedEvent";
import { ClientContentLocator } from "../common/ClientContentLocator";
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
}

export interface StartContentParameterObject {
	joinsSelf: boolean;
	instanceArgument: any;
}

export class Operator {
	play: PlayOperator;
	localInstance: LocalInstanceOperator;
	ui: UiOperator;
	externalPlugin: ExternalPluginOperator;
	private store: Store;
	private gameViewManager: GameViewManager;

	constructor(param: OperatorParameterObject) {
		const store = param.store;
		this.play = new PlayOperator(store);
		this.localInstance = new LocalInstanceOperator(store);
		this.ui = new UiOperator(store);
		this.externalPlugin = new ExternalPluginOperator(param.gameViewManager);
		this.store = param.store;
		this.gameViewManager = param.gameViewManager;

		Subscriber.onBroadcast.add(this._handleBroadcast);
	}

	async bootstrap(contentLocator?: ClientContentLocator): Promise<void> {
		const store = this.store;
		await store.assertInitialized();
		let play: PlayEntity = null;
		if (contentLocator) {
			play = await this._createServerLoop(contentLocator);
		} else {
			const plays = store.playStore.playsList();
			if (plays.length > 0) {
				play = plays[plays.length - 1];
			} else {
				const loc = store.contentStore.defaultContent().locator;
				play = await this._createServerLoop(loc);
			}
		}
		await this.setCurrentPlay(play);

		const plays = store.playStore.playsList();
		if (contentLocator || plays.length !== 0) {
			if (play.content.sandboxConfig.autoSendEvents) {
				this.ui.setEventEditContent(JSON.stringify(play.content.sandboxConfig.events[play.content.sandboxConfig.autoSendEvents]));
				this.play.sendEditorEvent();
			}
		}
	}

	setCurrentPlay = async (play: PlayEntity): Promise<void> => {
		const store = this.store;
		if (store.currentPlay === play)
			return;

		if (store.currentPlay) {
			store.currentPlay.deleteAllLocalInstances();
			store.setCurrentLocalInstance(null);
		}

		// TODO play からコンテンツを引くべき？

		store.setCurrentPlay(play);

		const optionsResult = await ApiClient.getOptions();
		if (optionsResult.data.autoStart) {
			await this.startContent();
		}
	}

	startContent = async (params?: StartContentParameterObject): Promise<void> => {
		const store = this.store;
		const play = store.currentPlay;
		const tokenResult = await ApiClient.createPlayToken(play.playId, store.player.id, false, store.player.name);
		const instance = await play.createLocalInstance({
			gameViewManager: this.gameViewManager,
			playId: play.playId,
			playToken: tokenResult.data.playToken,
			playlogServerUrl: "dummy-playlog-server-url",
			executionMode: "passive",
			player: store.player,
			argument: params != null ? params.instanceArgument : undefined,
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
		store.setCurrentLocalInstance(instance);
		if (params != null && params.joinsSelf) {
			store.currentPlay.join(store.player.id, store.player.name);
		}
	}

	restartWithNewPlay = async (): Promise<void> => {
		const play = await this._createServerLoop(this.store.currentPlay.content.locator);
		await ApiClient.broadcast(this.store.currentPlay.playId, { type: "switchPlay", nextPlayId: play.playId });
		await this.store.currentPlay.deleteAllServerInstances();
	}

	private async _createServerLoop(contentLocator: ClientContentLocator): Promise<PlayEntity> {
		const play = await this.store.playStore.createPlay({ contentLocator });
		const tokenResult = await ApiClient.createPlayToken(play.playId, "", true);  // TODO 空文字列でなくnullを使う
		await play.createServerInstance({ playToken: tokenResult.data.playToken });
		await ApiClient.resumePlayDuration(play.playId);
		return play;
	}

	private async _createClientLoop(contentUrl: string, playId: string): Promise<PlayEntity> {
		const play = await this.store.playStore.createStandalonePlay({
			contentLocator: new ClientContentLocator({ path: contentUrl }),  // TODO xnv 多分動かない。COEプラグインからまともに ContentLocator を組み立てる必要がある
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
