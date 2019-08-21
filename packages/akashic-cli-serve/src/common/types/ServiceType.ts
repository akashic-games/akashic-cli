/**
 * --target-serviceの引数として使用される型
 * nicoLive: ニコ生として起動する
 * none: 通常起動(--target-serviceオプションなしの状態)
 */

export enum ServiceName {
	NicoLive = "nicolive",
	None = "none"
}

export type ServiceType =
	ServiceName.NicoLive |
	ServiceName.None;
