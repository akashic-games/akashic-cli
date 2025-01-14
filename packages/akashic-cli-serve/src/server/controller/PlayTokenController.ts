import type * as express from "express";
import type { PlayTokenPostApiResponseData } from "../../common/types/ApiResponse.js";
import { InternalServerError, BadRequestError } from "../common/ApiError.js";
import { responseSuccess } from "../common/ApiResponse.js";
import type { SocketIOAMFlowManager } from "../domain/SocketIOAMFlowManager.js";

export const createHandlerToCreatePlayToken = (amflowManager: SocketIOAMFlowManager): express.RequestHandler => {
	return (req, res, next) => {
		try {
			// TODO: バリデーション用クラスを別で用意した方がよさそう
			if (req.params.playId == null || req.body.playerId == null || req.body.isActive == null) {
				throw new BadRequestError({ errorMessage: "Invalid playId or isActive" });
			}
			const playId = req.params.playId;
			const playerId = req.body.playerId;
			const name = req.body.name;
			const isActive = (req.body.isActive === "true");
			const envInfo = req.body.envInfo;
			const playToken = amflowManager.createPlayToken(playId, playerId, name, isActive, envInfo);
			if (!playToken) {
				throw new InternalServerError({ errorMessage: "Cannot generate playToken" });
			}
			responseSuccess<PlayTokenPostApiResponseData>(res, 200, { playId, playToken });
		} catch (e) {
			next(e);
		}
	};
};
