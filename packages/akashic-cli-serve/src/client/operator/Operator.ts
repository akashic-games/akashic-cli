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

	// TODO xnv そもそもこれを受けるところから考え直す
	contentLocator: ClientContentLocator;
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
	private contentLocator: ClientContentLocator;

	constructor(param: OperatorParameterObject) {
		const store = param.store;
		this.play = new PlayOperator(store);
		this.localInstance = new LocalInstanceOperator(store);
		this.ui = new UiOperator(store);
		this.externalPlugin = new ExternalPluginOperator(param.gameViewManager);
		this.store = param.store;
		this.gameViewManager = param.gameViewManager;
		this.contentLocator = param.contentLocator;

		Subscriber.onBroadcast.add(this._handleBroadcast);
	}

	async bootstrap(): Promise<void> {
		const store = this.store;
		await store.playStore.assertInitialized();
		// TODO xnv そもそもコンテンツを指定して立ち上げる時は、既存プレイを探さず直接新規プレイでいいのでは？
		const plays = store.playStore.playsList().filter(play => {
			return play.contentLocator.asAbsoluteUrl() === store.contentLocator.asAbsoluteUrl();
		});
		const play = (plays.length === 0) ? await this._createServerLoop() : plays[plays.length - 1];
		await this.setCurrentPlay(play);
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
		// TODO xnv contentId 指定がある前提になっている。contentLocator を直接使うか、またはそもそもこの制御を LocalInstance 側に委ねる
		// contentId でない場合は sandboxConfig はそもそも取れないとして扱うべき (サーバサイドのサポートがないと取れないので、単にGETリクエストするわけにもいかない)
		// TODO xnv ContentLocator とか回りくどいことせずに、content.json から __akashicServe__.debbugableUrl を取れるようにすべき？
		const contentId = parseInt(this.store.contentLocator.contentId, 10);

		const gameJson = await ApiClient.getGameConfiguration(contentId);
		this.gameViewManager.setViewSize(gameJson.width, gameJson.height);

		const sandboxConfigResult = await ApiClient.getSandboxConfig(contentId);
		store.setSandboxConfig(sandboxConfigResult.data || {});

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
		const play = await this._createServerLoop();
		await ApiClient.broadcast(this.store.currentPlay.playId, { type: "switchPlay", nextPlayId: play.playId });
		await this.store.currentPlay.deleteAllServerInstances();
	}

	private async _createServerLoop(): Promise<PlayEntity> {
		const play = await this.store.playStore.createPlay({ contentLocator: this.contentLocator });
		const tokenResult = await ApiClient.createPlayToken(play.playId, "", true);  // TODO 空文字列でなくnullを使う
		play.createServerInstance({ playToken: tokenResult.data.playToken });
		ApiClient.resumePlayDuration(play.playId);
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
