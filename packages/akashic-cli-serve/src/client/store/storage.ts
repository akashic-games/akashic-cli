import * as queryString from "query-string";
import { ELikeListItem } from "./DevtoolUiStore";

export interface StorageData {
	playerId: string;
	playerName: string;
	showsDevtools: boolean;
	showsBgImage: boolean;
	devtoolsHeight: number;
	activeDevtool: string;
	showsEventList: boolean;
	eventListWidth: number;
	eventEditContent: string;
	selectedArgumentName: string | null;
	instanceArgumentListWidth: number;
	instanceArgumentEditContent: string;
	joinsAutomatically: boolean;
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

		const playerId =  choose(getQueryValue(qp.playerId), s.playerId, ("" + Date.now())); // TODO 名前も含めサーバに問い合わせる？
		this.put({
			playerId,
			playerName: choose(getQueryValue(qp.playerName), s.playerName, ("player" + playerId)),
			showsDevtools: choose(asBool(getQueryValue(qp.showsDevtools)), s.showsDevtools, false),
			devtoolsHeight: choose(asNumber(getQueryValue(qp.devtoolsHeight)), s.devtoolsHeight, 200),
			activeDevtool: choose(getQueryValue(qp.activeDevtool), s.activeDevtool, "Instances"),
			showsEventList: choose(asBool(getQueryValue(qp.showsEventList)), s.showsEventList, true),
			eventListWidth: choose(asNumber(getQueryValue(qp.eventListWidth)), s.eventListWidth, 150),
			eventEditContent: choose(getQueryValue(qp.eventEditContent), s.eventEditContent, ""),
			selectedArgumentName: choose(getQueryValue(qp.selectedArgumentName), s.selectedArgumentName, null),
			instanceArgumentListWidth: choose(asNumber(getQueryValue(qp.instanceArgumentListWidth)), s.instanceArgumentListWidth, 150),
			instanceArgumentEditContent: choose(getQueryValue(qp.instanceArgumentEditContent), s.instanceArgumentEditContent, ""),
			joinsAutomatically: choose(asBool(getQueryValue(qp.joinsAutomatically)), s.joinsAutomatically, false)
		});
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
