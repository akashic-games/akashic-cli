import * as express from "express";
import { createHandlerToGetEngineConfig, handleToGetStartupOptions } from "../controller/ConfigController";

export interface ConfigRouterParameterObject {
	targetDirs: string[];
}

export const createConfigRouter = (params: ConfigRouterParameterObject): express.Router => {
	const configRouter = express.Router();

	for (let i = 0; i < params.targetDirs.length; i++) {
		configRouter.get(`/${i}/content.json`, createHandlerToGetEngineConfig(i, params.targetDirs[i], false));
		// /engineとの相違点はスクリプトアセット加工前のコンテンツを含む情報を投げること
		// サーバー側でインスタンスを立ち上げる時は加工前のスクリプトアセットを参照する必要がある
		configRouter.get(`/${i}/content.raw.json`, createHandlerToGetEngineConfig(i, params.targetDirs[i], true));
	}
	configRouter.get("/options", handleToGetStartupOptions);

	return configRouter;
};
