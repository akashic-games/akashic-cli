import { GetStartPointOptions } from "@akashic/amflow";
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
		this.store.currentLocalInstance.setExecutionMode("replay");
		this.store.currentLocalInstance.setTargetTime(time);
		this.store.toolBarUiStore.endPreviewSeek();

		if (this.store.devtoolUiStore.isForceResetOnSeek) {
			const timestamp = time + this.store.currentPlay.amflow.getStartedAt();
			this.resetByNearestStartPointOf({ timestamp }, false);
		}
	};

	resetToStartPointOfFrame = async (frame: number): Promise<void> => {
		await this.resetByNearestStartPointOf({ frame }, true);
	};

	resetToStartPointOfIndex = async (index: number): Promise<void> => {
		const sps = this.store.currentPlay.startPointHeaders;
		await this.resetByNearestStartPointOf({ frame: sps[index].frame }, true);
	};

	/**
	 * 条件にもっとも近いスタートポイントでローカルインスタンスをリセットする。
	 * toSeek が真なら、さらにリセットした時点にシークする。
	 * ローカルインスタンスがリセット可能でない (Akashic Engine v2 以前) 場合、何もしない。
	 */
	resetByNearestStartPointOf = async (opts: GetStartPointOptions, toSeek: boolean): Promise<void> => {
		if (!this.store.currentLocalInstance.isResettable)
			return;
		const amflow = this.store.currentLocalInstance.play.amflow;
		const sp = await amflow.getStartPointPromise(opts);
		this.store.currentLocalInstance.reset(sp);
		if (toSeek) {
			this.seekTo(sp.timestamp - amflow.getStartedAt());
		}
	};

	togglePause = (pause: boolean): void => {
		this.store.currentLocalInstance.togglePause(pause);
	};

	switchToRealtime = (): void => {
		this.store.currentLocalInstance.setExecutionMode("passive");
		this.store.currentLocalInstance.resume();
	};
}
