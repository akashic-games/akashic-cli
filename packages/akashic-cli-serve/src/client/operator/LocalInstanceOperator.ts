import { Store } from "../store/Store";
import { ELikeListItem } from "../store/DevtoolUiStore";

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

	updateEntityList = (): void => {
		const game: any = this.store.currentPlay.localInstances[0].gameContent.getGame();
		const children = game.scene().children;
		const entities: ELikeListItem[] = (children || []).map(createEntityObject);
		this.store.devtoolUiStore.setEntityList(entities);
	}
}

/**
 * 引数の e にはAkashic Engineのg.Eが渡る
 */
function createEntityObject(e: ELike) {
	const obj = {id: e.id, className: e.constructor.name, children: [] as ELike[]};
	obj.children = (e.children || []).map((c) => createEntityObject(c));
	return obj;
}

interface ELike {
	id: number;
	children: ELike[];
}
