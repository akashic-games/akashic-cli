import * as express from "express";
import { responseSuccess } from "../common/ApiResponse";
import {
	PlayerPostApiResponseData
} from "../../common/types/ApiResponse";
import { PlayerStore } from "../domain/PlayerStore";

export const createHandlerToRegisterPlayer = (playerStore: PlayerStore): express.RequestHandler => {
	return (req, res, next) => {
		try {
			const playerId = req.body.playerId;
			const playerName = req.body.playerName;
			let player = playerStore.getPlayer(playerId);
			if (player) {
				// 同一IDのプレイヤーが存在する且つ異なるプレイヤー名が指定された場合、サーバーに保存はしないがその名前を使用する
				player = { id: player.id, name: playerName || player.name };
				responseSuccess<PlayerPostApiResponseData>(res, 200, { player, isDuplicationId: true });
			} else {
				player = playerStore.registerPlayer({ id: playerId, name: playerName });
				responseSuccess<PlayerPostApiResponseData>(res, 200, { player, isDuplicationId: false });
			}
		} catch (e) {
			next(e);
		}
	};
};
