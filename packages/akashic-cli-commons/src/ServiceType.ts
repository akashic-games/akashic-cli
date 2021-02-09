/*
 * 対象のサービス
 * nicolive: ニコニコ生放送
 * atsumaru: ゲームアツマール
 * none: サービスなし
 */
export const SERVICE_TYPES = ["nicolive", "atsumaru", "none"] as const;
export type ServiceType = typeof SERVICE_TYPES[number];
