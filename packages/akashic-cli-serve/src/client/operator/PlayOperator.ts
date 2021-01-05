import * as Subscriber from "../api/Subscriber";
import { Store } from "../store/Store";

export class PlayOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
		Subscriber.onDisconnect.add(this.closeThisWindowIfNeeded);
	}

	togglePauseActive = (pauses: boolean): void => {
		if (pauses) {
			this.store.currentPlay.pauseActive();
		} else {
			this.store.currentPlay.resumeActive();
		}
	}

	step = (): void => {
		this.store.currentPlay.stepActive();
	}

	toggleJoinLeaveSelf = (toJoin: boolean): void => {
		const player = this.store.player;
		if (toJoin) {
			this.store.currentPlay.join(player.id, player.name);
		} else {
			this.store.currentPlay.leave(this.store.player.id);
		}
	}

	openNewClientInstance = (): void => {
		// Mac Chrome で正しく動作しないのと、親ウィンドウかどうかの判別をしたいことがあるので noopener は付けない。
		// 代わりに ignoreSession を指定して自前でセッションストレージをウィンドウごとに使い分ける (ref. ../store/storage.ts)
		window.open(
			`${window.location.pathname}?ignoreSession=1`,
			"_blank",
			`width=${window.innerWidth},height=${window.innerHeight}`
		);
	}

	closeThisWindowIfNeeded = (): void => {
		// TODO: ゲームごとに、開いた window の位置とサイズ情報を閉じる直前で localStorage に保存し、
		// 再度 window を開いた時に localStorage に情報があればそのサイズで window.open() したい。
		if (this.store.appOptions.preserveDisconnected)  return;

		if (window.opener) {
			window.close();
		}
	}

	sendRegisteredEvent = (eventName: string): void => {
		const sandboxConfig = this.store.currentLocalInstance.content.sandboxConfig || {};
		const pevs = sandboxConfig.events[eventName];
		const amflow = this.store.currentPlay.amflow;
		pevs.forEach((pev: any) => amflow.enqueueEvent(pev));
	}

	sendEditorEvent = (): void => {
		// TODO: 入力された JSON が不正な値の場合に Send ボタンを disabled にし、このパスでは正常な値が取れるようにする。
		if (this.store.devtoolUiStore.eventEditContent.trim() === "")  return;
		let pevs;
		try {
			pevs = JSON.parse(this.store.devtoolUiStore.eventEditContent);
		} catch (e) {
			throw new Error(e);
		}
		const amflow = this.store.currentPlay.amflow;
		pevs.forEach((pev: any) => amflow.enqueueEvent(pev));
	}

	downloadPlaylog = (): void => {
		location.href = `/api/plays/${this.store.currentPlay.playId}/playlog`;
	}
}
