// TODO コンテンツから参照できるように切り出す

/**
 * コメントデータ。
 */
export interface NamagameCommentEventComment {
	/**
	 * コメント本文。
	 */
	comment: string;

	/**
	 * コメントのコマンド指定。(e.g. "shita big red")
	 * 放送者コメントであるか、または指定がない場合は省略される。
	 */
	command?: string;

	/**
	 * コメントを送信したユーザ ID 。
	 * isAnonymous が true の場合はハッシュ化された値が入る。
	 * 放送者コメントの場合は省略される。
	 */
	userID?: string;

	/**
	 * 匿名コメントであるか否か。
	 * 「なふだ機能」が OFF のユーザのコメントは匿名コメントである。
	 * 放送者コメントの場合は `false` 。
	 */
	isAnonymous: boolean;

	/**
	 * コメントの投稿タイミング。
	 * 単位はセンチ秒。
	 * 放送者コメントの場合は省略される。
	 */
	vpos?: number;
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
