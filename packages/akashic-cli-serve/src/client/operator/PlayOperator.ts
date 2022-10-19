import * as Subscriber from "../api/Subscriber";
import type { Store } from "../store/Store";

const WINDOW_HEIGHT_MARGIN = 100;
const WINDOW_WIDTH_MARGIN = 40;
const TOOL_BAR_HEIGHT = 33;  // 厳密なツールバーの高さはフォントやウィンドウ幅に依存するが、ツールバーが 1 行の場合の概ねのサイズで決め打ちとする。

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
	};

	step = (): void => {
		this.store.currentPlay.stepActive();
	};

	toggleJoinLeaveSelf = (toJoin: boolean): void => {
		const player = this.store.player;
		if (toJoin) {
			this.store.currentPlay.join(player.id, player.name);
		} else {
			this.store.currentPlay.leave(this.store.player.id);
		}
	};

	openNewClientInstance = (): void => {
		const { top, left, width, height } = this.calcWindowLayout();
		// Mac Chrome で正しく動作しないのと、親ウィンドウかどうかの判別をしたいことがあるので noopener は付けない。
		// 代わりに ignoreSession を指定して自前でセッションストレージをウィンドウごとに使い分ける (ref. ../store/storage.ts)
		window.open(
			`${window.location.pathname}?ignoreSession=1&experimentalIsChildWindow=1`,
			"_blank",
			`width=${width},height=${height},top=${top},left=${left}`
		);
	};

	closeThisWindowIfNeeded = (): void => {
		if (this.store.appOptions.preserveDisconnected)  return;

		if (window.opener) {
			window.close();
		}
	};

	sendRegisteredEvent = (eventName: string): void => {
		const sandboxConfig = this.store.currentLocalInstance.content.sandboxConfig || {};
		const pevs = sandboxConfig.events[eventName];
		pevs.forEach((pev: any) => this.store.currentLocalInstance.gameContent.sendEvent(pev));
	};

	sendEditorEvent = (): void => {
		// TODO: 入力された JSON が不正な値の場合に Send ボタンを disabled にし、このパスでは正常な値が取れるようにする。
		if (this.store.devtoolUiStore.eventEditContent.trim() === "")  return;
		let pevs;
		try {
			pevs = JSON.parse(this.store.devtoolUiStore.eventEditContent);
		} catch (e) {
			throw new Error(e);
		}
		pevs.forEach((pev: any) => this.store.currentLocalInstance.gameContent.sendEvent(pev));
	};

	downloadPlaylog = (): void => {
		const playId = this.store.currentPlay.playId;
		this.downloadFile(`/api/plays/${playId}/playlog`, `playlog_${playId}.json`);
	};

	muteAll = (): void => {
		this.store.currentPlay.muteAll();
	};

	muteOthers = (): void => {
		this.store.currentPlay.muteOthers();
	};

	unmuteAll = (): void => {
		this.store.currentPlay.unmuteAll();
	};

	// 指定したURLからファイルをダウンロードする
	private downloadFile = (url: string, fileName: string): void => {
		const a = document.createElement("a");
		document.body.appendChild(a);
		a.href = url;
		a.download = fileName;
		a.click();
		document.body.removeChild(a);
	};

	private calcWindowLayout(): { top: number; left: number; width: number; height: number } {
		let restoreData;
		if (this.store.appOptions.experimentalOpen) {
			// localStorage から保存した window 情報を取得し、window の位置/サイズを復元して表示。
			// 取得した情報は localStorage から除去する。
			const name = "win_" + this.store.contentStore.defaultContent().gameLocationKey;
			const saveDataStr = localStorage.getItem(name);
			const saveDataAry = saveDataStr ? JSON.parse(saveDataStr) : [];
			restoreData = saveDataAry.shift();
			localStorage.setItem(name, JSON.stringify(saveDataAry));
		}

		const top = typeof restoreData?.y === "number" ? restoreData?.y : 0;
		const left = typeof restoreData?.y === "number" ? restoreData?.x : 0;
		let width;
		let height;

		const sandboxConfig = this.store.currentLocalInstance.content.sandboxConfig || {};
		const windowSize = sandboxConfig.windowSize;

		const calcAutoSize = (): { width: number; height: number } => {
			const gameJson = this.store.contentStore.defaultContent().gameJson;
			const width = gameJson.width + WINDOW_WIDTH_MARGIN;
			const height = gameJson.height + TOOL_BAR_HEIGHT + WINDOW_HEIGHT_MARGIN;
			return {width, height};
		};

		if (windowSize === "auto") {
			const autoSize = calcAutoSize();
			width = autoSize.width;
			height = autoSize.height;
		} else if (typeof windowSize === "object") {
			const autoSize = calcAutoSize();
			width = windowSize.width ?? autoSize.width;
			height = windowSize.height ?? autoSize.height;
		} else {
			width = typeof restoreData?.width === "number" ? restoreData?.width : window.innerWidth;
			height = typeof restoreData?.height === "number" ? restoreData?.height : window.innerHeight;
		}

		return { top, left, width, height };
	}
}
