import * as Subscriber from "../../api/Subscriber";
import { RootFrameStore } from "../../store/RootFrameStore";

export class RootPlayOperator {
	private store: RootFrameStore;

	constructor(store: RootFrameStore) {
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

	openNewClientInstance = (): void => {
		// Mac Chrome で正しく動作しないのと、親ウィンドウかどうかの判別をしたいことがあるので noopener は付けない。
		// 代わりに ignoreSession を指定して自前でセッションストレージをウィンドウごとに使い分ける (ref. ../store/storage.ts)
		window.open(
			`${window.location.pathname}?ignoreSession=1`,
			"_blank",
			`width=${window.innerWidth},height=${window.innerHeight}`
		);
	}

	openNewClientFrame = (): void => {
		this.store.addPane();
	}

	closeClientFrame = (paneKey: string): void => {
		this.store.removePane(paneKey);
	}

	closeThisWindowIfNeeded = (): void => {
		// TODO: ゲームごとに、開いた window の位置とサイズ情報を閉じる直前で localStorage に保存し、
		// 再度 window を開いた時に localStorage に情報があればそのサイズで window.open() したい。
		if (this.store.appOptions.preserveDisconnected)  return;

		if (window.opener) {
			window.close();
		}
	}

	downloadPlaylog = (): void => {
		location.href = `/api/plays/${this.store.currentPlay.playId}/playlog`;
	}
}

