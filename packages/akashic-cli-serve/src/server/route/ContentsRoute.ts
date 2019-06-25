import * as express from "express";
import { createHandlerToGetEngineConfig } from "../controller/ConfigController";
import {createScriptAssetController} from "../controller/ScriptAssetController";
import {createHandlerToGetSandboxConfig} from "../controller/SandboxConfigController";

export interface ContentsRouterParameterObject {
	targetDirs: string[];
}

export const createContentsRouter = (params: ContentsRouterParameterObject): express.Router => {
	const contentsRouter = express.Router();

	for (let i = 0; i < params.targetDirs.length; i++) {
		contentsRouter.get(`/${i}/content/:scriptName(*.js$)`, createScriptAssetController(params.targetDirs[i]));
		contentsRouter.use(`/${i}/content`, express.static(params.targetDirs[i])); // コンテンツのスクリプトアセット加工後のパス。クライアント側でゲームを動かすために必要。
		contentsRouter.use(`/${i}/raw`, express.static(params.targetDirs[i])); // コンテンツのスクリプトアセット加工前のパス。サーバー側でゲームを動かすために必要。
	}

	contentsRouter.get(`/:contentId/sandbox-config`, createHandlerToGetSandboxConfig(params.targetDirs));
	contentsRouter.get(`/:contentId/content.json`, createHandlerToGetEngineConfig(params.targetDirs, false));
	// /engineとの相違点はスクリプトアセット加工前のコンテンツを含む情報を投げること
	// サーバー側でインスタンスを立ち上げる時は加工前のスクリプトアセットを参照する必要がある
	contentsRouter.get(`/:contentId/content.raw.json`, createHandlerToGetEngineConfig(params.targetDirs, true));

	return contentsRouter;
};
