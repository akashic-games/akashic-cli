import * as express from "express";
import { responseSuccess } from "../common/ApiResponse";
import { PlayerIdPostApiResponseData } from "../../common/types/ApiResponse";
import { PlayerIdStore } from "../domain/PlayerIdStore";

export const createHandlerToRegisterPlayerId = (playerIdStore: PlayerIdStore): express.RequestHandler => {
	return (req, res, next) => {
		try {
			let playerId = req.body.playerId;
			if (playerId) {
				const isDuplicated = playerIdStore.registerPlayerId(playerId);
				responseSuccess<PlayerIdPostApiResponseData>(res, 200, { playerId, isDuplicated });
			} else {
				playerId = playerIdStore.createPlayerId();
				responseSuccess<PlayerIdPostApiResponseData>(res, 200, { playerId, isDuplicated: false });
			}
		} catch (e) {
			next(e);
		}
	};
};
