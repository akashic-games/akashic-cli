import * as path from "path";
import * as express from "express";
import { getSystemLogger } from "@akashic/headless-driver";
import { responseSuccess } from "../common/ApiResponse";
import { SandboxConfigApiResponseData } from "../../common/types/ApiResponse";

export const createHandlerToGetSandboxConfig = (dirpath: string): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const configPath = path.resolve(dirpath, "sandbox.config.js");

			let config: SandboxConfigApiResponseData;
			try {
				// TODO ファイル監視。内容に変化がなければ直前の値を返せばよい
				config = require(configPath);
			} catch (e) {
				if (e.code !== "MODULE_NOT_FOUND") {
					getSystemLogger().error("Failure to load sandbox.config.json.", e.code);
				}
				config = null;
			}

			responseSuccess<SandboxConfigApiResponseData>(res, 200, config);
		} catch (e) {
			next(e);
		}
	};
};
