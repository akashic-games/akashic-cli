import * as queryString from "query-string";

export interface StorageData {
	playerId: string;
	playerName: string;
	showsDevtools: boolean;
	devtoolsHeight: number;
	activeDevtool: string;
	showsEventList: boolean;
	eventListWidth: number;
	eventEditContent: string;
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
			history.replaceState(null, null, location.pathname + queryString.stringify(qp));
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

		const playerId =  choose(qp.playerId, s.playerId, ("" + Date.now())); // TODO 名前も含めサーバに問い合わせる？
		this.put({
			playerId,
			playerName: choose(qp.playerName, s.playerName, ("player" + playerId)),
			showsDevtools: choose(asBool(qp.showsDevtools), s.showsDevtools, false),
			devtoolsHeight: choose(asNumber(qp.devtoolsHeight), s.devtoolsHeight, 200),
			activeDevtool: choose(qp.activeDevtool, s.activeDevtool, "Instances"),
			showsEventList: choose(asBool(qp.showsEventList), s.showsEventList, true),
			eventListWidth: choose(asNumber(qp.eventListWidth), s.eventListWidth, 150),
			eventEditContent: choose(qp.eventEditContent, s.eventEditContent, "")
		});
	}

	put(data: Partial<StorageData>): void {
		this.data = { ...this.data, ...data };
		window.sessionStorage.setItem(Storage.SESSION_STORAGE_KEY, JSON.stringify(this.data));
	}
}

export const storage = new Storage(); // singletonなのは暫定。
