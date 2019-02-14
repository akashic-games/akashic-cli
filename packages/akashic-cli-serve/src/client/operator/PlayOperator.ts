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
}
