// TODO: このファイルは将来的には外部から参照するようにする

/**
 * 値のプレイに関するスコープ。
 * 同一 playerId 同一 key でも、プレイスコープが異なる値は区別される。
 *
 * - "play": プレイごとにユニークな領域
 * - "rootPlay": もっとも祖先のプレイにユニークな領域
 * - "global": プレイに紐づかない領域
 */
export type StoragePlayScope = "play" | "rootPlay" | "global";

/**
 * ストレージに保存される値の型。
 */
export type StorageValue = number | string | Object | null;

/**
 * ストレージに保存される値の種類。
 *
 * "number", "ordered-number" は [-(2 ** 30), 2**30) の数値。
 * "string" は 文字列。(TODO 制限明記。何文字(？)以下など。)
 * "general" は JSON として妥当なその他のオブジェクト。
 */
export type StorageValueType = "number" | "ordered-number" | "string" | "general";

/**
 * 値の読み込み順。
 *
 * - "asc": 昇順。type が `"ordered-number"` でない時、エラー。
 * - "desc": 降順。type が `"ordered-number"` でない時、エラー。
 * - "unspecified": 指定しない。デフォルト。
 */
export type StorageReadOrder = "asc" | "desc" | "unspecified";

/**
 * 書き込みのタイプ (書き込む値の解釈)。
 *
 * - "incr": 指定された値を現在値に加えた値を書き込む。 type が `"number" | "ordered-number"` でない時エラー。
 * - "decr": 指定された値を現在値から引いた値を書き込む。 type が `"number" | "ordered-number"` でない時エラー。
 * - "overwrite": 指定された値を書き込む。デフォルト。
 */
export type StorageWriteType = "incr" | "decr" | "overwrite";

/**
 * "number" の最小値。
 */
export const STORAGE_MIN_NUMBER = -1073741824; // -(2 ** 30)

/**
 * "number" の最大値。
 */
export const STORAGE_MAX_NUMBER = 1073741823; // (2 ** 30) - 1;

export interface StorageData {
	/**
	 * 誰の値か。
	 * いずれかのインスタンスの g.game.selfId に与えられる文字列または空文字列 "" (プレイヤーに紐づけない場合) でなければならない。
	 */
	playerId: string;

	/**
	 * 書き込む値、または読み込まれた値。
	 *
	 * 書き込みで利用する場合、この値の解釈は `StorageWriteType` に依存することに注意。(e.g. "incr" ならこの値を加算する)
	 */
	value: StorageValue;
}

/**
 * 書き込み条件。
 * `GameExternalStorageLike` ではサポートされないことに注意。
 *
 * - "greaterThan": 指定値が現在値より大きい時にのみ書き込む。type が "number" でない時エラー。
 * - "lessThan": 指定値が現在値未満の時のみ書き込む。type が "number" でない時エラー。
 * - "none": 条件なく書き込む。デフォルト。
 */
export type StorageWriteCondition = "greaterThan" | "lessThan" | "none";

/**
 * 書き込み失敗の種別。
 * それぞれ min を下回った、max を超過した、許可されていない。
 */
export type StorageWriteFailureType = "subceedMin" | "exceedMax" | "notPermitted";
