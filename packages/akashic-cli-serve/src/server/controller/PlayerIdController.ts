import type * as express from "express";
import type { PlayerIdPostApiResponseData } from "../../common/types/ApiResponse.js";
import { responseSuccess } from "../common/ApiResponse.js";
import type { PlayerIdStore } from "../domain/PlayerIdStore.js";

export const createHandlerToRegisterPlayerId = (playerIdStore: PlayerIdStore): express.RequestHandler => {
	return (req, res, next) => {
		try {
			const playerId = req.body.playerId;
			if (playerId) {
				const { isDuplicated, hashedPlayerId } = playerIdStore.registerPlayerId(playerId);
				responseSuccess<PlayerIdPostApiResponseData>(res, 200, { playerId, isDuplicated, hashedPlayerId });
			} else {
				const { playerId, hashedPlayerId } = playerIdStore.createPlayerId();
				responseSuccess<PlayerIdPostApiResponseData>(res, 200, { playerId, isDuplicated: false, hashedPlayerId });
			}
		} catch (e) {
			next(e);
		}
	};
};
