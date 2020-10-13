import * as express from "express";
import { BadRequestError } from "../common/ApiError";
import { responseSuccess } from "../common/ApiResponse";
import {
	RunnerDeleteApiResponseData,
	RunnerPostApiResponseData,
	RunnerPatchApiResponseData
} from "../../common/types/ApiResponse";
import { PlayStore } from "../domain/PlayStore";
import { RunnerStore } from "../domain/RunnerStore";
import { serverGlobalConfig } from "../common/ServerGlobalConfig";

export const createHandlerToCreateRunner = (
	playStore: PlayStore,
	runnerStore: RunnerStore
): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			// TODO: バリデーション用クラスを別で用意した方がよさそう
			if (!req.body.playId || req.body.isActive === undefined || !req.body.token) {
				throw new BadRequestError({ errorMessage: "Invalid playId, isActive or token" });
			}

			const playId = req.body.playId;
			const contentId = playStore.getContentLocator(playId).contentId;
			const isActive = Boolean(req.body.isActive);
			const token = req.body.token;
			const amflow = playStore.createAMFlow(playId);
			const runner = await runnerStore.createAndStartRunner({ playId, isActive, token, amflow, contentId });
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
			if (status !== "running" && status !== "paused" && status !== "step") {
				throw new BadRequestError({ errorMessage: "Invalid status: " + status });
			}

			if (status === "paused") {
				if (req.body.step) {
					await runnerStore.stepRunner(runnerId);					
				} else {
					await runnerStore.pauseRunner(runnerId);
				}
			} else {
				await runnerStore.resumeRunner(runnerId);
			}

			responseSuccess<RunnerPatchApiResponseData>(res, 200, { runnerId, status });
		} catch (e) {
			next(e);
		}
	};
};

function createAllowedUrls(contentId: string, externalAssets: (string | RegExp)[] | null): (string | RegExp)[] | null {
	let allowedUrls: (string | RegExp)[] = [`http://${serverGlobalConfig.hostname}:${serverGlobalConfig.port}/contents/${contentId}/`];
	if (serverGlobalConfig.allowExternal) {
		// null は全てのアクセスを許可するため、nullが指定された場合は他の値を参照せず null を返す
		if (externalAssets === null) return null;

		allowedUrls = allowedUrls.concat(externalAssets);
		if (process.env.AKASHIC_SERVE_ALLOW_ORIGIN) {
			if (process.env.AKASHIC_SERVE_ALLOW_ORIGIN === "null") return null;
			allowedUrls.push(process.env.AKASHIC_SERVE_ALLOW_ORIGIN);
		}
	}
	return allowedUrls;
}
