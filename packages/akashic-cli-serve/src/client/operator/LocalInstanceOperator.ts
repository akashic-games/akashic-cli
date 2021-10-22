import { Store } from "../store/Store";

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
			const amflow = this.store.currentPlay.amflow;
			const sp = await amflow.getStartPointPromise({ timestamp: time + amflow.getStartedAt() });
			this.store.currentLocalInstance.reset(sp);
		}
	};

	seekToStartPoint = (frame: number): void => {
		this.store.currentLocalInstance.setExecutionMode("replay");
		this.store.currentLocalInstance.setFrameWithStartPoint(frame, (targetTime) => {
			this.store.toolBarUiStore.seekTo(targetTime);
		});
	};

	resetByAge = async (age: number): Promise<void> => {
		const sp = await this.store.currentPlay.amflow.getStartPointPromise({ frame: age });
		this.store.currentLocalInstance.reset(sp);
	};

	togglePause = (pause: boolean): void => {
		this.store.currentLocalInstance.togglePause(pause);
	};

	switchToReplay = (time: number): void => {
		this.store.currentLocalInstance.setExecutionMode("replay");
		this.store.currentLocalInstance.setTargetTime(time);
	};

	switchToRealtime = (): void => {
		this.store.currentLocalInstance.setExecutionMode("passive");
		this.store.currentLocalInstance.resume();
	};
}
