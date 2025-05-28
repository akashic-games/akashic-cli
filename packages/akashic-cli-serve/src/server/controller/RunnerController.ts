import type * as express from "express";
import type {
	RunnerDeleteApiResponseData,
	RunnerPostApiResponseData,
	RunnerPatchApiResponseData
} from "../../common/types/ApiResponse.js";
import { BadRequestError } from "../common/ApiError.js";
import { responseSuccess } from "../common/ApiResponse.js";
import type { PlayStore } from "../domain/PlayStore.js";
import type { RunnerStore } from "../domain/RunnerStore.js";

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
			const playInfo = playStore.getPlayInfo(playId);
			if (!playInfo)
				throw new BadRequestError({ errorMessage: `Play not found for ${playId}` });
			const contentId = playInfo.contentLocatorData.contentId!;
			const isActive = (req.body.isActive === "true");
			const isPaused = (req.body.isPaused === "true");
			const token = req.body.token;
			const amflow = playStore.createAMFlow(playId);
			const runner = await runnerStore.createAndStartRunner({ playId, isActive, token, amflow, contentId, isPaused });
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
				await runnerStore.pauseRunner(runnerId);
			} else {
				await runnerStore.resumeRunner(runnerId);
			}

			if (req.body.step) {
				await runnerStore.stepRunner(runnerId);
			}

			responseSuccess<RunnerPatchApiResponseData>(res, 200, { runnerId, status });
		} catch (e) {
			next(e);
		}
	};
};
