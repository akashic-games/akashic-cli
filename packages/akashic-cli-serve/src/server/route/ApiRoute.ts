import * as express from "express";
import * as socketio from "socket.io";
import {
	createHandlerToCreatePlay,
	createHandlerToGetPlays,
	createHandlerToGetPlay,
	createHandlerToDeletePlay,
	createHandlerToPatchPlay,
	createHandlerToGetPlaylog
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
import { createHandlerToRegisterPlayerId } from "../controller/PlayerIdController";
import { PlayerIdStore } from "../domain/PlayerIdStore";
import { createHandlerToGetStartPointHeaderList } from "../controller/StartPointHeaderListController";

export interface ApiRouterParameterObject {
	playStore: PlayStore;
	runnerStore: RunnerStore;
	playerIdStore: PlayerIdStore;
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
	apiRouter.get("/plays/:playId(\\d+)/playlog", createHandlerToGetPlaylog(params.playStore));

	apiRouter.post("/runners", createHandlerToCreateRunner(params.playStore, params.runnerStore));
	apiRouter.delete("/runners/:runnerId", createHandlerToDeleteRunner(params.runnerStore));
	apiRouter.patch("/runners/:runnerId", createHandlerToPatchRunner(params.runnerStore));

	apiRouter.get("/options", handleToGetStartupOptions);

	apiRouter.post("/playerids", createHandlerToRegisterPlayerId(params.playerIdStore));
	apiRouter.get("/plays/:playId(\\d+)/start-point-header-list", createHandlerToGetStartPointHeaderList(params.playStore));

	return apiRouter;
};
