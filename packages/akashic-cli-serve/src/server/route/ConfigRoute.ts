import * as express from "express";
import { createHandlerToGetEngineConfig } from "../controller/ConfigController";

export interface ConfigRouterParameterObject {
	targetDir: string;
}

export const createConfigRouter = (params: ConfigRouterParameterObject): express.Router => {
	const configRouter = express.Router();

	configRouter.get("/content.json", createHandlerToGetEngineConfig(params.targetDir, false));
	// /engineとの相違点はスクリプトアセット加工前のコンテンツを含む情報を投げること
	// サーバー側でインスタンスを立ち上げる時は加工前のスクリプトアセットを参照する必要がある
	configRouter.get("/content.raw.json", createHandlerToGetEngineConfig(params.targetDir, true));

	return configRouter;
};
