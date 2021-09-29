import * as express from "express";
import {
	PlayApiResponseData,
	PlayDeleteApiResponseData,
	PlayPatchApiResponseData
} from "../../common/types/ApiResponse";
import { BadRequestError, NotFoundError } from "../common/ApiError";
import { responseSuccess } from "../common/ApiResponse";
import { ServerContentLocator } from "../common/ServerContentLocator";
import { PlayStore } from "../domain/PlayStore";

export const createHandlerToCreatePlay = (playStore: PlayStore): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			if (!req.body.contentLocator || (!req.body.contentLocator.contentId && !req.body.contentLocator.path)) {
				throw new BadRequestError({ errorMessage: "handleCreatePlay(): contentLocator is not given or invalid" });
			}
			const muteType = req.body.muteType ?? "none";
			const contentLocator = new ServerContentLocator(req.body.contentLocator);
			const playId = await playStore.createPlay(contentLocator, null, { muteType, soloPlayerId: null });
			const audioState = playStore.getPlayAudioState(playId);
			responseSuccess<PlayApiResponseData>(res, 200, {
				playId,
				contentLocatorData: contentLocator,
				joinedPlayers: [],
				runners: [],
				clientInstances: [],
				durationState: {
					duration: 0,
					isPaused: true
				},
				audioState
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
				contentLocatorData: playStore.getContentLocator(playId),
				joinedPlayers: playStore.getJoinedPlayers(playId),
				runners: playStore.getRunners(playId),
				clientInstances: playStore.getClientInstances(playId),
				durationState: playStore.getPlayDurationState(playId),
				audioState: playStore.getPlayAudioState(playId)
			});
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToGetPlays = (playStore: PlayStore): express.RequestHandler => {
	return (_req, res, next) => {
		try {
			const plays = playStore.getPlays();
			responseSuccess<PlayApiResponseData[]>(
				res,
				200,
				plays.map(play => ({
					playId: play.playId,
					contentLocatorData: playStore.getContentLocator(play.playId),
					joinedPlayers: playStore.getJoinedPlayers(play.playId),
					runners: playStore.getRunners(play.playId),
					clientInstances: playStore.getClientInstances(play.playId),
					durationState: playStore.getPlayDurationState(play.playId),
					audioState: playStore.getPlayAudioState(play.playId)
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

				if (req.body.step) await playStore.stepPlayDuration(playId);
			}
			responseSuccess<PlayPatchApiResponseData>(res, 200, { playId, status });
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToGetPlaylog = (playStore: PlayStore): express.RequestHandler => {
	return (req, res, next) => {
		try {
			if (!req.params.playId) {
				throw new BadRequestError({ errorMessage: "PlayId is not given" });
			}
			const playId = req.params.playId;
			const amflow = playStore.createAMFlow(playId);
			if (!amflow) {
				throw new NotFoundError({ errorMessage: `PlayLog is not found. playId:${playId}` });
			}
			const dumpData = amflow.dump();
			const dumpJsonStr = JSON.stringify(dumpData);
			const fileName = `playlog_${playId}_${Date.now()}.json`;

			res.setHeader("Content-disposition", "attachment; filename=" + fileName);
			res.setHeader("Content-type", "application/x-download");
			res.send(dumpJsonStr);
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToPatchAudioState = (playStore: PlayStore): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const playId = req.params.playId;
			if (!playId) {
				throw new BadRequestError({ errorMessage: "PlayId is not given" });
			}
			const { audioState } = req.body;
			if (!audioState) {
				throw new BadRequestError({ errorMessage: "audioState is not given" });
			}
			playStore.setPlayAudioState(playId, audioState);
			responseSuccess<void>(res, 200, null);
		} catch (e) {
			next(e);
		}
	};
};

