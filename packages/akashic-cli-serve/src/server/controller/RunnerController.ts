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

export const createHandlerToCreateRunner = (playStore: PlayStore, runnerStore: RunnerStore): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			// TODO: バリデーション用クラスを別で用意した方がよさそう
			if (!req.body.playId || req.body.isActive === undefined || !req.body.token) {
				throw new BadRequestError({ errorMessage: "Invalid playId, isActive or token" });
			}
			const playId = req.body.playId;
			const isActive = Boolean(req.body.isActive);
			const token = req.body.token;
			const amflow = playStore.createAMFlow(playId);
			const runner = await runnerStore.createAndStartRunner(playId, isActive, token, amflow);
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

