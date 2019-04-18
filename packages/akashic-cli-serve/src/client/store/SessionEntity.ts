import { observable, action } from "mobx";
import { PlayEntity } from "./PlayEntity";
import { LocalInstanceEntity } from "./LocalInstanceEntity";

/*
import * as playlog from "@akashic/playlog";
import { Trigger } from "@akashic/trigger";
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
import { ServerInstanceEntity } from "./ServerInstanceEntity";
*/

export interface ContentInfo {
	url: string;
	clientUrl?: string;
}

export interface SessionEntityParameterObject {
	contentInfo: contentInfo;
	playId: string;
	local: boolean;
	serverInstanceArgument?: any;
	instanceArgument: any;
}

export class SessionEntity {
	static 

	@observable play: PlayEntity | null;
	@observable instance: LocalInstanceEntity;
	@observable parent: SessionEntity | null;

	private _param: SessionEntityParameterObject;

	constructor(param: SessionEntityParameterObject) {
		this._param = param;
	}

	async initialize(): Promise<void> {

		// プレイを作る
		const param = this._param;
		const { contentInfo, playId, local } = param;
		const play = await (local ? playStore.createStandalonePlay({ contentInfo, playId }) : playStore.createPlay({ contentInfo });

		// サーバインスタンスを作る
		if (!local) {
			const argument = store.sandboxConfig.arguments[Operator.ACTIVE_SERVER_INSTANCE_ARGUMENT_NAME];
			const playToken = (await ApiClient.createPlayToken(play.playId, "", true, null, JSON.stringify(argument))).playToken;  // TODO 空文字列でなくnullを使う
			play.createServerInstance({ playToken, argument });
			ApiClient.resumePlayDuration(play.playId);
			return play;
		}

		// 親の死を監視する
		const options = await ApiClient.getOptions();
		if (optionsResult.autoStart) {
			await this.startContent();
		}
	}

	private async _initializeAsNonLocal(): Promise<void> {
		const param = this._param;
		const { contentInfo, playId, serverInstanceArgument } = param;
		const play = await playStore.createPlay({ contentInfo });

		// サーバインスタンスを作る
		const playToken = (await ApiClient.createPlayToken(play.playId, "", true, null, JSON.stringify(serverInstanceArgument))).playToken;  // TODO 空文字列でなくnullを使う
		play.createServerInstance({ playToken, argument: serverInstanceArgument });

		ApiClient.resumePlayDuration(play.playId);

	}

	private async _createServerLoop(): Promise<PlayEntity> {
		// 一部フローで二度手間になるが、createServerInstance() 時に参照するのでこの箇所で更新しておく
		this.store.setSandboxConfig((await ApiClient.getSandboxConfig(this.store.contentId)) || {});

		const play = await this.store.playStore.createPlay({
			contentUrl: this.contentUrl,
			clientContentUrl: this.clientContentUrl
		});
		const argument = this.store.sandboxConfig.arguments[Operator.ACTIVE_SERVER_INSTANCE_ARGUMENT_NAME];
		const playToken = (await ApiClient.createPlayToken(play.playId, "", true, null, JSON.stringify(argument))).playToken;  // TODO 空文字列でなくnullを使う
		play.createServerInstance({ playToken, argument });
		ApiClient.resumePlayDuration(play.playId);
		return play;
	}

}


	async bootstrap(): Promise<void> {
		const store = this.store;
		await store.playStore.assertInitialized();
		await store.devtoolUiStore.assertInitialized();
		const playIds = Object.keys(store.playStore.plays);
		const play = (playIds.length === 0) ? await this._createServerLoop() : store.playStore.plays[playIds[playIds.length - 1]];
		await this.setCurrentPlay(play);
	}

	startContent = async (params?: StartContentParameterObject): Promise<void> => {
		const store = this.store;
		const play = store.currentPlay;
		const playToken = (await ApiClient.createPlayToken(
			play.playId,
			store.player.id,
			false,
			store.player.name,
			null,
			JSON.stringify(argument)
		)).playToken;
		const instance = await play.createLocalInstance({
			gameViewManager: this.gameViewManager,
			playId: play.playId,
			playToken,
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
t 
