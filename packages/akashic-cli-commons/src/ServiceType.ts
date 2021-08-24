/*
 * 対象のサービス
 * nicolive: ニコニコ生放送
 * nicolive:multi: ニコニコ生放送
 * nicolive:multi_admission: ニコニコ生放送募集
 * atsumaru: ゲームアツマール
 * atsumaru:single: ゲームアツマール:シングル
 * astumaru:multi:ゲームアツマール: マルチ
 * none: サービスなし
 */
export const SERVICE_TYPES = [
	"nicolive",
	"nicolive:multi",
	"nicolive:multi_admission",
	"atsumaru",
	"atsumaru:single",
	"atsumaru:multi",
	"none"
] as const;
export type ServiceType = typeof SERVICE_TYPES[number];
