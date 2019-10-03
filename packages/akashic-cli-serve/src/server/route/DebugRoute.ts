import * as express from "express";
import {createHandleToGetHealthChecker} from "../controller/DebugController";
import {PlayStore} from "../domain/PlayStore";

export interface DebugRouterParameterObject {
	playStore: PlayStore;
}

export const createDebugRouter = (params: DebugRouterParameterObject): express.Router => {
	const contentsRouter = express.Router();

	contentsRouter.get(`/health-checker`, createHandleToGetHealthChecker(params.playStore));

	return contentsRouter;
};
