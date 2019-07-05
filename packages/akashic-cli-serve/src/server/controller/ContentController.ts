import * as path from "path";
import * as express from "express";
import { ContentsGetApiResponseData } from "../../common/types/ApiResponse";
import * as EngineConfig from "../domain/EngineConfig";
import { serverGlobalConfig } from "../common/ServerGlobalConfig";
import { responseSuccess } from "../common/ApiResponse";
import { NotFoundError } from "../common/ApiError";
import { dynamicRequire } from "../domain/dynamicRequire";

export const createHandlerToGetContents = (targetDirs: string[]): express.RequestHandler => {
	return (req, res, next) => {
		try {
			const contents = targetDirs.map((targetDir, i) => ({
				contentLocatorData: { contentId: "" + i },
				sandboxConfig: dynamicRequire(path.resolve(targetDir, "sandbox.config.js")) || {}
			}));
			responseSuccess<ContentsGetApiResponseData>(res, 200, contents);
		} catch (e) {
			next(e);
		}
	};
};

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
			const engineConfigJson = EngineConfig.getEngineConfig({ baseUrl, contentId, baseDir: dirPaths[contentId], isRaw });
			// akashic-gameview側でレスポンスがengineConfigJsonの形式なっていることを前提にしているので、resoponseSuccessは使わない
			res.status(200).json(engineConfigJson);
		} catch (e) {
			next(e);
		}
	};
};

