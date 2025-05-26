// TODO sandbox-configuration に移動

/**
 * コメントツールから送信・自動送信される各コメントの内容
 *
 * コメントツールはここで指定されたとおりに扱う。
 * 実際のコメントが満たす制約については NamagameCommentPlugin.ts の `NamagameComment` を参照のこと。
 * (たとえば `isOperatorComment` が真の場合 `userID` は省略されるが、この設定はその制約を無視できる)
 */
export interface NamagameCommentConfigComment {
	/**
	 * コメント本文。
	 */
	comment: string;

	/**
	 * コメントのコマンド指定。(e.g. "shita big red")
	 */
	command?: string;

	/**
	 * コメントを送信したユーザの ID 。
	 */
	userID?: string;

	/**
	 * なふだ機能が OFF であるか否か。
	 * 省略された場合、コンテンツは偽として扱う必要がある。
	 */
	isAnonymous?: boolean;

	/**
	 * 放送者コメントであるか。
	 * 省略された場合、コンテンツは偽として扱う必要がある。
	 */
	isOperatorComment?: boolean;

	/**
	 * このコメントの送信フレーム。
	 *
	 * 値は送信契機からの経過フレーム数である。
	 * 0 以上の整数でなければならない。
	 *
	 * この値は送信タイミングであり、コンテンツが受信するタイミングはこれより後になることに注意。
	 * 送信契機が `"playStart"`, `"pluginStart"` の場合、受信は 1 フレーム後になる 。
	 * `"manual"` の場合は (UI 操作がサーバに伝わる時間差がありうるため) より後になる可能性がある。
	 *
	 * 省略した場合、(これを含む) 配列の直前の要素の `.frame` と同値と見なされる。
	 * (配列の第 0 要素である時は 0 と見なされる)
	 */
	frame?: number;
}

/**
 * namagameComment プラグインのコメントテンプレート定義。
 */
export interface NamagameCommentConfigTemplate {
	/**
	 * このテンプレートの送信契機。
	 *
	 * - `"playStart"`: ゲームプレイ開始時から送られる。
	 *   `comemnts` 各要素の `.frame` はゲーム開始からのフレーム数と見なされる。
	 * - `"pluginStart"`: namagameComment プラグインの `start()` 呼び出し直後から送られる。
	 *   `comemnts` 各要素の `.frame` は `start()` 呼び出し時点からのフレーム数と見なされる。
	 * - `"manual"`: 自動送信されない。akashic serve のコメントツールの UI 操作で送られる。(未実装)
	 *
	 * ただしこの送信契機にかかわらず、namagameComment プラグインの `start()` メソッドを呼び出さない限り
	 * コンテンツがコメントデータを受信することはない点に注意。
	 */
	startBy?: "playStart" | "pluginStart" | "manual";

	/**
	 * 送信するコメントの内容。
	 */
	comments: NamagameCommentConfigComment[];
}

/**
 * namagameComment プラグインの設定。
 */
export interface NamagameCommentConfig {
	/**
	 * コメントツールで流すコメントのテンプレート。
	 * キー名はテンプレート名、値はテンプレートの内容。
	 */
	templates?: { [name: string]: NamagameCommentConfigTemplate };
}

/**
 * sandbox.config.js の型 (SnadboxConfiguration) に対する拡張。
 * TODO sandbox-configuration の SandboxConfiguration, NormalizedSandboxConfiguration に取り込む。
 */
export interface SandboxConfigExternalDefinition {
	external?: {
		namagameComment?: NamagameCommentConfig;
	};
}
