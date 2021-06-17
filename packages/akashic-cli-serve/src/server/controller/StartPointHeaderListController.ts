import * as express from "express";
import { responseError, responseSuccess } from "../common/ApiResponse";
import { AMFlowStoreList } from "../domain/AMFlowStoreFactory";
import { StartPointHeader } from "@akashic/headless-driver/lib/play/amflow/AMFlowStore";
import { NotFoundError } from "../common/ApiError";
import { StartPointHeaderListResponseData } from "../../common/types/ApiResponse";

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
                console.log("playId: " , {playId, AMFlowStoreList});
				responseError(res, new NotFoundError({}));
			}
		} catch (e) {
			next(e);
		}
	};
};
