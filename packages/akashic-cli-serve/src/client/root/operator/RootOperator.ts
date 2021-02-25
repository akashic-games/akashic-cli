import * as queryString from "query-string";
import { PlayBroadcastTestbedEvent } from "../../../common/types/TestbedEvent";
import { ClientContentLocator } from "../../common/ClientContentLocator";
import * as ApiClient from "../../api/ApiClient";
import * as Subscriber from "../../api/Subscriber";
import { PlayEntity } from "../../store/PlayEntity";
import { RootFrameStore } from "../../store/RootFrameStore";
import { RootPlayOperator } from "./RootPlayOperator";
import { defaultSessionParameter } from "../../common/defaultSessionParameter";
import e from "express";

export interface RootOperatorParameterObject {
  store: RootFrameStore;
}

export class RootOperator {
	play: RootPlayOperator;
	private store: RootFrameStore;

	constructor(param: RootOperatorParameterObject) {
		const store = param.store;
		this.play = new RootPlayOperator(store);
		this.store = param.store;

		Subscriber.onBroadcast.add(this._handleBroadcast);
	}

	assertInitialized(): Promise<unknown> {
		window.addEventListener("message", ev => {
			if (ev.origin !== window.location.origin)
				return;
			if (ev.data.type === "close") {
				this.play.closeClientFrame(ev.data.paneKey);
			}
		});
		return this.store.assertInitialized();
	}

	async bootstrap(contentLocator?: ClientContentLocator): Promise<void> {
		const store = this.store;
		const query = queryString.parse(window.location.search);
		let play: PlayEntity = null;
		if (query.playId != null) {
			play = store.playStore.plays[query.playId as string];
			if (!play) {
				throw new Error(`play(id: ${query.playId}) is not found.`);
			}
		} else if (contentLocator) {
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
		await this.setCurrentPlay(play, query.mode === "replay");
	}

	setCurrentPlay = async (play: PlayEntity, _isReplay: boolean = false): Promise<void> => {
		const store = this.store;
		if (store.currentPlay === play)
			return;

		store.setCurrentPlay(play);
	}

	restartWithNewPlay = async (): Promise<void> => {
		await this.store.currentPlay.content.updateSandboxConfig();
		const play = await this._createServerLoop(this.store.currentPlay.content.locator);
		await this.store.currentPlay.deleteAllServerInstances();
		await ApiClient.broadcast(this.store.currentPlay.playId, { type: "switchPlay", nextPlayId: play.playId });
	}

	private async _createServerLoop(contentLocator: ClientContentLocator): Promise<PlayEntity> {
		const play = await this.store.playStore.createPlay({ contentLocator });
		const tokenResult = await ApiClient.createPlayToken(play.playId, "", true);  // TODO 空文字列でなくnullを使う
		await play.createServerInstance({ playToken: tokenResult.data.playToken });
		await ApiClient.resumePlayDuration(play.playId);

		// autoSendEvents
		const content = this.store.contentStore.findOrRegister(contentLocator);
		const sandboxConfig = content.sandboxConfig || {};

		const { events, autoSendEvents, autoSendEventName } = sandboxConfig;
		if (events && autoSendEventName && events[autoSendEventName] instanceof Array) {
			events[autoSendEventName].forEach((pev: any) => play.amflow.enqueueEvent(pev));
		} else if (events && autoSendEvents && events[autoSendEvents] instanceof Array) {
			// TODO: `autoSendEvents` は deprecated となった。互換性のためこのパスを残しているが、`autoSendEvents` の削除時にこのパスも削除する。
			console.warn("[deprecated] `autoSendEvents` in sandbox.config.js is deprecated. Please use `autoSendEventName`.");
			events[autoSendEvents].forEach((pev: any) => play.amflow.enqueueEvent(pev));
		} else if (!autoSendEventName && this.store.targetService === "nicolive") {
			play.amflow.enqueueEvent(defaultSessionParameter); // 既定のセッションパラメータを送る
		}

    // TODO zdn devtool の AutoSendEvent が死んでる
		// if (this.store.devtoolUiStore.isAutoSendEvent) {
		// 	const nicoEvent = this.devtool.createNicoEvent();
		// 	nicoEvent.forEach((pev: any) => play.amflow.enqueueEvent(pev));
		// }

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
