import type { Store } from "../Store";

export class LocalInstanceOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	previewSeekTo = (time: number): void => {
		this.store.toolBarUiStore.previewSeekTo(time);
	};

	seekTo = async (time: number): Promise<void> => {
		this.store.toolBarUiStore.endPreviewSeek();
		this.switchToReplay(time);

		if (this.store.devtoolUiStore.isForceResetOnSeek) {
			const amflow = this.store.currentPlay!.amflow;
			const sp = await amflow.getStartPointPromise({ timestamp: time + (amflow.getStartedAt() ?? 0)});
			this.store.currentLocalInstance!.reset(sp);
		}
	};

	jumpToStartPointOfIndex = async (index: number): Promise<void> => {
		const { amflow, startPointHeaders } = this.store.currentPlay!;
		const sp = await amflow.getStartPointPromise({ frame: startPointHeaders[index].frame });
		this.store.currentLocalInstance!.reset(sp);
		this.switchToReplay(sp.timestamp - (amflow.getStartedAt() ?? 0));
	};

	togglePause = (pause: boolean): Promise<void> => {
		// NOTE: この箇所は active instance がサーバ上にあることを前提にしている共通コードを流用しているため、
		// やむなく PlayEntity と LocalInstanceEntity のメソッドを個別に呼んでいる。
		const executionMode = this.store.currentLocalInstance!.executionMode;
		if (pause) {
			this.store.currentPlay!.handleRunnerPause();
			if (executionMode !== "replay") {
				this.store.currentPlay!.pauseTimekeeper();
			}
		} else {
			this.store.currentPlay!.handleRunnerResume();
			if (executionMode !== "replay") {
				this.store.currentPlay!.startTimekeeper();
			}
		}

		return this.store.currentLocalInstance!.togglePause(pause);
	};

	switchToReplay = (time: number): void => {
		// NOTE: この箇所は active instance がサーバ上にあることを前提にしている共通コードを流用しているため、
		// やむなく PlayEntity と LocalInstanceEntity のメソッドを個別に呼んでいる。
		this.store.currentPlay!.pauseTimekeeper();
		this.store.currentPlay!.handleRunnerPause();
		this.store.currentLocalInstance!.setExecutionMode("replay");
		this.store.currentLocalInstance!.setTargetTime(time);
	};

	switchToRealtime = (): Promise<void> => {
		// NOTE: この箇所は active instance がサーバ上にあることを前提にしている共通コードを流用しているため、
		// やむなく PlayEntity と LocalInstanceEntity のメソッドを個別に呼んでいる。
		this.store.currentPlay!.startTimekeeper();
		this.store.currentPlay!.handleRunnerResume();

		// !!FIXME: この箇所は Passive + Realtime で最新フレームまで追いついた後に Active + Realtime と修正することを検討
		this.store.currentLocalInstance!.setExecutionMode("active");
		return this.store.currentLocalInstance!.resume();
	};

	saveScreenshot = (): void => {
		const data = this.store.currentLocalInstance?.makeScreenshotData();
		downloadBase64(data!);
	};
}

// NOTE: 本来OperatorはDOM操作とは独立しているが、この関数で生成するaタグはGUIのReactと関係なくこの処理で完結する
// ほかに適切な定義場所がないため、ここで実装する
function downloadBase64(data: string): void {
	const link = document.createElement("a");
	link.setAttribute("href", data);
	link.setAttribute("download", "screen.png");
	link.click();
	link.remove();
}
