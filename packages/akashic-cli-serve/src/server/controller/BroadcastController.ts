import * as express from "express";
import * as socketio from "socket.io";
import { BadRequestError } from "../common/ApiError";
import { responseSuccess } from "../common/ApiResponse";

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
