import * as express from "express";
import { responseError, responseSuccess } from "../common/ApiResponse";
import { AMFlowStoreList } from "../domain/AMFlowStoreFactory";
import { StartPointHeader } from "@akashic/headless-driver/lib/play/amflow/AMFlowStore";
import { NotFoundError } from "../common/ApiError";
import { StartPointHeaderListResponseData, StartPointResponseData } from "../../common/types/ApiResponse";

export const createHandlerToGetStartPointHeaderList = (): express.RequestHandler => {
	return (req, res, next) => {
		try {
			let playId = req.params.playId;
			if (playId && AMFlowStoreList[playId]) {
				const startPointHeaderList: StartPointHeader[] = AMFlowStoreList[playId].dump().startPoints.map(startPoint => {
					return { frame: startPoint.frame, timestamp: startPoint.timestamp }
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

export const createHandlerToGetStartPoint = (): express.RequestHandler => {
	return (req, res, next) => {
		try {
			let playId = req.params.playId;
			let frame = parseInt(req.params.frame, 10);

			if (!playId || !AMFlowStoreList[playId] || !frame) {
				throw new NotFoundError({ errorMessage: `Snapshot is not found. playId:${playId}, frame:${frame}` });
			}

			const startPointData = AMFlowStoreList[playId].getStartPoint({ frame });
			const dumpJsonStr = JSON.stringify(startPointData);
			const fileName = `snapshot_${playId}_${frame}.json`;

			res.setHeader("Content-disposition", "attachment; filename=" + fileName);
			res.setHeader("Content-type", "application/x-download");
			res.send(dumpJsonStr);
		} catch (e) {
			next(e);
		}
	};
}