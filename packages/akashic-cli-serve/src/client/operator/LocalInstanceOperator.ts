import { GetStartPointOptions } from "@akashic/amflow";
import { Store } from "../store/Store";

export class LocalInstanceOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	previewSeekTo = (time: number): void => {
		this.store.toolBarUiStore.previewSeekTo(time);
	}

	seekTo = (time: number): void => {
		this.store.currentLocalInstance.setExecutionMode("replay");
		this.store.currentLocalInstance.setTargetTime(time);
		this.store.toolBarUiStore.endPreviewSeek();
	}

	seekToStartPoint = (frame: number): void => {
		this.store.currentLocalInstance.setExecutionMode("replay");
		this.store.currentLocalInstance.setFrameWithStartPoint(frame, (targetTime) => {
			this.store.toolBarUiStore.seekTo(targetTime);
		});
	}

	seekToStartPointOf = async (frame: number): Promise<void> => {
		this.resetByNearestStartPointOf({ frame }, true);
	}

	/**
	 * 条件にもっとも近いスタートポイントでローカルインスタンスをリセットする。
	 * toSeek が真なら、さらにリセットした時点にシークする。
	 * ローカルインスタンスがリセット可能でない (Akashic Engine v2 以前) 場合、何もしない。
	 */
	resetByNearestStartPointOf = async (opts: GetStartPointOptions, toSeek: boolean): Promise<void> => {
		const amflow = this.store.currentLocalInstance.play.amflow;
		const startedAt = amflow.getStartedAt();
		const sp = await amflow.getStartPointPromise(opts);
		if (!this.store.currentLocalInstance.isResettable)
			return;
		this.store.currentLocalInstance.reset(sp);
		if (toSeek) {
			this.seekTo(sp.timestamp - amflow.getStartedAt());
		}
	}

	togglePause = (pause: boolean): void => {
		this.store.currentLocalInstance.togglePause(pause);
	}

	switchToRealtime = (): void => {
		this.store.currentLocalInstance.setExecutionMode("passive");
		this.store.currentLocalInstance.resume();
	}
}
