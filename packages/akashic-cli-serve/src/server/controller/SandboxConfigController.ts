import * as path from "path";
import * as express from "express";
import { getSystemLogger } from "@akashic/headless-driver";
import { responseSuccess } from "../common/ApiResponse";
import { SandboxConfigApiResponseData } from "../../common/types/ApiResponse";
import { NotFoundError } from "../common/ApiError";
import { dynamicRequire } from "../domain/dynamicRequire";

export const createHandlerToGetSandboxConfig = (dirPaths: string[]): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const contentId = req.params.contentId;
			if (!dirPaths[contentId]) {
				throw new NotFoundError({ errorMessage: `contentId:${contentId} is not found.` });
			}
			const configPath = path.resolve(dirPaths[contentId], "sandbox.config.js");
			// TODO ファイル監視。内容に変化がなければ直前の値を返せばよい
			const config = dynamicRequire(configPath);
			responseSuccess<SandboxConfigApiResponseData>(res, 200, config);
		} catch (e) {
			next(e);
		}
	};
};
