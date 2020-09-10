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
			let player = playerStore.getPlayer(playerId);
			if (player) {
				responseSuccess<PlayerPostApiResponseData>(res, 200, { player, isDuplicationId: true });
			} else {
				player = playerStore.registerPlayer({ id: playerId, name: req.body.playerName });
				responseSuccess<PlayerPostApiResponseData>(res, 200, { player, isDuplicationId: false });
			}
		} catch (e) {
			next(e);
		}
	};
};
