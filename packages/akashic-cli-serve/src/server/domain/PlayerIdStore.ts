import { createHash } from "crypto";

export interface PlayerIdRegisterResult {
	/**
	 * 既に登録済みだったか。
	 */
	isDuplicated: boolean;
	/**
	 * プレイヤー ID をハッシュ化した値。
	 */
	hashedPlayerId: string;
}

export interface PlayerIdCreateResult {
	/**
	 * 生成されたプレイヤー ID 。
	 */
	playerId: string;
	/**
	 * プレイヤー ID をハッシュ化した値。
	 */
	hashedPlayerId: string;
}

export class PlayerIdStore {
	private hashedIdTable: { [playerId: string]: string };
	private knownMaxPlayerId: number; // playerId生成時に既存のものと被ることが無いようにplayerIdの中で最大値のものを記録しておく

	constructor() {
		this.hashedIdTable = {};
		this.knownMaxPlayerId = 0;
	}

	registerPlayerId(playerId: string): PlayerIdRegisterResult {
		const { hashedIdTable } = this;
		if (hashedIdTable.hasOwnProperty(playerId)) {
			return { isDuplicated: true, hashedPlayerId: hashedIdTable[playerId] };
		}

		const playerIdInt = parseInt(playerId.replace(/^pid/, ""), 10);
		// playerIdが数値を表す文字列でない場合、NaNになってこの条件に弾かれるのでknownMaxPlayerIdに代入されることはない
		if (this.knownMaxPlayerId < playerIdInt) {
			this.knownMaxPlayerId = playerIdInt;
		}

		const hashedPlayerId = md5(playerId);
		hashedIdTable[playerId] = hashedPlayerId;
		return { isDuplicated: false, hashedPlayerId };
	}

	createPlayerId(): PlayerIdCreateResult {
		this.knownMaxPlayerId++;
		const newPlayerId = "pid" + this.knownMaxPlayerId.toString();
		const hashedPlayerId = md5(newPlayerId);
		this.hashedIdTable[newPlayerId] = hashedPlayerId;
		return { playerId: newPlayerId, hashedPlayerId };
	}
}

function md5(s: string): string {
	return createHash("md5").update(s).digest("hex");
}
