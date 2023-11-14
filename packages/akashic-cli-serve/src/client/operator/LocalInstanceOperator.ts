import type { Store } from "../store/Store";

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

	resetByAge = async (age: number): Promise<void> => {
		const sp = await this.store.currentPlay!.amflow.getStartPointPromise({ frame: age });
		this.store.currentLocalInstance!.reset(sp);
	};

	togglePause = (pause: boolean): void => {
		this.store.currentLocalInstance!.togglePause(pause);
	};

	switchToReplay = (time: number): void => {
		this.store.currentLocalInstance!.setExecutionMode("replay");
		this.store.currentLocalInstance!.setTargetTime(time);
	};

	switchToRealtime = (): void => {
		this.store.currentLocalInstance!.setExecutionMode("passive");
		this.store.currentLocalInstance!.resume();
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
