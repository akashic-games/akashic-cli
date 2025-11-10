import { apiClient } from "../api/apiClientInstance";
import { queryParameters as query } from "../common/queryParameters";
import type { NiconicoDevtoolPageType } from "../view/molecule/NiconicoDevtool";

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
	niconicoToolActivePage: NiconicoDevtoolPageType;
	niconicoToolSelectorWidth: number;
	audioVolume: number;
}

function choose<T>(a: T | null | undefined, b: T | null | undefined, c: T): T {
	return (a != null) ? a : ((b != null) ? b : c);
}

export class Storage {
	static SESSION_STORAGE_KEY: string = "aktb:config";

	data!: StorageData;

	// query から解決するのでここに保持しているが、永続化はしない値。
	// 将来的にまとめて interface に切り出すか、そもそも storage の管轄外に出すか検討。
	experimentalIsChildWindow: boolean | null = false;
	hashedPlayerId: string | null = null;

	private _initializationWaiter: Promise<[void, void]>;

	constructor() {
		let s: any;
		if (query.ignoreSession) {
			s = {};
		} else {
			try {
				const sessionData = window.sessionStorage.getItem(Storage.SESSION_STORAGE_KEY) || "{}";
				s = JSON.parse(sessionData);
			} catch (_e) {
				s = {};
			}
		}

		this.experimentalIsChildWindow = query.experimentalIsChildWindow;

		this.put({
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
			niconicoToolActivePage: choose(query.niconicoToolActigePage, s.niconicoToolActivePage, "ranking"),
			isAutoSendEvents: choose(query.isAutoSendEvents, s.isAutoSendEvents, false),
			emulatingShinichibaMode: choose(query.emulatingShinichibaMode, s.emulatingShinichibaMode, "single"),
			usePreferredTotalTimeLimit: choose(query.usePreferredTotalTimeLimit, s.usePreferredTotalTimeLimit, false),
			stopsGameOnTimeout: choose(query.stopsGameOnTimeout, s.stopsGameOnTimeout, false),
			totalTimeLimitInputValue: choose(query.totalTimeLimitInputValue, s.totalTimeLimitInputValue, 85),
			premium: choose(query.premium, s.premium, false),
			audioVolume: choose(query.audioVolume, s.audioVolume, 100)
		});

		const playerId: string = choose(query.playerId, s.playerId, undefined);
		this._initializationWaiter = Promise.all([
			apiClient.registerPlayerId(playerId).then(response => {
				const { playerId: registered, isDuplicated, hashedPlayerId } = response.data;
				const playerName: string = choose(query.playerName, s.playerName, `player-${registered}`);
				this.put({ playerId: registered, playerName });
				this.hashedPlayerId = hashedPlayerId;
				void isDuplicated; // (プレイヤーID重複) の扱い未定
			}),
			// TODO: 暫定で 0 番目のコンテンツの sandboxConfig を取得する。ルートセッションのコンテンツの値を使うべき
			apiClient.getSandboxConfig(0).then(res => {
				const displayOptions = res?.data?.displayOptions;
				this.put({
					fitsToScreen: choose(query.fitsToScreen, s.fitsToScreen, displayOptions.fitsToScreen),
					showsBackgroundImage: choose(query.showsBackgroundImage, s.showsBackgroundImage, !!displayOptions.backgroundImage),
					showsBackgroundColor: choose(query.showsBackgroundColor, s.showsBackgroundColor, !!displayOptions.backgroundColor),
					showsGrid: choose(query.showsGrid, s.showsGrid, displayOptions.showsGrid),
					showsProfiler: choose(query.showsProfiler, s.showsProfiler, displayOptions.showsProfiler),
					showsDesignGuideline: choose(
						query.showsDesignGuideline, s.showsDesignGuideline, displayOptions.showsDesignGuideline
					),
					showsDevtools: choose(query.showsDevtools, s.showsDevtools, res?.data?.showMenu)
				});
			})
		]);
	}

	assertInitialized(): Promise<[void, void]> {
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
