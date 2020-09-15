export class PlayerIdStore {
	private playerIds: string[];
	private knownMaxPlayerId: number; // playerId生成時に既存のものと被ることが無いようにplayerIdの中で最大値のものを記録しておく

	constructor() {
		this.playerIds = [];
		this.knownMaxPlayerId = 0;
	}

	/**
	 * 引数のプレイヤーIDを登録する。
	 * 同一のplayerIdが存在する場合はtrueを、そうでない場合falseを返す。
	 */
	registerPlayerId(playerId: string): boolean {
		if (this.playerIds.some(id => id === playerId)) {
			return true;
		}
		if (this.knownMaxPlayerId < parseInt(playerId, 10)) {
			this.knownMaxPlayerId = parseInt(playerId, 10);
		}
		this.playerIds.push(playerId);
		return false;
	}

	createPlayerId(): string {
		this.knownMaxPlayerId++;
		const newPlayerId = this.knownMaxPlayerId.toString();
		this.playerIds.push(newPlayerId);
		return newPlayerId;
	}
}
