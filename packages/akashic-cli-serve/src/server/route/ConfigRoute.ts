import * as express from "express";
import { createHandlerToGetEngineConfig } from "../controller/ConfigController";

export const createConfigRouter = (): express.Router => {
	const configRouter = express.Router();

	configRouter.get("/content.json", createHandlerToGetEngineConfig(false));
	// /engineとの相違点はスクリプトアセット加工前のコンテンツを含む情報を投げること
	// サーバー側でインスタンスを立ち上げる時は加工前のスクリプトアセットを参照する必要がある
	configRouter.get("/content.raw.json", createHandlerToGetEngineConfig(true));

	return configRouter;
};
