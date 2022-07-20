import type * as express from "express";
import type { StartPointHeaderListResponseData } from "../../common/types/ApiResponse";
import type { StartPointHeader } from "../../common/types/StartPointHeader";
import { BadRequestError, NotFoundError } from "../common/ApiError";
import { responseSuccess } from "../common/ApiResponse";
import type { PlayStore } from "../domain/PlayStore";

export const createHandlerToGetStartPointHeaderList = (playStore: PlayStore): express.RequestHandler => {
	return (req, res, next) => {
		try {
			const playId = req.params.playId;
			if (!req.params.playId) {
				throw new BadRequestError({ errorMessage: "PlayId is not given" });
			}

			const amflow = playStore.createAMFlow(playId); // TODO より無駄のない getDebugAMFlow() に移行する。要動作確認。
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
