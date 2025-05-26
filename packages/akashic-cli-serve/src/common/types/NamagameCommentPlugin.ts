// TODO コンテンツから参照できるように切り出す

/**
 * コメントデータ。
 *
 * すべてのフィールドは省略される可能性がある。
 * 利用者は、必要なフィールドが存在するかどうかを確認してから利用すること。
 */
export interface NamagameCommentEventComment {
	/**
	 * コメント本文。
	 */
	comment?: string;

	/**
	 * コメントのコマンド指定。(e.g. "shita big red")
	 */
	command?: string;

	/**
	 * コメントを送信したユーザ ID 。
	 *
	 * 次のいずれかの場合、省略される:
	 *  - 放送者コメントである場合
	 * 次の場合、匿名化された値になる:
	 *  - 「なふだ機能」が OFF のコメントである場合
	 */
	userID?: string;

	/**
	 * 「なふだ機能」が OFF であるか否か。
	 *
	 * 次のいずれかの場合、省略される:
	 *  - 放送者コメントである場合
	 */
	isAnonymous?: boolean;

	/**
	 * 放送者コメントであるか否か。
	 *
	 * 次のいずれかの場合、省略される:
	 *  - 放送者コメントでない場合
	 */
	isOperatorComment?: boolean;
}

/**
 * namagameComment プラグインの `start()` のオプション。
 */
export interface NamagameCommentStartOptions {
	// 将来拡張のために予約される。現在のところ空。
}

export interface NamagameCommentPlugin {
	/**
	 * コメント受信を開始する。
	 *
	 * @param opts オプション
	 * @param callback 完了時に呼び出されるコールバック。特に完了を待たない場合、省略してよい。
	 */
	start(opts?: NamagameCommentStartOptions | null, callback?: ((err?: Error) => void) | null): void;

	/**
	 * コメント受信を停止する。
	 *
	 * 不要なサーバ側処理とネットワーク負荷を避けるため、
	 * ゲーム開発者はコメントが不要になった時点でこのメソッドを呼び出すべきである。
	 */
	stop(): void;
}
