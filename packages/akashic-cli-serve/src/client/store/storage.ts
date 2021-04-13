import * as queryString from "query-string";
import * as ApiClient from "../api/ApiClient";

export interface StorageData {
	playerId: string;
	playerName: string;
	premium: boolean;
	showsDevtools: boolean;
	devtoolsHeight: number;
	activeDevtool: string;
	showsEventList: boolean;
	eventListWidth: number;
	eventEditContent: string;
	selectedArgumentName: string | null;
	instanceArgumentListWidth: number;
	instanceArgumentEditContent: string;
	showsHiddenEntity: boolean;
	joinsAutomatically: boolean;
	showsBackgroundImage: boolean;
	showsGrid: boolean;
	isAutoSendEvents: boolean;
	emulatingShinichibaMode: string;
	usePreferredTotalTimeLimit: boolean;
	stopsGameOnTimeout: boolean;
	totalTimeLimitInputValue: number;
	showsProfiler: boolean;
	showsDesignGuideline: boolean;
}

function asBool(s: string | null): boolean | null {
	return (s === "true") ? true : ((s === "false") ? false : null);
}

function asNumber(s: string | null): number | null {
	if (s == null)
		return null;
	const x = parseInt(s, 10);
	return isNaN(x) ? null : x;
}

function choose<T>(a: T | null | undefined, b: T | null | undefined, c: T): T {
	return (a != null) ? a : ((b != null) ? b : c);
}

function getQueryValue(queryValue: string | string[]): string {
	return queryValue as string; // TODO クエリの値が配列の場合の対応を考える
}

export class Storage {
	static SESSION_STORAGE_KEY: string = "aktb:config";

	data: StorageData;
	experimentalIsChildWindow = false;

	private _initializationWaiter: Promise<void>;

	constructor() {
		const qp = queryString.parse(window.location.search);

		// 少なくとも Mac Chrome では、 window.open() に noopener を渡しても sessionStorage が引き継がれてしまう(バグ？)。
		// 止むを得ないので `?ignoreSession=1` が指定された時は sessionStorage を無視する。
		// (ref. PlayOperator#openNewClientInstance())
		const ignoreSession = (qp.ignoreSession === "1");
		if (ignoreSession) {
			delete qp.ignoreSession;
			history.replaceState(null, null, location.pathname + "?" + queryString.stringify(qp));
		}

		let s: any;
		if (ignoreSession) {
			s = {};
		} else {
			try {
				const sessionData = window.sessionStorage.getItem(Storage.SESSION_STORAGE_KEY) || "{}";
				s = JSON.parse(sessionData);
			} catch (e) {
				s = {};
			}
		}

		if (qp.experimentalIsChildWindow) {
			this.experimentalIsChildWindow = qp.experimentalIsChildWindow === "1";
		}

		this.put({
			showsDevtools: choose(asBool(getQueryValue(qp.showsDevtools)), s.showsDevtools, false),
			devtoolsHeight: choose(asNumber(getQueryValue(qp.devtoolsHeight)), s.devtoolsHeight, 200),
			activeDevtool: choose(getQueryValue(qp.activeDevtool), s.activeDevtool, "Instances"),
			showsEventList: choose(asBool(getQueryValue(qp.showsEventList)), s.showsEventList, true),
			eventListWidth: choose(asNumber(getQueryValue(qp.eventListWidth)), s.eventListWidth, 150),
			eventEditContent: choose(getQueryValue(qp.eventEditContent), s.eventEditContent, ""),
			selectedArgumentName: choose(getQueryValue(qp.selectedArgumentName), s.selectedArgumentName, null),
			instanceArgumentListWidth: choose(asNumber(getQueryValue(qp.instanceArgumentListWidth)), s.instanceArgumentListWidth, 150),
			instanceArgumentEditContent: choose(getQueryValue(qp.instanceArgumentEditContent), s.instanceArgumentEditContent, ""),
			showsHiddenEntity: choose(asBool(getQueryValue(qp.showsHiddenEntity)), s.showsHiddenEntity, true),
			joinsAutomatically: choose(asBool(getQueryValue(qp.joinsAutomatically)), s.joinsAutomatically, false),
			showsBackgroundImage: choose(asBool(getQueryValue(qp.showsBackgroundImage)), s.showsBackgroundImage, false),
			showsGrid: choose(asBool(getQueryValue(qp.showsGrid)), s.showsGrid, false),
			isAutoSendEvents: choose(asBool(getQueryValue(qp.isAutoSendEvents)), s.isAutoSendEvents, false),
			emulatingShinichibaMode: choose(getQueryValue(qp.emulatingShinichibaMode), s.emulatingShinichibaMode, "single"),
			usePreferredTotalTimeLimit: choose(asBool(getQueryValue(qp.usePreferredTotalTimeLimit)), s.usePreferredTotalTimeLimit, false),
			stopsGameOnTimeout: choose(asBool(getQueryValue(qp.stopsGameOnTimeout)), s.stopsGameOnTimeout, false),
			totalTimeLimitInputValue: choose(asNumber(getQueryValue(qp.totalTimeLimitInputValue)), s.totalTimeLimitInputValue, 85),
			showsProfiler: choose(asBool(getQueryValue(qp.showsProfiler)), s.showsProfiler, false),
			showsDesignGuideline: choose(asBool(getQueryValue(qp.showsDesignGuideline)), s.showsDesignGuideline, false),
			premium: choose(asBool(getQueryValue(qp.premium)), s.premium, false)
		});

		const playerId: string = choose(getQueryValue(qp.playerId), s.playerId, undefined);
		this._initializationWaiter = ApiClient.registerPlayerId(playerId).then(response => {
			// プレイヤーID重複の警告等はどのように表示すべきか？
			const registered = response.data.playerId;
			const playerName: string = choose(getQueryValue(qp.playerName), s.playerName, `player${registered}`);
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
