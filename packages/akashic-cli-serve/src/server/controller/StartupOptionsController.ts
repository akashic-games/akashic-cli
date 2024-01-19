import type * as express from "express";
import type {OptionsApiResponseData} from "../../common/types/ApiResponse";
import {responseSuccess} from "../common/ApiResponse";
import {serverGlobalConfig} from "../common/ServerGlobalConfig";

export const handleToGetStartupOptions = (_req: express.Request, res: express.Response, next: Function): void => {
	try {
		responseSuccess<OptionsApiResponseData>(res, 200, {
			autoStart: serverGlobalConfig.autoStart,
			verbose: serverGlobalConfig.verbose,
			targetService: serverGlobalConfig.targetService,
			proxyAudio: serverGlobalConfig.proxyAudio,
			runInIframe: serverGlobalConfig.runInIframe,
			pauseActive: serverGlobalConfig.pauseActive,
			preserveDisconnected: serverGlobalConfig.preserveDisconnected,
			experimentalOpen: serverGlobalConfig.experimentalOpen,
			disableFeatCheck: serverGlobalConfig.disableFeatCheck
		});
	} catch (e) {
		next(e);
	}
};
