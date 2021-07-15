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
				responseError(res, new NotFoundError({}));
			}
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToGetStartPoint = (playStore: PlayStore): express.RequestHandler => {
	return (req, res, next) => {
		try {
			let playId = req.params.playId;
			let frame = parseInt(req.params.frame, 10);
			const amflow = playStore.createAMFlow(playId);

			if (!playId || !amflow || !frame) {
				throw new NotFoundError({ errorMessage: `Snapshot is not found. playId:${playId}, frame:${frame}` });
			}

			amflow.getStartPoint({ frame }, (err: Error | null, startPoint: StartPoint) => {
				const dumpJsonStr = JSON.stringify(startPoint);
				const fileName = `snapshot_${playId}_${frame}.json`;

				res.setHeader("Content-disposition", "attachment; filename=" + fileName);
				res.setHeader("Content-type", "application/x-download");
				res.send(dumpJsonStr);
			});

		} catch (e) {
			next(e);
		}
	};
};
