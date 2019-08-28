/**
 * --target-serviceの引数として使用される
 * nicolive: ニコ生として起動する
 * none: 通常起動(--target-serviceオプションなしの状態)
 */

export enum ServiceType {
	NicoLive = "nicolive",
	None = "none"
}
