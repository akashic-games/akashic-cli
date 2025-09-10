import path from "path";
import type * as express from "express";
import type { ContentGetApiResponseData } from "../../common/types/ApiResponse.js";
import { NotFoundError, BadRequestError } from "../common/ApiError.js";
import { responseSuccess } from "../common/ApiResponse.js";
import { serverGlobalConfig } from "../common/ServerGlobalConfig.js";
import * as EngineConfig from "../domain/EngineConfig.js";
import * as gameConfigs from "../domain/GameConfigs.js";
import * as sandboxConfigs from "../domain/SandboxConfigs.js";

export const createHandlerToGetContents = (targetDirs: string[]): express.RequestHandler => {
	// サーバ開始後、sandbox.config.js はここで初めて読み込まれる。この処理以前に sandbox.config.js が必要な場合は、その部分で `register()` を行うこと。
	targetDirs.forEach((targetDir, idx) => sandboxConfigs.register(idx.toString(), serverGlobalConfig.sandboxConfig ?? targetDir));

	return (_req, res, next) => {
		try {
			const contents = targetDirs.map((targetDir, i) => ({
				contentLocatorData: { contentId: "" + i },
				sandboxConfig: sandboxConfigs.get(i.toString()),
				gameJson: gameConfigs.get(i.toString()),
				gameLocationKey: path.basename(path.resolve(targetDir))
			}));
			responseSuccess<ContentGetApiResponseData[]>(res, 200, contents);
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToGetContent = (): express.RequestHandler => {
	return (req, res, next) => {
		try {
			if (!req.params.contentId) {
				throw new BadRequestError({ errorMessage: "ContentId is not given" });
			}
			const contentId = req.params.contentId;
			const content = {
				contentLocatorData: { contentId: contentId },
				sandboxConfig: sandboxConfigs.get(contentId),
				gameJson: gameConfigs.get(contentId)
			};
			responseSuccess<ContentGetApiResponseData>(res, 200, content);
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToGetEngineConfig = (dirPaths: string[], isRaw: boolean): express.RequestHandler => {
	return (req, res, next) => {
		try {
			const contentId = Number(req.params.contentId);
			if (!dirPaths[contentId]) {
				throw new NotFoundError({ errorMessage: `contentId:${contentId} is not found.` });
			}
			const urlInfo = req.header("host")!.split(":");
			// ポート番号が見つからなかった場合、httpのデフォルト番号の80とする
			if (urlInfo.length === 1) {
				urlInfo.push("80");
			}
			const hostname = serverGlobalConfig.useGivenHostname ? serverGlobalConfig.hostname : urlInfo[0];
			const port = serverGlobalConfig.useGivenPort ? serverGlobalConfig.port : parseInt(urlInfo[1], 10);
			const baseUrl = `${serverGlobalConfig.protocol}://${hostname}:${port}`;
			const engineConfigJson = EngineConfig.getEngineConfig({ baseUrl, contentId, baseDir: dirPaths[contentId], isRaw });
			// akashic-gameview側でレスポンスがengineConfigJsonの形式なっていることを前提にしているので、resoponseSuccessは使わない
			res.status(200).json(engineConfigJson);
		} catch (e) {
			next(e);
		}
	};
};

