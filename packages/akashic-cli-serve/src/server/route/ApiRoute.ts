import * as express from "express";
import * as socketio from "socket.io";
import {
	createHandlerToCreatePlay,
	createHandlerToGetPlays,
	createHandlerToGetPlay,
	createHandlerToDeletePlay,
	createHandlerToPatchPlay,
	createHandlerToGetPlayTree,
	createHandlerToAddChildPlay,
	createHandlerToRemoveChildPlay
} from "../controller/PlayController";
import { createHandlerToCreatePlayToken } from "../controller/PlayTokenController";
import { createHandlerToBroadcast } from "../controller/BroadcastController";
import {
	createHandlerToCreateRunner,
	createHandlerToDeleteRunner,
	createHandlerToPatchRunner,
	createHandlerToGetRunners
} from "../controller/RunnerController";
import { PlayStore } from "../domain/PlayStore";
import { RunnerStore } from "../domain/RunnerStore";
import { SocketIOAMFlowManager } from "../domain/SocketIOAMFlowManager";
import { createHandlerToGetSandboxConfig } from "../controller/SandboxConfigController";
import { PlayTreeStore } from "../domain/PlayTreeStore";

export interface ApiRouterParameterObjct {
	targetDir: string;
	playStore: PlayStore;
	playTreeStore: PlayTreeStore;
	runnerStore: RunnerStore;
	amflowManager: SocketIOAMFlowManager;
	io: socketio.Server;
}

export const createApiRouter = (params: ApiRouterParameterObjct): express.Router => {
	const apiRouter = express.Router();

	// TODO 全体的に複数形にして普通のREST APIっぽくする
	apiRouter.post("/play", createHandlerToCreatePlay(params.playStore, params.playTreeStore));
	apiRouter.get("/plays", createHandlerToGetPlays(params.playStore));
	apiRouter.get("/play/:playId(\\d+)", createHandlerToGetPlay(params.playStore));
	apiRouter.delete("/play/:playId(\\d+)", createHandlerToDeletePlay(params.playStore, params.playTreeStore));
	apiRouter.patch("/play/:playId(\\d+)", createHandlerToPatchPlay(params.playStore));
	apiRouter.post("/plays/:playId(\\d+)/children", createHandlerToAddChildPlay(params.playStore, params.playTreeStore));
	apiRouter.get("/plays/children", createHandlerToGetPlayTree(params.playTreeStore));
	apiRouter.delete("/plays/:playId(\\d+)/children/:childId(\\d+)", createHandlerToRemoveChildPlay(params.playStore, params.playTreeStore));

	apiRouter.post("/play/:playId(\\d+)/token", createHandlerToCreatePlayToken(params.amflowManager));
	apiRouter.post("/play/:playId(\\d+)/broadcast", createHandlerToBroadcast(params.io));

	apiRouter.get("/runners", createHandlerToGetRunners(params.runnerStore));
	apiRouter.post("/runner", createHandlerToCreateRunner(params.playStore, params.runnerStore));
	apiRouter.delete("/runner/:runnerId", createHandlerToDeleteRunner(params.runnerStore));
	apiRouter.patch("/runner/:runnerId", createHandlerToPatchRunner(params.runnerStore));

	apiRouter.get("/sandbox-config", createHandlerToGetSandboxConfig(params.targetDir));

	return apiRouter;
};
