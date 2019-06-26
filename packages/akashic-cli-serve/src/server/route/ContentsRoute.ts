import * as express from "express";
import { createHandlerToGetContents, createHandlerToGetEngineConfig } from "../controller/ContentController";
import { createScriptAssetController } from "../controller/ScriptAssetController";
import { createHandlerToGetSandboxConfig } from "../controller/SandboxConfigController";

export interface ContentsRouterParameterObject {
	targetDirs: string[];
}

export const createContentsRouter = (params: ContentsRouterParameterObject): express.Router => {
	const targetDirs = params.targetDirs;
	const contentsRouter = express.Router();

	for (let i = 0; i < targetDirs.length; i++) {
		contentsRouter.get(`/${i}/content/:scriptName(*.js$)`, createScriptAssetController(targetDirs[i]));
		contentsRouter.use(`/${i}/content`, express.static(targetDirs[i]));
		contentsRouter.use(`/${i}/raw`, express.static(targetDirs[i]));
	}

	contentsRouter.get(`/`, createHandlerToGetContents(targetDirs));
	contentsRouter.get(`/:contentId/sandbox-config`, createHandlerToGetSandboxConfig(targetDirs));

	// content.json, content.raw.json はそれぞれ /contents/:contentId:/content/ と /contents/:contendId/raw/ に対応する。
	contentsRouter.get(`/:contentId/content.json`, createHandlerToGetEngineConfig(targetDirs, false));
	contentsRouter.get(`/:contentId/content.raw.json`, createHandlerToGetEngineConfig(targetDirs, true));

	return contentsRouter;
};
