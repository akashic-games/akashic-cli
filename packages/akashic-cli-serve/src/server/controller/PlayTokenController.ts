import * as express from "express";
import { InternalServerError, BadRequestError } from "../common/ApiError";
import { responseSuccess } from "../common/ApiResponse";
import { PlayTokenPostApiResponseData } from "../../common/types/ApiResponse";
import { SocketIOAMFlowManager } from "../domain/SocketIOAMFlowManager";

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
