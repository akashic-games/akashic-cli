import * as queryString from "query-string";

/**
 * URL のクエリパラメータから得られる値。
 *
 * ここで省略された値はすべて `null` 。
 */
export interface ServeQueryParameters {
	/**
	 * このインスタンスの動作モード。
	 *
	 * `"passive"` なら通常のゲームプレイ、 `"replay"` なら既にあるプレイのリプレイ再生。
	 * 指定されなかった場合、`"passive"` 同様に扱われる。
	 */
	mode: "passive" | "replay" | null;

	/**
	 * 接続するプレイの ID 。
	 *
	 * `mode: "passive"` の場合、通常省略してよい。
	 * `"passive"` でかつ指定されなかった場合、最後に作成されたプレイの ID が使われる。
	 * この時プレイが一つもなければ新たにプレイが作成され、その ID が使われる。
	 * (これによって「画面を開けばゲームが始まるか実行中のゲームにつながる」という動作になる)
	 *
	 * `mode: "replay"` の場合、必須。
	 * (`--debug-playlog` オプションでプレイログを与えた場合、playId `0` が与えられるので、
	 * 通常これを指定することが多いだろう)
	 */
	playId: string | null;

	/**
	 * リプレイモード開始時に、ゲームをリセットするフレーム。
	 *
	 * `mode: "replay"` の時のみ有効。
	 * Akashic Engine v3 系以降のコンテンツでのみ有効。
	 * 指定した場合、リプレイは、このフレームに最も近いスタートポイント(スナップショット)から開始される。
	 *
	 * 省略された場合、最初から開始される。
	 */
	replayResetAge: number | null;

	/**
	 * リプレイモード開始時の目標時刻。
	 * プレイ開始からのミリ秒で指定する。
	 *
	 * `mode: "replay"` の時のみ有効。
	 * 指定した場合、リプレイ再生は、この時刻からスタートする。
	 * (正確には、リプレイ再生の "目標時刻" がこの値からスタートする。
	 * インスタンスは目標時刻に追いつくまで早送りを行い、追いついたら等倍再生に移る)
	 *
	 * 省略した場合、 0 と同じように扱われる。
	 */
	replayTargetTime: number | null;

	/**
	 * このインスタンスをポーズ状態で開始する。
	 *
	 * 正確には、このインスタンスの "目標時刻" をポーズした状態で開始する。
	 * ゲームは目標時刻に追いつくまで進行され、それに到達する直前で止まる。
	 * 従って `replayTargetTime` と併用できる。この場合「指定時刻まで進んで止まる」動作になる。
	 *
	 * 省略した場合、偽と同じように扱われる。
	 */
	paused: boolean | null;

	// 以下、セッションストレージから復元されるが、クエリパラメータで指定すると上書きされる値。

	/**
	 * このインスタンスが使う playerId 。
	 * 指定しなければ他と重複しないユニークな値が設定される。
	 */
	playerId: string | null;

	/**
	 * このインスタンスに与えるプレイヤー名。
	 * @akashic-extension/resolve-player-info で得られる値。
	 */
	playerName: string | null;

	/**
	 * このインスタンスのプレイヤーの premium フラグを真にするか。
	 * @akashic-extension/resolve-player-info の実行結果に影響する。
	 */
	premium: boolean | null;

	// -------------------------------
	// 以下、UI に大きく依存する値のため、すべて実験的に提供される。
	// バージョン間に互換性はない。

	/**
	 * 開発者ツールを表示するか。
	 */
	showsDevtools: boolean | null;

	/**
	 * 開発者ツールの高さ (px)。
	 */
	devtoolsHeight: number | null;

	/**
	 * アクティブな開発者ツールのタブ。
	 */
	// TODO: 型をつける
	activeDevtool: string | null;

	/**
	 * シークバーでのシーク時に強制的に最も近いスナップショット(スタートポイント)から開始するか。
	 */
	isForceResetOnSeek: boolean | null;

	/**
	 * Events ツールでイベントリストを表示するか。
	 */
	showsEventList: boolean | null;

	/**
	 * Events ツールでのイベントリストの幅。
	 */
	eventListWidth: number | null;

	/**
	 * Events ツールでのイベント入力欄の内容。
	 */
	eventEditContent: string | null;

	/**
	 * ゲーム起動画面 (--no-auto-start 時) で選択している引数名。
	 */
	selectedArgumentName: string | null;

	/**
	 * ゲーム起動画面の引数リストの幅。
	 */
	instanceArgumentListWidth: number | null;

	/**
	 * ゲーム起動画面の引数入力欄の内容。
	 */
	instanceArgumentEditContent: string | null;

	/**
	 * ゲーム起動画面で、自動 join オプションにチェックを入れるか。
	 */
	joinsAutomatically: boolean | null;

	/**
	 * Entities ツールで、非表示状態のエンティティを表示するか。
	 */
	showsHiddenEntity: boolean | null;

	/**
	 * Niconico ツールのアクティブなページ。
	 */
	niconicoToolActigePage: "ranking" | "comment" | null;

	/**
	 * Niconico ツールの Ranking ページが有効な時に、セッションパラメータのイベントを送るか。
	 */
	isAutoSendEvents: boolean | null;

	/**
	 * Niconico ツール Ranking ページで、ranking モードのカウントダウンを行うか。
	 */
	emulatingShinichibaMode: string | null;

	/**
	 * Niconico ツール Ranking ページで、ranking モードの totalTimeLimit を game.json の preferredSessionParameters から決定するか。
	 */
	usePreferredTotalTimeLimit: boolean | null;

	/**
	 * Niconico ツール Ranking ページで、ranking モードの制限時間経過時にゲームを停止するか。
	 */
	stopsGameOnTimeout: boolean | null;

	/**
	 * Niconico ツール Ranking ページの totalTimeLimit 入力欄の内容。
	 */
	totalTimeLimitInputValue: number | null;

	/**
	 * ゲーム画面をブラウザサイズに合わせて拡縮するか。
	 */
	fitsToScreen: boolean | null;

	/**
	 * 背景画像を表示するか。
	 */
	showsBackgroundImage: boolean | null;

	/**
	 * 背景色を表示するか。
	 */
	 showsBackgroundColor: boolean | null;

	/**
	 * グリッドを表示するか。
	 */
	showsGrid: boolean | null;

	/**
	 * FPS などを表示するか。
	 */
	showsProfiler: boolean | null;

	/**
	 * ニコ生ゲームのデザインガイドライン画像を表示するか。
	 */
	showsDesignGuideline: boolean | null;

	// -------------------------------
	// 以下、内部利用のための定義。
	// 外部から利用すべきではない。

	id: string | null;

	/**
	 * sessionStorage を引き継がないでおくか。
	 *
	 * 少なくとも Mac Chrome では、 window.open() に noopener を渡しても sessionStorage が引き継がれてしまう(バグ？)。
	 * 止むを得ないので `?ignoreSession=1` が指定された時は sessionStorage を無視する。そのためのオプション。
	 * (ref. PlayOperator#openNewClientInstance())
	 *
	 * 純然たる内部利用フラグなので、パース後 URL のクエリパラメータから削除し、ユーザに見せない。
	 */
	ignoreSession: boolean | null;

	experimentalIsChildWindow: boolean | null;

	/**
	 * このインスタンスに適用する arguments 名を指定する。
	 * arguments の実装は sandbox.config.js から読み込まれる。
	 */
	argumentsName: string | null;

	/**
	 * このインスタンスに適用する arguments の実装を指定する。
	 * argumentsName と両方指定した場合の動作は不定である。
	 */
	argumentsValue: string | null;
}

function asString(v: string | string[] | null): string | null {
	return Array.isArray(v) ? v[v.length - 1] : (v ?? null);
}

function asEnum<T extends string>(v: string | string[] | null, candidates: string[]): T | null {
	const s = asString(v);
	return (s !== null && candidates.indexOf(s) !== -1) ? s as T : null;
}

function asBool(v: string | string[] | null): boolean | null {
	const s = asString(v);
	if (s === "true" || s === "1")
		return true;
	if (s === "false" || s === "0")
		return false;
	return null;
}

function asNumber(v: string | string[] | null): number | null {
	const s = asString(v);
	if (s == null)
		return null;
	const x = parseInt(s, 10);
	return isNaN(x) ? null : x;
}

export interface RawParsedQuery {
	[key: string]: string | string[] | null;
}

export function makeServeQueryParameters(query: RawParsedQuery): ServeQueryParameters {
	return {
		mode: asEnum(query.mode, ["passive", "replay"]),
		replayResetAge: asNumber(query.replayResetAge),
		replayTargetTime: asNumber(query.replayTargetTime),
		paused: asBool(query.paused),
		playId: asString(query.playId),
		playerId: asString(query.playerId),
		playerName: asString(query.playerName),
		premium: asBool(query.premium),
		showsDevtools: asBool(query.showsDevtools),
		devtoolsHeight: asNumber(query.devtoolsHeight),
		activeDevtool: asString(query.activeDevtool),
		isForceResetOnSeek: asBool(query.isForceResetOnSeek),
		showsEventList: asBool(query.showsEventList),
		eventListWidth: asNumber(query.eventListWidth),
		eventEditContent: asString(query.eventEditContent),
		selectedArgumentName: asString(query.selectedArgumentName),
		instanceArgumentListWidth: asNumber(query.instanceArgumentListWidth),
		instanceArgumentEditContent: asString(query.instanceArgumentEditContent),
		showsHiddenEntity: asBool(query.showsHiddenEntity),
		joinsAutomatically: asBool(query.joinsAutomatically),
		fitsToScreen: asBool(query.fitsToScreen),
		showsBackgroundImage: asBool(query.showsBackgroundImage),
		showsBackgroundColor: asBool(query.showsBackgroundColor),
		showsGrid: asBool(query.showsGrid),
		niconicoToolActigePage: asEnum(query.niconicoToolActigePage, ["ranking", "comment"]),
		isAutoSendEvents: asBool(query.isAutoSendEvents),
		emulatingShinichibaMode: asString(query.emulatingShinichibaMode),
		usePreferredTotalTimeLimit: asBool(query.usePreferredTotalTimeLimit),
		stopsGameOnTimeout: asBool(query.stopsGameOnTimeout),
		totalTimeLimitInputValue: asNumber(query.totalTimeLimitInputValue),
		showsProfiler: asBool(query.showsProfiler),
		showsDesignGuideline: asBool(query.showsDesignGuideline),
		id: asString(query.id),
		ignoreSession: asBool(query.ignoreSession),
		experimentalIsChildWindow: asBool(query.experimentalIsChildWindow),
		argumentsName: asString(query.argumentsName),
		argumentsValue: asString(query.argumentsValue)
	};
}

export const queryParameters: ServeQueryParameters = (function () {
	const query = queryString.parse(window.location.search);
	const ret = makeServeQueryParameters(query);

	if (ret.ignoreSession) {
		// ブラウザ不具合に対応するための内部利用用途なので、URLから消す。
		delete query.ignoreSession;
		history.replaceState(null, "", location.pathname + "?" + queryString.stringify(query));
	}

	return ret;
})();
