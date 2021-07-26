import * as express from "express";
import { responseError, responseSuccess } from "../common/ApiResponse";
import { NotFoundError } from "../common/ApiError";
import { StartPointHeaderListResponseData } from "../../common/types/ApiResponse";
import { StartPointHeader } from "../../common/types/StartPointHeader";
import { PlayStore } from "../domain/PlayStore";
import { StartPoint } from "@akashic/amflow";

export const createHandlerToGetStartPointHeaderList = (playStore: PlayStore): express.RequestHandler => {
	return (req, res, next) => {
		try {
			let playId = req.params.playId;
			const amflow = playStore.createAMFlow(playId);
			if (playId && amflow) {
				const startPointHeaderList: StartPointHeader[] = amflow.dump().startPoints.map(startPoint => {
					return { frame: startPoint.frame, timestamp: startPoint.timestamp };
				});
				responseSuccess<StartPointHeaderListResponseData>(res, 200, { startPointHeaderList });
			} else {
				responseError(res, new NotFoundError({ errorMessage: "startPoint not found" }));
			}
		} catch (e) {
			next(e);
		}
	};
};
