import { PlayBroadcastTestbedEvent, PlayTreeTestbedEvent } from "../../common/types/TestbedEvent";
import * as ApiClient from "../api/ApiClient";
import * as Subscriber from "../api/Subscriber";
import { GameViewManager } from "../akashic/GameViewManager";
import { PlayEntity, CreateLocalInstanceParameterObject } from "../store/PlayEntity";
import { Store } from "../store/Store";
import { PlayOperator } from "./PlayOperator";
import { LocalInstanceOperator } from "./LocalInstanceOperator";
import { UiOperator } from "./UiOperator";
import { ExternalPluginOperator } from "./ExternalPluginOperator";
import { CreatePlayParameterObject } from "../store/PlayStore";
import { CoeApplicationIdentifier } from "../common/interface/plugin";
import { CreateCoeLocalInstanceParameterObject } from "../store/CoePluginEntity";
import { LocalInstanceEntity } from "../store/LocalInstanceEntity";

export interface OperatorParameterObject {
	store: Store;
	gameViewManager: GameViewManager;

	contentUrl: string;
	clientContentUrl?: string;
}

export interface StartContentParameterObject {
	joinsAutomatically: boolean;
	gameArgument: any;
}

export interface CreateNewPlayAndSendEventsParameterObject {
	parentPlayId: string;
	contentUrl: string;
	clientContentUrl: string;
	application: CoeApplicationIdentifier;
	sessionParameters?: any;
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
		const gameJson = await ApiClient.getGameConfiguration();
		this.gameViewManager.setViewSize(gameJson.width, gameJson.height);

		const sandboxConfigResult = await ApiClient.getSandboxConfig();
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
			argument: params != null ? params.gameArgument : undefined,
			coeHandler: {
				onLocalInstanceCreate: this._createLocalInstance,
				onLocalInstanceDelete: this._deleteLocalInstance
			}
		});
		store.setCurrentLocalInstance(instance);
		if (params != null && params.joinsAutomatically) {
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
		const tokenResult = await ApiClient.createPlayToken(play.playId, "", true);  // TODO 空文字列でなくnullを使う
		play.createServerInstance({ playToken: tokenResult.data.playToken });
		await ApiClient.broadcast(this.store.currentPlay.playId, { type: "newPlay", newPlayId: play.playId });
		return play;
	}

	createChildPlayAndSendEvents = async (param: CreateNewPlayAndSendEventsParameterObject): Promise<void> => {
		const {parentPlayId, contentUrl, clientContentUrl, sessionParameters} = param;
		const {type, version, url} = param.application;
		let parentPlay: PlayEntity;
		if (parentPlayId != null) {
			parentPlay = this.store.playStore.plays[parentPlayId];
		}
		if (parentPlay == null) {
			parentPlay = this.getCurrentPlay();
		}
		if (parentPlay == null) {
			throw new Error("play not found");
		}
		const childPlay = await this.createNewPlay({
			contentUrl,
			clientContentUrl
		});
		parentPlay.amflow.sendEvent([
			32,
			null,
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
		this.store.externalPluginUiStore.setCurrentPlay(childPlay.playId);
		// TODO: SocketIOAMFlowManager で connection が確立するまで `amfloe#sendEvent()` の呼び出しが握りつぶされるため pooling で待機
		const pooling = () => {
			if (childPlay.amflow._permission != null) {
				childPlay.amflow.sendEvent([
					32,
					null,
					":akashic",
					{
						type: "start",
						sessionId: childPlay.playId,
						userId: ":akashic",
						parameters: sessionParameters
					}
				]);
			} else {
				setTimeout(pooling, 500);
			}
		};
		pooling();
	}

	suspendPlayAndSendEvents = async (playId: string): Promise<void> => {
		await ApiClient.suspendPlay(playId);
	}

	private _createLocalInstance = async (params: CreateCoeLocalInstanceParameterObject): Promise<LocalInstanceEntity> => {
		const store = this.store;
		let createInstanceParam: CreateLocalInstanceParameterObject;
		let play: PlayEntity;
		if (!params.local) {
			play = this.store.playStore.plays[params.playId];
			const childPlayToken = await ApiClient.createPlayToken(play.playId, store.player.id, false, store.player.name);
			createInstanceParam = {
				gameViewManager: this.gameViewManager,
				contentUrl: params.contentUrl,
				player: this.store.player,
				playId: params.playId,
				playToken: childPlayToken.data.playToken,
				playlogServerUrl: "dummy-playlog-server-url",
				executionMode: "passive",
				argument: params.argument,
				initialEvents: params.initialEvents,
				coeHandler: {
					onLocalInstanceCreate: this._createLocalInstance,
					onLocalInstanceDelete: this._deleteLocalInstance
				},
				parent: params.parent
			};
		} else {
			play = await this._createClientLoop(params.contentUrl, params.playId);
			createInstanceParam = {
				gameViewManager: this.gameViewManager,
				contentUrl: params.contentUrl,
				player: this.store.player,
				playId: params.playId,
				executionMode: "active",
				argument: params.argument,
				initialEvents: params.initialEvents,
				parent: params.parent
			};
		}
		return await play.createLocalInstance(createInstanceParam);
	}

	private _deleteLocalInstance = async (playId: string) => {
		const play = this.store.playStore.plays[playId];
		if (play == null) {
			throw new Error("Play not found" + playId);
		}
		await play.teardown();
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
