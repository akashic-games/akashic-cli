import * as express from "express";
import { createHandlerToGetContent, createHandlerToGetContents, createHandlerToGetEngineConfig } from "../controller/ContentController";
import { createScriptAssetController } from "../controller/ScriptAssetController";
import { createHandlerToGetSandboxConfig } from "../controller/SandboxConfigController";
import { SandboxConfigs } from "../domain/SandboxConfigs";

export interface ContentsRouterParameterObject {
	targetDirs: string[];
}

export const createContentsRouter = (params: ContentsRouterParameterObject): express.Router => {
	const targetDirs = params.targetDirs;
	const contentsRouter = express.Router();
	const sandboxConfigs = SandboxConfigs.getInstance();

	// --debug-untrusted の動作用に、localhost と 127.0.0.1 のリクエストはクロスドメインでも許す
	// (ref. GameViewManger#getDefaultUntrustedFrameUrl())
	contentsRouter.use((req, res, next) => {
		if (req.hostname === "localhost" || req.hostname === "127.0.0.1") {
			res.header("Access-Control-Allow-Origin", req.get("origin"));
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		}
		next();
	});

	for (let i = 0; i < targetDirs.length; i++) {
		contentsRouter.get(`/${i}/content/:scriptName(*.js$)`, createScriptAssetController(targetDirs[i]));
		contentsRouter.use(`/${i}/content`, express.static(targetDirs[i]));
		contentsRouter.use(`/${i}/raw`, express.static(targetDirs[i]));
		sandboxConfigs.loadSandboxConfigJs(targetDirs[i], i.toString());
	}

	contentsRouter.get(`/`, createHandlerToGetContents(targetDirs));
	contentsRouter.get(`/:contentId`, createHandlerToGetContent());
	contentsRouter.get(`/:contentId/sandbox-config`, createHandlerToGetSandboxConfig(targetDirs));

	// content.json, content.raw.json はそれぞれ /contents/:contentId:/content/ と /contents/:contendId/raw/ に対応する。
	contentsRouter.get(`/:contentId/content.json`, createHandlerToGetEngineConfig(targetDirs, false));
	contentsRouter.get(`/:contentId/content.raw.json`, createHandlerToGetEngineConfig(targetDirs, true));

	return contentsRouter;
};
