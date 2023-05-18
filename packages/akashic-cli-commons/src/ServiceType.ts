/*
 * 対象のサービス
 * nicolive: ニコニコ生放送
 * nicolive:multi: ニコニコ生放送
 * nicolive:multi_admission: ニコニコ生放送募集
 * none: サービスなし
 */
export const SERVICE_TYPES = [
	"nicolive",
	"nicolive:multi",
	"nicolive:multi_admission",
	"none"
] as const;
export type ServiceType = typeof SERVICE_TYPES[number];
