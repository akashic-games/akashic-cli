import { EventCode } from "@akashic/playlog";
import { PlayBroadcastTestbedEvent, PlayTreeTestbedEvent } from "../../common/types/TestbedEvent";
import * as ApiClient from "../api/ApiClient";
import * as Subscriber from "../api/Subscriber";
import { GameViewManager } from "../akashic/GameViewManager";
import { PlayEntity } from "../store/PlayEntity";
import { Store } from "../store/Store";
import { PlayOperator } from "./PlayOperator";
import { LocalInstanceOperator } from "./LocalInstanceOperator";
import { UiOperator } from "./UiOperator";
import { ExternalPluginOperator } from "./ExternalPluginOperator";
import { CreatePlayParameterObject } from "../store/PlayStore";
import { CoeApplicationIdentifier } from "../common/interface/plugin";
import { LocalInstanceEntity, HandleRegisterPluginParameterObject } from "../store/LocalInstanceEntity";
import { CoePluginEntity, CreateSessionInstanceParameterObject } from "../store/CoePluginEntity";

export interface OperatorParameterObject {
	store: Store;
	gameViewManager: GameViewManager;

	contentUrl: string;
	clientContentUrl?: string;
}

export interface StartContentParameterObject {
	joinsSelf: boolean;
	instanceArgument: any;
}

export interface CreateNewPlayAndSendEventsParameterObject {
	parentPlayId: string;
	contentUrl: string;
	clientContentUrl: string;
	application: CoeApplicationIdentifier;
	sessionParameters?: any;
}

export class Operator {
	static ACTIVE_SERVER_INSTANCE_ARGUMENT_NAME = "<activeServerInstanceArgument>";

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

		Subscriber.onPlayTreeChange.add(this._handlePlayTreeChange);
		Subscriber.onBroadcast.add(this._handleBroadcast);
	}

	async bootstrap(): Promise<void> {
		const store = this.store;
		await store.playStore.assertInitialized();
		await store.devtoolUiStore.assertInitialized();
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
			store.setCurrentLocalInstance(null);
		}

		// TODO play からコンテンツを引くべき？
		const gameJson = await ApiClient.getGameConfiguration(this.store.contentId);
		this.gameViewManager.setViewSize(gameJson.width, gameJson.height);

		const sandboxConfigResult = await ApiClient.getSandboxConfig(this.store.contentId);
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
		const argument = params != null ? params.instanceArgument : undefined;
		const tokenResult = await ApiClient.createPlayToken(play.playId, store.player.id, false, store.player.name, null, JSON.stringify(argument));
		const instance = await play.createLocalInstance({
			gameViewManager: this.gameViewManager,
			playId: play.playId,
			playToken: tokenResult.data.playToken,
			playlogServerUrl: "dummy-playlog-server-url",
			executionMode: "passive",
			player: store.player,
			argument,
			handleRegisterPlugin: this._handleRegisterPlugin
		});
		store.setCurrentLocalInstance(instance);
		if (params != null && params.joinsSelf) {
			store.currentPlay.join(store.player.id, store.player.name);
		}
	}

	getCurrentPlay = (): PlayEntity => {
		return this.store.currentPlay;
	}

	restartWithNewPlay = async (): Promise<void> => {
		const play = await this._createServerLoop();
		await ApiClient.broadcast(this.store.currentPlay.playId, { type: "switchPlay", nextPlayId: play.playId });
		await this.store.currentPlay.deleteAllServerInstances();
	}

	createNewPlay = async (param: CreatePlayParameterObject): Promise<PlayEntity> => {
		const play = await this.store.playStore.createPlay(param);
		const argument = JSON.parse(this.store.argumentsTable[Operator.ACTIVE_SERVER_INSTANCE_ARGUMENT_NAME]);
		const tokenResult = await ApiClient.createPlayToken(play.playId, "", true, null, JSON.stringify(argument));  // TODO 空文字列でなくnullを使う
		play.createServerInstance({ playToken: tokenResult.data.playToken, argument });
		await ApiClient.broadcast(this.store.currentPlay.playId, { type: "newPlay", newPlayId: play.playId });
		return play;
	}

	createChildPlayAndSendEvents = async (param: CreateNewPlayAndSendEventsParameterObject): Promise<void> => {
		const {parentPlayId, contentUrl, clientContentUrl, sessionParameters} = param;
		const {type, version, url} = param.application;
		const parentPlay = ((parentPlayId != null) && this.store.playStore.plays[parentPlayId]) || this.getCurrentPlay();
		if (parentPlay == null) {
			throw new Error("play not found");
		}
		const childPlay = await this.createNewPlay({ contentUrl, clientContentUrl });
		parentPlay.amflow.sendEvent([
			EventCode.Message,
			2,
			":akashic",
			{
				type: "child_start",
				sessionId: childPlay.playId,
				userId: ":akashic",
				application: {
					type,
					version,
					url
				},
				cascadeApplications: []
			}
		]);
		await ApiClient.addChildPlay(parentPlay.playId, childPlay.playId);
		await ApiClient.getPlayTree();
		this.store.externalPluginUiStore.setCurrentPlay(childPlay.playId);

		// TODO: headless-driver 側で AMFLowClient#authenticate() が完了する前に sendEvent() を呼んでも問題ないようにする
		const polling = () => {
			if (childPlay.amflow._permission != null) {
				// 子セッションの制御プレイヤーをjoinさせる必要があるが、それが誰かはサービスが決める。
				// serveはひとまず単に親セッションと同じプレイヤーをjoinさせることにする。
				parentPlay.joinedPlayerTable.forEach(p => {
					childPlay.amflow.sendEvent([EventCode.Join, 3, p.id, p.name]);
				});
				childPlay.amflow.sendEvent([
					EventCode.Message,
					2,
					":akashic",
					{
						type: "start",
						sessionId: childPlay.playId,
						userId: ":akashic",
						parameters: sessionParameters
					}
				]);
			} else {
				setTimeout(polling, 500);
			}
		};
		polling();
	}

	suspendPlayAndSendEvents = async (playId: string): Promise<void> => {
		await ApiClient.suspendPlay(playId);
	}

	private _handleRegisterPlugin = (params: HandleRegisterPluginParameterObject): void => {
		if (params.name === "coe") {
			const coePlugin = new CoePluginEntity({
				gameViewManager: this.gameViewManager,
				targetInstance: params.instance,
				createSessionInstance: this._createSessionInstance
			});
			// TODO このインスタンスを保持しておくべき？
			coePlugin.setup(params.game, params.agvGameContent);
		}
	}

	private _createSessionInstance = async (params: CreateSessionInstanceParameterObject): Promise<LocalInstanceEntity> => {
		const store = this.store;
		if (!params.local) {
			const play = this.store.playStore.plays[params.playId];
			const childPlayToken = await ApiClient.createPlayToken(
				play.playId,
				store.player.id,
				false,
				store.player.name,
				null,
				JSON.stringify(params.argument)
			);
			return await play.createLocalInstance({
				gameViewManager: this.gameViewManager,
				contentUrl: params.contentUrl,
				player: this.store.player,
				playId: params.playId,
				playToken: childPlayToken.data.playToken,
				playlogServerUrl: "dummy-playlog-server-url",
				executionMode: "passive",
				argument: params.argument,
				initialEvents: params.initialEvents,
				handleRegisterPlugin: this._handleRegisterPlugin,
				parent: params.parent
			});
		} else {
			const play = await this._createClientLoop(params.contentUrl, params.playId);
			return await play.createLocalInstance({
				gameViewManager: this.gameViewManager,
				contentUrl: params.contentUrl,
				player: this.store.player,
				playId: params.playId,
				executionMode: "active",
				argument: params.argument,
				initialEvents: params.initialEvents,
				parent: params.parent
			});
		}
	}

	private async _createServerLoop(): Promise<PlayEntity> {
		// 一部フローで二度手間になるが、createServerInstance() 時に参照するのでこの箇所で更新しておく
		const sandboxConfigResult = await ApiClient.getSandboxConfig(this.store.contentId);
		this.store.setSandboxConfig(sandboxConfigResult.data || {});

		const play = await this.store.playStore.createPlay({
			contentUrl: this.contentUrl,
			clientContentUrl: this.clientContentUrl
		});
		const argument = JSON.parse(this.store.argumentsTable[Operator.ACTIVE_SERVER_INSTANCE_ARGUMENT_NAME]);
		const tokenResult = await ApiClient.createPlayToken(play.playId, "", true, null, JSON.stringify(argument));  // TODO 空文字列でなくnullを使う
		play.createServerInstance({ playToken: tokenResult.data.playToken, argument });
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
			case "newPlay":  // TODO typeを型づける
				// do nothing
				break;
			default:
				throw new Error("invalid type: " + arg.message.type);
			}
		} catch (e) {
			console.error("_handleBroadcast()", e);
		}
	}

	private _handlePlayTreeChange = (e: PlayTreeTestbedEvent): void => {
		this.ui.setPlayTree(e);
	}
}
