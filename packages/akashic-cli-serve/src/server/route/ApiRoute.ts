import * as express from "express";
import * as socketio from "socket.io";
import { createHandlerToBroadcast } from "../controller/BroadcastController";
import {
	createHandlerToCreatePlay,
	createHandlerToGetPlays,
	createHandlerToGetPlay,
	createHandlerToDeletePlay,
	createHandlerToPatchPlay,
	createHandlerToGetPlaylog,
	createHandlerToPatchAudioState
} from "../controller/PlayController";
import { createHandlerToRegisterPlayerId } from "../controller/PlayerIdController";
import { createHandlerToCreatePlayToken } from "../controller/PlayTokenController";
import {
	createHandlerToCreateRunner,
	createHandlerToDeleteRunner,
	createHandlerToPatchRunner
} from "../controller/RunnerController";
import { handleToGetStartupOptions } from "../controller/StartupOptionsController";
import { PlayerIdStore } from "../domain/PlayerIdStore";
import { PlayStore } from "../domain/PlayStore";
import { RunnerStore } from "../domain/RunnerStore";
import { SocketIOAMFlowManager } from "../domain/SocketIOAMFlowManager";

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

	apiRouter.patch("/plays/:playId(\\d+)/audio", createHandlerToPatchAudioState(params.playStore));

	apiRouter.post("/runners", createHandlerToCreateRunner(params.playStore, params.runnerStore));
	apiRouter.delete("/runners/:runnerId", createHandlerToDeleteRunner(params.runnerStore));
	apiRouter.patch("/runners/:runnerId", createHandlerToPatchRunner(params.runnerStore));

	apiRouter.get("/options", handleToGetStartupOptions);

	apiRouter.post("/playerids", createHandlerToRegisterPlayerId(params.playerIdStore));

	return apiRouter;
};
