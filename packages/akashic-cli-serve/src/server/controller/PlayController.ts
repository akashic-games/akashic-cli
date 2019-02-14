import * as express from "express";
import { BadRequestError, NotFoundError } from "../common/ApiError";
import { responseSuccess } from "../common/ApiResponse";
import {
	PlayApiResponseData,
	PlayDeleteApiResponseData,
	PlayPatchApiResponseData
} from "../../common/types/ApiResponse";
import { PlayStore } from "../domain/PlayStore";

export const createHandlerToCreatePlay = (playStore: PlayStore): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			if (!req.body.contentUrl) {
				throw new BadRequestError({ errorMessage: "handleCreatePlay(): contentUrl is not given" });
			}
			const contentUrl = req.body.contentUrl;
			const clientContentUrl = req.body.clientContentUrl;
			const playId = await playStore.createPlay(contentUrl, clientContentUrl);
			responseSuccess<PlayApiResponseData>(res, 200, {
				playId,
				contentUrl,
				joinedPlayers: [],
				clientContentUrl,
				runners: [],
				clientInstances: [],
				durationState: {
					duration: 0,
					isPaused: true
				}
			});
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToGetPlay = (playStore: PlayStore): express.RequestHandler => {
	return (req, res, next) => {
		try {
			const playId = req.params.playId;
			const play = playStore.getPlay(playId);
			if (!play) {
				throw new NotFoundError({
					errorMessage: "Play is not found"
				});
			}
			responseSuccess<PlayApiResponseData>(res, 200, {
				playId: play.playId,
				contentUrl: play.contentUrl,
				joinedPlayers: playStore.getJoinedPlayers(playId),
				clientContentUrl: playStore.getClientContentUrl(playId),
				runners: playStore.getRunners(playId),
				clientInstances: playStore.getClientInstances(playId),
				durationState: playStore.getPlayDurationState(playId)
			});
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToGetPlays = (playStore: PlayStore): express.RequestHandler => {
	return (req, res, next) => {
		try {
			const plays = playStore.getPlays();
			responseSuccess<PlayApiResponseData[]>(
				res,
				200,
				plays.map(play => ({
					playId: play.playId,
					contentUrl: play.contentUrl,
					joinedPlayers: playStore.getJoinedPlayers(play.playId),
					clientContentUrl: playStore.getClientContentUrl(play.playId),
					runners: playStore.getRunners(play.playId),
					clientInstances: playStore.getClientInstances(play.playId),
					durationState: playStore.getPlayDurationState(play.playId)
				}))
			);
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToDeletePlay = (playStore: PlayStore): express.RequestHandler => {
	return async (req: express.Request, res: express.Response, next: Function) => {
		try {
			if (!req.params.playId) {
				throw new BadRequestError({ errorMessage: "PlayId is not given" });
			}
			const playId = req.params.playId;
			await playStore.stopPlay(playId);
			responseSuccess<PlayDeleteApiResponseData>(res, 200, { playId });
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToPausePlayDuration = (playStore: PlayStore): express.RequestHandler => {
	return async (req: express.Request, res: express.Response, next: Function) => {
		try {
			if (!req.params.playId) {
				throw new BadRequestError({ errorMessage: "PlayId is not given" });
			}
			const playId = req.params.playId;
			await playStore.pausePlayDuration(playId);
			responseSuccess<PlayDeleteApiResponseData>(res, 200, { playId });
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToResumePlayDuration = (playStore: PlayStore): express.RequestHandler => {
	return async (req: express.Request, res: express.Response, next: Function) => {
		try {
			if (!req.params.playId) {
				throw new BadRequestError({ errorMessage: "PlayId is not given" });
			}
			const playId = req.params.playId;
			await playStore.resumePlayDuration(playId);
			responseSuccess<PlayDeleteApiResponseData>(res, 200, { playId });
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToPatchPlay = (playStore: PlayStore): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const playId = req.params.playId;
			if (!playId) {
				throw new BadRequestError({ errorMessage: "PlayId is not given" });
			}
			const status = req.body.status;
			if (status != null) {
				if (status !== "running" && status !== "paused") {
					throw new BadRequestError({ errorMessage: "Invalid status: " + status });
				}
				if (status === "paused") {
					await playStore.pausePlayDuration(playId);
				} else {
					await playStore.resumePlayDuration(playId);
				}
			}
			responseSuccess<PlayPatchApiResponseData>(res, 200, { playId, status });
		} catch (e) {
			next(e);
		}
	};
};
