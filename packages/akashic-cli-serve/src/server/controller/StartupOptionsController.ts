import * as express from "express";
import {serverGlobalConfig} from "../common/ServerGlobalConfig";
import {responseSuccess} from "../common/ApiResponse";
import {OptionsApiResponseData} from "../../common/types/ApiResponse";

export const handleToGetStartupOptions = (req: express.Request, res: express.Response, next: Function): void => {
	try {
		responseSuccess<OptionsApiResponseData>(res, 200, {
			autoStart: serverGlobalConfig.autoStart,
			verbose: serverGlobalConfig.verbose,
			proxyAudio: serverGlobalConfig.proxyAudio
		});
	} catch (e) {
		next(e);
	}
};
