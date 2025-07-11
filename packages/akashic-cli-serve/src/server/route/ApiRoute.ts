import * as express from "express";
import type * as socketio from "socket.io";
import { createHandlerToBroadcast } from "../controller/BroadcastController.js";
import {
	createHandlerToCreatePlay,
	createHandlerToGetPlays,
	createHandlerToGetPlay,
	createHandlerToDeletePlay,
	createHandlerToPatchPlay,
	createHandlerToGetPlaylog,
	createHandlerToPatchAudioState,
	createHandlerToSendEvent,
	createHandlerToSendNamagameCommentByTemplate,
	createHandlerToSendNamagameComment
} from "../controller/PlayController.js";
import { createHandlerToRegisterPlayerId } from "../controller/PlayerIdController.js";
import { createHandlerToCreatePlayToken } from "../controller/PlayTokenController.js";
import {
	createHandlerToCreateRunner,
	createHandlerToDeleteRunner,
	createHandlerToPatchRunner
} from "../controller/RunnerController.js";
import { createHandlerToGetStartPointHeaderList } from "../controller/StartPointHeaderListController.js";
import { handleToGetStartupOptions } from "../controller/StartupOptionsController.js";
import type { PlayerIdStore } from "../domain/PlayerIdStore.js";
import type { PlayStore } from "../domain/PlayStore.js";
import type { RunnerStore } from "../domain/RunnerStore.js";
import type { SocketIOAMFlowManager } from "../domain/SocketIOAMFlowManager.js";

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
	apiRouter.post("/plays/:playId/comment-template", createHandlerToSendNamagameCommentByTemplate(params.playStore, params.runnerStore));
	apiRouter.post("/plays/:playId/comment", createHandlerToSendNamagameComment(params.playStore, params.runnerStore));

	apiRouter.post("/plays/:playId(\\d+)/token", createHandlerToCreatePlayToken(params.amflowManager));
	apiRouter.post("/plays/:playId(\\d+)/broadcast", createHandlerToBroadcast(params.io));
	apiRouter.get("/plays/:playId(\\d+)/playlog", createHandlerToGetPlaylog(params.playStore));

	apiRouter.patch("/plays/:playId(\\d+)/audio", createHandlerToPatchAudioState(params.playStore));

	apiRouter.post("/runners", createHandlerToCreateRunner(params.playStore, params.runnerStore));
	apiRouter.delete("/runners/:runnerId", createHandlerToDeleteRunner(params.runnerStore));
	apiRouter.patch("/runners/:runnerId", createHandlerToPatchRunner(params.runnerStore));

	apiRouter.get("/options", handleToGetStartupOptions);

	apiRouter.post("/playerids", createHandlerToRegisterPlayerId(params.playerIdStore));
	apiRouter.get("/plays/:playId(\\d+)/start-point-header-list", createHandlerToGetStartPointHeaderList(params.playStore));

	// /public/ 以下はゲーム開発者による利用を想定する: 破壊的な仕様変更は semver の major 更新にせねばならない。
	apiRouter.post("/public/v1/plays/latest/playlog", createHandlerToSendEvent(params.playStore, true));
	apiRouter.post("/public/v1/plays/:playId(\\d+)/playlog", createHandlerToSendEvent(params.playStore));
	return apiRouter;
};
