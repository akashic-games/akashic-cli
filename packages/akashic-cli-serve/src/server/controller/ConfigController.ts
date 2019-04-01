import * as express from "express";
import * as EngineConfig from "../domain/EngineConfig";
import {serverGlobalConfig} from "../common/ServerGlobalConfig";
import {responseSuccess} from "../common/ApiResponse";
import {OptionsApiResponseData} from "../../common/types/ApiResponse";
import {NotFoundError} from "../common/ApiError";

export const createHandlerToGetEngineConfig = (dirPaths: string[], isRaw: boolean): express.RequestHandler => {
	return (req, res, next) => {
		try {
			const contentId = req.params.contentId;
			if (!dirPaths[contentId]) {
				throw new NotFoundError({ errorMessage: `contentId:${contentId} is not found.` });
			}
			const urlInfo = req.header("host").split(":");
			// ポート番号が見つからなかった場合、httpのデフォルト番号の80とする
			if (urlInfo.length === 1) {
				urlInfo.push("80");
			}
			const hostname = serverGlobalConfig.useGivenHostname ? serverGlobalConfig.hostname : urlInfo[0];
			const port = serverGlobalConfig.useGivenPort ? serverGlobalConfig.port : parseInt(urlInfo[1], 10);
			const baseUrl = `http://${hostname}:${port}`;
			const engineConfigJson = EngineConfig.getEngineConfig(baseUrl, contentId, dirPaths[contentId], isRaw);
			// akashic-gameview側でレスポンスがengineConfigJsonの形式なっていることを前提にしているので、resoponseSuccessは使わない
			res.status(200).json(engineConfigJson);
		} catch (e) {
			next(e);
		}
	};
};

export const handleToGetStartupOptions = (req: express.Request, res: express.Response, next: Function): void => {
	try {
		responseSuccess<OptionsApiResponseData>(res, 200, {
			autoStart: serverGlobalConfig.autoStart,
			verbose: serverGlobalConfig.verbose
		});
	} catch (e) {
		next(e);
	}
};
