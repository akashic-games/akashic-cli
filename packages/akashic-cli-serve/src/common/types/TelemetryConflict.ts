
export interface TelemetryConflict {
	playerId: string;
	age: number;
	/**
	 * "idx": エンティティの生成カウントがずれている
	 * "random": 乱数生成のカウントがずれている
	 */
	reason: "idx" | "random";
}
