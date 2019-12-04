import * as express from "express";
import * as path from "path";
import { BadRequestError } from "../common/ApiError";
import { responseSuccess } from "../common/ApiResponse";
import {
	RunnerDeleteApiResponseData,
	RunnerPostApiResponseData,
	RunnerPatchApiResponseData
} from "../../common/types/ApiResponse";
import { PlayStore } from "../domain/PlayStore";
import { RunnerStore } from "../domain/RunnerStore";
import { dynamicRequire } from "../domain/dynamicRequire";
import { SandboxConfig } from "../../common/types/SandboxConfig";
import { serverGlobalConfig } from "../common/ServerGlobalConfig";

export const createHandlerToCreateRunner = (
	playStore: PlayStore,
	runnerStore: RunnerStore,
	targetDirs: string[]
): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			// TODO: バリデーション用クラスを別で用意した方がよさそう
			if (!req.body.playId || req.body.isActive === undefined || !req.body.token) {
				throw new BadRequestError({ errorMessage: "Invalid playId, isActive or token" });
			}

			const contentId = req.params.contentId;
			const sandboxConfig = dynamicRequire<SandboxConfig>(path.resolve(targetDirs[parseInt(contentId, 10)], "sandbox.config.js"));
			const externalAssets = sandboxConfig?.externalAssets === undefined ? [] : sandboxConfig.externalAssets;
			if (externalAssets && externalAssets.length > 0) {
				// sandbox.config.js の externalAssets に値がある場合は (string|regexp)[] でなければエラーとする
				if (!(externalAssets instanceof Array)) {
					throw new BadRequestError({ errorMessage: "Invalid externalAssets, Not Array" });
				}
				const found = externalAssets.find((url: any) => typeof url !== "string" && !(url instanceof RegExp));
				if (found) {
					throw new BadRequestError({ errorMessage: `Invalid externalAssets, The value is neither a string or regexp. value:${found}` });
				}
			}

			const playId = req.body.playId;
			const isActive = Boolean(req.body.isActive);
			const token = req.body.token;
			const amflow = playStore.createAMFlow(playId);
			const allowedUrls = createAllowedUrls(contentId, externalAssets);
			const runner = await runnerStore.createAndStartRunner({ playId, isActive, token, amflow, allowedUrls });
			responseSuccess<RunnerPostApiResponseData>(res, 200, { playId: runner.playId, runnerId: runner.runnerId });
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToDeleteRunner = (runnerStore: RunnerStore): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			if (!req.params.runnerId) {
				throw new BadRequestError({ errorMessage: "Invalid runnerId" });
			}
			const runnerId = req.params.runnerId;
			await runnerStore.stopRunner(runnerId);
			responseSuccess<RunnerDeleteApiResponseData>(res, 200, { runnerId });
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToPatchRunner = (runnerStore: RunnerStore): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const runnerId = req.params.runnerId;
			const status = req.body.status;
			if (!runnerId) {
				throw new BadRequestError({ errorMessage: "Invalid runnerId" });
			}
			if (status !== "running" && status !== "paused") {
				throw new BadRequestError({ errorMessage: "Invalid status: " + status });
			}

			if (status === "paused") {
				runnerStore.pauseRunner(runnerId);
			} else {
				runnerStore.resumeRunner(runnerId);
			}

			responseSuccess<RunnerPatchApiResponseData>(res, 200, { runnerId, status });
		} catch (e) {
			next(e);
		}
	};
};

function createAllowedUrls(contentId: string, externalAssets: (string | RegExp)[] | null) {
	let allowedUrls: (string | RegExp)[] = [`http://${serverGlobalConfig.hostname}:${serverGlobalConfig.port}/contents/${contentId}/`];
	if (serverGlobalConfig.allowExternal) {
		if (externalAssets === null) return null;

		allowedUrls = allowedUrls.concat(externalAssets);
		if (process.env.AKASHIC_SERVE_ALLOW_ORIGIN) {
			allowedUrls.push(process.env.AKASHIC_SERVE_ALLOW_ORIGIN);
		}
	}
	return allowedUrls;
}
