import * as express from "express";
import {OptionsApiResponseData} from "../../common/types/ApiResponse";
import {responseSuccess} from "../common/ApiResponse";
import {serverGlobalConfig} from "../common/ServerGlobalConfig";

export const handleToGetStartupOptions = (req: express.Request, res: express.Response, next: Function): void => {
	try {
		responseSuccess<OptionsApiResponseData>(res, 200, {
			autoStart: serverGlobalConfig.autoStart,
			verbose: serverGlobalConfig.verbose,
			targetService: serverGlobalConfig.targetService,
			proxyAudio: serverGlobalConfig.proxyAudio,
			preserveDisconnected: serverGlobalConfig.preserveDisconnected
		});
	} catch (e) {
		next(e);
	}
};
