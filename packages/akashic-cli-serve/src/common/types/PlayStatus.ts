/**
 * Playの状態を定義する型
 * preparing: プレー作成中の状態。
 * suspending: プレー終了済状態。 ”続きからプレー" として再開させることが可能。
 * running: プレー中状態。クライアントまたはサーバでゲームが動いている状態。
 * broken: プレー作成時にエラーが発生し、開始することができない状態。
 */
export type PlayStatus =
	"preparing" |
	"suspending" |
	"running" |
	"broken";
