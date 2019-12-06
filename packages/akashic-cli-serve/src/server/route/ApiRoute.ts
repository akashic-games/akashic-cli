import * as express from "express";
import * as socketio from "socket.io";
import {
	createHandlerToCreatePlay,
	createHandlerToGetPlays,
	createHandlerToGetPlay,
	createHandlerToDeletePlay,
	createHandlerToPatchPlay
} from "../controller/PlayController";
import { createHandlerToCreatePlayToken } from "../controller/PlayTokenController";
import { createHandlerToBroadcast } from "../controller/BroadcastController";
import {
	createHandlerToCreateRunner,
	createHandlerToDeleteRunner,
	createHandlerToPatchRunner
} from "../controller/RunnerController";
import { PlayStore } from "../domain/PlayStore";
import { RunnerStore } from "../domain/RunnerStore";
import { SocketIOAMFlowManager } from "../domain/SocketIOAMFlowManager";
import { handleToGetStartupOptions } from "../controller/StartupOptionsController";

export interface ApiRouterParameterObject {
	playStore: PlayStore;
	runnerStore: RunnerStore;
	amflowManager: SocketIOAMFlowManager;
	io: socketio.Server;
}

export const createApiRouter = (params: ApiRouterParameterObject): express.Router => {
	const apiRouter = express.Router();

	apiRouter.post("/plays", createHandlerToCreatePlay(params.playStore));
	apiRouter.get("/plays/:playId(\\d+)", createHandlerToGetPlay(params.playStore));
	apiRouter.get("/plays", createHandlerToGetPlays(params.playStore));
	apiRouter.delete("/plays/:playId(\\d+)", createHandlerToDeletePlay(params.playStore));
	apiRouter.patch("/plays/:playId(\\d+)", createHandlerToPatchPlay(params.playStore));

	apiRouter.post("/plays/:playId(\\d+)/token", createHandlerToCreatePlayToken(params.amflowManager));
	apiRouter.post("/plays/:playId(\\d+)/broadcast", createHandlerToBroadcast(params.io));

	apiRouter.post("/runners/", createHandlerToCreateRunner(params.playStore, params.runnerStore));
	apiRouter.delete("/runners/:runnerId", createHandlerToDeleteRunner(params.runnerStore));
	apiRouter.patch("/runners/:runnerId", createHandlerToPatchRunner(params.runnerStore));

	apiRouter.get("/options", handleToGetStartupOptions);

	return apiRouter;
};
