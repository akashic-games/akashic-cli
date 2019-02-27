import * as path from "path";
import * as express from "express";
import { getSystemLogger } from "@akashic/headless-driver";
import { responseSuccess } from "../common/ApiResponse";
import { StartupArgumentApiResponseData } from "../../common/types/ApiResponse";

export const createHandlerToGetStartupArgument = (dirpath: string): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			let data: StartupArgumentApiResponseData = {
				args: {}
			};
			try {
				// TODO ファイル監視。内容に変化がなければ直前の値を返せばよい
				data.args = require(path.resolve(dirpath, "startup_argument.json"));
			} catch (e) {
				if (e.code !== "MODULE_NOT_FOUND") {
					getSystemLogger().error("Failure to load startup_argument.json.", e.code);
				}
			}

			responseSuccess<StartupArgumentApiResponseData>(res, 200, data);
		} catch (e) {
			next(e);
		}
	};
};
