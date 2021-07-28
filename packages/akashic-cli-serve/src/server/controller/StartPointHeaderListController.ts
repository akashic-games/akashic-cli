import * as express from "express";
import { responseError, responseSuccess } from "../common/ApiResponse";
import { BadRequestError, NotFoundError } from "../common/ApiError";
import { StartPointHeaderListResponseData } from "../../common/types/ApiResponse";
import { StartPointHeader } from "../../common/types/StartPointHeader";
import { PlayStore } from "../domain/PlayStore";
import { StartPoint } from "@akashic/amflow";

export const createHandlerToGetStartPointHeaderList = (playStore: PlayStore): express.RequestHandler => {
	return (req, res, next) => {
		try {
			let playId = req.params.playId;
			if (!req.params.playId) {
				throw new BadRequestError({ errorMessage: "PlayId is not given" });
			}

			const amflow = playStore.createAMFlow(playId);
			if (!amflow) {
				throw new NotFoundError({ errorMessage: `Play is not found. playId:${playId}` });
			}
			const startPointHeaderList: StartPointHeader[] = amflow.dump().startPoints.map(startPoint => {
				return { frame: startPoint.frame, timestamp: startPoint.timestamp };
			});
			responseSuccess<StartPointHeaderListResponseData>(res, 200, { startPointHeaderList });
		} catch (e) {
			next(e);
		}
	};
};
