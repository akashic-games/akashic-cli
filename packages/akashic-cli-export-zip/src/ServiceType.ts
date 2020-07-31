/**
 * 対象のサービス
 * nicolive: ニコニコ生放送。
 *   - game.json の `ImageAsset.hint` に `{ untainted: true }` を付与する
 * none: 通常起動(--target-serviceオプションなしの状態)
 */
export enum ServiceType {
	NicoLive = "nicolive",
	None = "none"
}
