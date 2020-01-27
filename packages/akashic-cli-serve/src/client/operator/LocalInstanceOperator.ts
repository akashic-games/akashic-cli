import { Store } from "../store/Store";

export class LocalInstanceOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	previewSeekTo = (seconds: number): void => {
		this.store.toolBarUiStore.previewSeekTo(seconds);
	}

	seekTo = (seconds: number): void => {
		this.store.currentLocalInstance.setExecutionMode("replay");
		this.store.currentLocalInstance.setTargetTime(seconds);
		this.store.toolBarUiStore.endPreviewSeek();
	}

	togglePause = (pause: boolean): void => {
		this.store.currentLocalInstance.togglePause(pause);
	}

	switchToRealtime = (): void => {
		this.store.currentLocalInstance.setExecutionMode("passive");
		this.store.currentLocalInstance.resume();
	}

	volumeChangeTo = (vol: number): void => {
		this.store.toolBarUiStore.volumeSeekTo(vol);
		this.store.changeVolume(vol / 100);
	}

	volumeSeekTo = (vol: number): void => {
		this.store.toolBarUiStore.endVolumeSeek(vol);
		this.store.changeVolume(vol / 100);
	}
}
