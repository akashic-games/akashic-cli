import * as express from "express";
import { createHandlerToGetContent, createHandlerToGetContents, createHandlerToGetEngineConfig } from "../controller/ContentController.js";
import {
	createHandlerToGetSandboxConfig,
	createHandlerToGetSandboxConfigPluginCode,
	createHandlerToGetSandboxConfigBgImage
} from "../controller/SandboxConfigController.js";
import { createScriptAssetController } from "../controller/ScriptAssetController.js";

export interface ContentsRouterParameterObject {
	targetDirs: string[];
}

export const createContentsRouter = (params: ContentsRouterParameterObject): express.Router => {
	const targetDirs = params.targetDirs;
	const contentsRouter = express.Router();

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
		contentsRouter.get(`/${i}/content/:scriptName(*.js$)`, createScriptAssetController(targetDirs[i], i));
		contentsRouter.use(`/${i}/content`, express.static(targetDirs[i]));
		contentsRouter.use(`/${i}/raw`, express.static(targetDirs[i]));
	}

	contentsRouter.get("/", createHandlerToGetContents(targetDirs));
	contentsRouter.get("/:contentId", createHandlerToGetContent());
	contentsRouter.get("/:contentId/sandbox-config", createHandlerToGetSandboxConfig(targetDirs));

	// content.json, content.raw.json はそれぞれ /contents/:contentId:/content/ と /contents/:contendId/raw/ に対応する。
	contentsRouter.get("/:contentId/content.json", createHandlerToGetEngineConfig(targetDirs, false));
	contentsRouter.get("/:contentId/content.raw.json", createHandlerToGetEngineConfig(targetDirs, true));

	contentsRouter.get("/:contentId/sandboxConfig/plugins/:pluginName", createHandlerToGetSandboxConfigPluginCode());
	contentsRouter.get("/:contentId/sandboxConfig/backgroundImage", createHandlerToGetSandboxConfigBgImage());
	return contentsRouter;
};
