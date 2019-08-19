/**
 * --target-serviceの引数として使用される、サービスの型
 * nicoLive: ニコ生として起動する
 * none: 通常起動(--target-serviceオプションなしの状態)
 */

export enum ServiceName {
	NicoLive = "nicoLive",
	Foo = "foo", // TODO: debug
	None = "none"
}

export type ServiceType =
	ServiceName.NicoLive |
	ServiceName.Foo | // TODO: debug
	ServiceName.None;
