import * as express from "express";
import * as EngineConfig from "../domain/EngineConfig";
import { serverGlobalConfig } from "../common/ServerGlobalConfig";

export const createHandlerToGetEngineConfig = (baseDir: string, isRaw: boolean): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const urlInfo = req.header("host").split(":");
			// ポート番号が見つからなかった場合、httpのデフォルト番号の80とする
			if (urlInfo.length === 1) {
				urlInfo.push("80");
			}
			const hostname = serverGlobalConfig.useGivenHostname ? serverGlobalConfig.hostname : urlInfo[0];
			const port = serverGlobalConfig.useGivenPort ? serverGlobalConfig.port : parseInt(urlInfo[1], 10);
			const baseUrl = `http://${hostname}:${port}`;
			const engineConfigJson = await EngineConfig.getEngineConfig(baseUrl, baseDir, isRaw);
			// akashic-gameview側でレスポンスがengineConfigJsonの形式なっていることを前提にしているので、resoponseSuccessは使わない
			res.status(200).json(engineConfigJson);
		} catch (e) {
			next(e);
		}
	};
};
