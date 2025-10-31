import { toJS as mobxToJS } from "mobx";
import { createSessionParameter } from "../../common/createSessionParameter";
import type { Store } from "../store/Store";

export class PlayOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	toggleJoinLeaveSelf = (toJoin: boolean): void => {
		const player = this.store.player!;
		if (toJoin) {
			this.store.currentPlay!.join(player.id, player.name);
		} else {
			this.store.currentPlay!.leave(player.id);
		}
	};

	sendAutoStartEvent(): void {
		const sandboxConfig = this.store.currentLocalInstance!.content.sandboxConfig;
		const { events, autoSendEventName } = sandboxConfig;
		if (events && autoSendEventName && events[autoSendEventName] != null) {
			this.sendRegisteredEvent(autoSendEventName);
		} else if (this.store.targetService === "nicolive:multi") {
			// autoSendEvent が存在しない場合のみデフォルトのセッションパラメータを送る
			this.store.currentPlay!.amflow.enqueueEvent(createSessionParameter(this.store.targetService));
		}
	}

	sendRegisteredEvent = (eventName: string): void => {
		const sandboxConfig = this.store.currentLocalInstance!.content.sandboxConfig;
		const pevs = sandboxConfig.events ? sandboxConfig.events[eventName] : [];
		const events = mobxToJS(pevs); // untrusted の場合 proxy オブジェクト送信でエラーとなるため js オブジェクトへ変換して送信
		this.store.currentLocalInstance!.gameContent.sendEvents(events);
	};

	sendEditorEvent = (): void => {
		// TODO: 入力された JSON が不正な値の場合に Send ボタンを disabled にし、このパスでは正常な値が取れるようにする。
		if (this.store.devtoolUiStore.eventEditContent.trim() === "") return;
		let pevs;
		try {
			pevs = JSON.parse(this.store.devtoolUiStore.eventEditContent);
		} catch (e) {
			throw new Error(e);
		}
		this.store.currentLocalInstance!.gameContent.sendEvents(pevs);
	};

	downloadPlaylog = (): void => {
		const play = this.store.currentPlay;
		if (!play) throw new Error("play not found");

		const dumped = play.amflow.dump();
		const blob = new Blob([JSON.stringify(dumped)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const fileName = `playlog_${play.playId}_${Date.now()}.json`;

		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();

		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
}
