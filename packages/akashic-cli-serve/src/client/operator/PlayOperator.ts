import { Store } from "../store/Store";

export class PlayOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	togglePauseActive = (pauses: boolean): void => {
		if (pauses) {
			this.store.currentPlay.pauseActive();
		} else {
			this.store.currentPlay.resumeActive();
		}
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
		// ignoreSession は Mac Chrome の不具合(？)対策でやむなくつけているフラグ。 (ref. ../store/storage.ts)
		window.open(
			window.location.pathname + "?ignoreSession=1",
			"_blank",
			`width=${window.innerWidth},height=${window.innerHeight},noopener`
		);
	}

	sendRegisteredEvent = (eventName: string): void => {
		const pevs = this.store.sandboxConfig.events[eventName];
		const amflow = this.store.currentPlay.amflow;
		pevs.forEach((pev: any) => amflow.sendEvent(pev));
	}

	sendEditorEvent = (): void => {
		const pevs = JSON.parse(this.store.devtoolUiStore.eventEditContent);
		const amflow = this.store.currentPlay.amflow;
		pevs.forEach((pev: any) => amflow.sendEvent(pev));
	}

	updateEntityList = (): void => {
		const game: any = this.store.currentPlay.localInstances[0].gameContent.getGame();
		const children = game.scene().children;
		const entities: any[] = [];
		children.forEach((element: any) => {
			entities.push(createEntityObject(element));
		});
		this.store.devtoolUiStore.updateEntityList(JSON.stringify(entities));
	}
}

function createEntityObject(e: any) {
	var obj = {id: e.id, className: e.constructor.name, children: [] as any[]};
	if (e.children && e.children.length > 0) {
		e.children.forEach(function(c: any) {
			obj.children.push(createEntityObject(c));
		});
	}
	return obj;
}
