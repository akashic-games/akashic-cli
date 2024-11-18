// TODO コンテンツから参照できるように切り出す

/**
 * コメントデータ。
 */
export interface NicoliveComment {
	/**
	 * コメント本文。
	 *
	 * `start()` 時の `fields` で省かれた場合、省略される。
	 */
	comment?: string;

	/**
	 * コメントのコマンド指定。(e.g. "shita big red")
	 *
	 * `start()` 時の `fields` で省かれた場合、省略される。
	 */
	command?: string;

	/**
	 * コメントを送信したユーザ ID 。
	 *
	 * 次のいずれかの場合、省略される:
	 *  - 「なふだ機能」が ON のコメントである場合
	 *  - 放送者コメントである場合
	 *  -  `start()` 時の `fields` で省かれた場合
	 */
	userID?: string;

	/**
	 * 「なふだ機能」が ON であるか否か。
	 *
	 * 次のいずれかの場合、省略される:
	 *  - 「なふだ機能」が OFF のコメントである場合
	 *  -  `start()` 時の `fields` で省かれた場合
	 */
	isAnonymous?: boolean;

	/**
	 * 放送者コメントであるか否か。
	 *
	 * 次のいずれかの場合、省略される:
	 *  - 放送者コメントでない場合
	 *  -  `start()` 時の `fields` で省かれた場合
	 */
	isOperatorComment?: boolean;
}

/**
 * nicoliveCommet プラグインの `start()` のオプション。
 */
export interface NicoliveCommentStartOptions {
	/**
	 * コメントとして受信するフィールド。
	 *
	 * 指定する場合、値は `NicoliveComment` のプロパティ名の配列でなければならない。
	 * 省略した場合、 `["comment", "userID", "isAnonymous", "isOperatorComment"]` と見なされる。
	 */
	fields?: (keyof NicoliveComment)[];
}

export interface NicoliveCommentPlugin {
	/**
	 * コメント受信を開始する。
	 *
	 * @param opts オプション
	 * @param callback 完了時に呼び出されるコールバック。特に完了を待たない場合、省略してよい。
	 */
	start(opts?: NicoliveCommentStartOptions | null, callback?: ((err?: Error) => void) | null): void;

	/**
	 * コメント受信を停止する。
	 *
	 * 不要なサーバ側処理とネットワーク負荷を避けるため、
	 * ゲーム開発者はコメントが不要になった時点でこのメソッドを呼び出すべきである。
	 */
	stop(): void;
}
