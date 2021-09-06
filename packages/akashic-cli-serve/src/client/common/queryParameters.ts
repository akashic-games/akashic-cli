import * as queryString from "query-string";

export interface QueryParameter {
	playId?: string;
	playerName?: string;
	mode?: "replay" | "passive";
	replayResetFrame?: number;
	replayTargetTime?: number;
	paused?: boolean;

	id?: string;

	/**
	 * 内部利用用。
	 */
	ignoreSession?: boolean;
	experimentalIsChildWindow?: "1";

	// セッションストレージから復元されるが、クエリパラメータで指定すると上書きされる値
	showsDevtools?: boolean; // false
	devtoolsHeight?: number; // 200
	activeDevtool?: "Instances" | // "Instances"
	showsEventList?: boolean; // true
	eventListWidth?: number; // 150
	eventEditContent?: string; // ""
	selectedArgumentName?: string | null; // null
	instanceArgumentListWidth?: number; // 150
	instanceArgumentEditContent?: string; // ""
	showsHiddenEntity?: boolean; // true
	joinsAutomatically?: boolean; // false
	showsBackgroundImage?: boolean; // false
	showsGrid?: boolean; // false
	isAutoSendEvents?: boolean; // false
	emulatingShinichibaMode?: "single" | string; // "single"
	usePreferredTotalTimeLimit?: choose(asBool(getQueryValue(qp.usePreferredTotalTimeLimit)), s.usePreferredTotalTimeLimit, false),
	stopsGameOnTimeout?: choose(asBool(getQueryValue(qp.stopsGameOnTimeout)), s.stopsGameOnTimeout, false),
	totalTimeLimitInputValue?: choose(asNumber(getQueryValue(qp.totalTimeLimitInputValue)), s.totalTimeLimitInputValue, 85),
	showsProfiler?: choose(asBool(getQueryValue(qp.showsProfiler)), s.showsProfiler, false),
	showsDesignGuideline?: choose(asBool(getQueryValue(qp.showsDesignGuideline)), s.showsDesignGuideline, false),
	premium?: choose(asBool(getQueryValue(qp.premium)), s.premium, false)

}

export function getQueryParameter(): QueryParameter {
	const query = queryString.parse(window.location.search);
}
