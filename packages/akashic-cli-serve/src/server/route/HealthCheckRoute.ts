import * as express from "express";
import {createHandleToGetStatus} from "../controller/HealthCheckController";
import {PlayStore} from "../domain/PlayStore";

export interface HealthCheckRouterParameterObject {
	playStore: PlayStore;
}

export const createHealthCheckRouter = (params: HealthCheckRouterParameterObject): express.Router => {
	const contentsRouter = express.Router();

	contentsRouter.get(`/status`, createHandleToGetStatus(params.playStore));

	return contentsRouter;
};
