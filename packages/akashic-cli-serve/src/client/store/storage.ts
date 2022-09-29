import { apiClient } from "../api/apiClientInstance";
import { queryParameters as query } from "../common/queryParameters";

export interface StorageData {
	playerId: string;
	playerName: string;
	premium: boolean;
	showsDevtools: boolean;
	devtoolsHeight: number;
	activeDevtool: string;
	isForceResetOnSeek: boolean;
	showsEventList: boolean;
	eventListWidth: number;
	eventEditContent: string;
	selectedArgumentName: string | null;
	instanceArgumentListWidth: number;
	instanceArgumentEditContent: string;
	showsHiddenEntity: boolean;
	joinsAutomatically: boolean;
	fitsToScreen: boolean;
	showsBackgroundImage: boolean;
	showsBackgroundColor: boolean;
	showsGrid: boolean;
	isAutoSendEvents: boolean;
	emulatingShinichibaMode: string;
	usePreferredTotalTimeLimit: boolean;
	stopsGameOnTimeout: boolean;
	totalTimeLimitInputValue: number;
	showsProfiler: boolean;
	showsDesignGuideline: boolean;
}

function choose<T>(a: T | null | undefined, b: T | null | undefined, c: T): T {
	return (a != null) ? a : ((b != null) ? b : c);
}

export class Storage {
	static SESSION_STORAGE_KEY: string = "aktb:config";

	data: StorageData;
	experimentalIsChildWindow: boolean = false;

	private _initializationWaiter: Promise<void>;

	constructor() {
		let s: any;
		if (query.ignoreSession) {
			s = {};
		} else {
			try {
				const sessionData = window.sessionStorage.getItem(Storage.SESSION_STORAGE_KEY) || "{}";
				s = JSON.parse(sessionData);
			} catch (e) {
				s = {};
			}
		}

		this.experimentalIsChildWindow = query.experimentalIsChildWindow;

		this.put({
			showsDevtools: choose(query.showsDevtools, s.showsDevtools, false),
			devtoolsHeight: choose(query.devtoolsHeight, s.devtoolsHeight, 200),
			activeDevtool: choose(query.activeDevtool, s.activeDevtool, "Playback"),
			isForceResetOnSeek: choose(query.isForceResetOnSeek, s.isForceResetOnSeek, false),
			showsEventList: choose(query.showsEventList, s.showsEventList, true),
			eventListWidth: choose(query.eventListWidth, s.eventListWidth, 150),
			eventEditContent: choose(query.eventEditContent, s.eventEditContent, ""),
			selectedArgumentName: choose(query.selectedArgumentName, s.selectedArgumentName, null),
			instanceArgumentListWidth: choose(query.instanceArgumentListWidth, s.instanceArgumentListWidth, 150),
			instanceArgumentEditContent: choose(query.instanceArgumentEditContent, s.instanceArgumentEditContent, ""),
			showsHiddenEntity: choose(query.showsHiddenEntity, s.showsHiddenEntity, true),
			joinsAutomatically: choose(query.joinsAutomatically, s.joinsAutomatically, false),
			// displayOptions の初期値は sandbox.config.js の値を反映するため undefined に設定し、ToolBarUiStore で設定
			fitsToScreen: choose(query.fitsToScreen, s.fitsToScreen, undefined),
			showsBackgroundImage: choose(query.showsBackgroundImage, s.showsBackgroundImage, undefined),
			showsBackgroundColor: choose(query.showsBackgroundColor, s.showsBackgroundColor, undefined),
			showsGrid: choose(query.showsGrid, s.showsGrid, undefined),
			showsProfiler: choose(query.showsProfiler, s.showsProfiler, undefined),
			showsDesignGuideline: choose(query.showsDesignGuideline, s.showsDesignGuideline, undefined),
			isAutoSendEvents: choose(query.isAutoSendEvents, s.isAutoSendEvents, false),
			emulatingShinichibaMode: choose(query.emulatingShinichibaMode, s.emulatingShinichibaMode, "single"),
			usePreferredTotalTimeLimit: choose(query.usePreferredTotalTimeLimit, s.usePreferredTotalTimeLimit, false),
			stopsGameOnTimeout: choose(query.stopsGameOnTimeout, s.stopsGameOnTimeout, false),
			totalTimeLimitInputValue: choose(query.totalTimeLimitInputValue, s.totalTimeLimitInputValue, 85),
			premium: choose(query.premium, s.premium, false)
		});

		const playerId: string = choose(query.playerId, s.playerId, undefined);
		this._initializationWaiter = apiClient.registerPlayerId(playerId).then(response => {
			// プレイヤーID重複の警告等はどのように表示すべきか？
			const registered = response.data.playerId;
			const playerName: string = choose(query.playerName, s.playerName, `player-${registered}`);
			this.put({ playerId: registered, playerName });
		});
	}

	assertInitialized(): Promise<void> {
		return this._initializationWaiter;
	}

	put(data: Partial<StorageData>): void {
		this.data = { ...this.data, ...data };
		try {
			window.sessionStorage.setItem(Storage.SESSION_STORAGE_KEY, JSON.stringify(this.data));
		} catch (e) {
			console.error("Failed to sessionStorage.setItem()", e);
		}
	}
}

export const storage = new Storage(); // singletonなのは暫定。
