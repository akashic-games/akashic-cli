import type * as express from "express";
import type * as socketio from "socket.io";
import { BadRequestError } from "../common/ApiError.js";
import { responseSuccess } from "../common/ApiResponse.js";

export const createHandlerToBroadcast = (io: socketio.Server): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const playId = req.params.playId;
			const message = req.body;
			if (playId == null || message == null) {
				throw new BadRequestError({ errorMessage: "createHandlerToBroadCast(): Invalid playId or message" });
			}
			io.emit("playBroadcast", { playId, message });
			responseSuccess<void>(res, 200, undefined);
		} catch (e) {
			next(e);
		}
	};
};
