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
		const playerIdInt = parseInt(playerId.replace("pid", ""), 10);
		// playerIdが数値を表す文字列でない場合、NaNになってこの条件に弾かれるのでknownMaxPlayerIdに代入されることはない
		if (this.knownMaxPlayerId < playerIdInt) {
			this.knownMaxPlayerId = playerIdInt;
		}
		this.playerIds.push(playerId);
		return false;
	}

	createPlayerId(): string {
		this.knownMaxPlayerId++;
		const newPlayerId = "pid" + this.knownMaxPlayerId.toString();
		this.playerIds.push(newPlayerId);
		return newPlayerId;
	}
}
