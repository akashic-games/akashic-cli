/**
 * --target-serviceの引数として使用される
 * nicolive: ニコ生互換のコンテンツとし、`{ untainted: true }` の hint を `image asset` につける
 * none: 通常起動(--target-serviceオプションなしの状態)
 */

export enum ServiceType {
	NicoLive = "nicolive",
	None = "none"
}
