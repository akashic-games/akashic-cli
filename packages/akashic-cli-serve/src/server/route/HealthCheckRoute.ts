import * as express from "express";
import {createHandleToGetStatus} from "../controller/HealthCheckController";
import type {PlayStore} from "../domain/PlayStore";

export interface HealthCheckRouterParameterObject {
	playStore: PlayStore;
}

export const createHealthCheckRouter = (params: HealthCheckRouterParameterObject): express.Router => {
	const healthCheckRouter = express.Router();

	healthCheckRouter.get("/status", createHandleToGetStatus(params.playStore));

	return healthCheckRouter;
};
