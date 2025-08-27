import type { Event } from "@akashic/playlog";
import type * as express from "express";
import type {
	PlayApiResponseData,
	PlayDeleteApiResponseData,
	PlayPatchApiResponseData
} from "../../common/types/ApiResponse.js";
import type { DumpedPlaylog } from "../../common/types/DumpedPlaylog.js";
import { BadRequestError, NotFoundError } from "../common/ApiError.js";
import { responseSuccess } from "../common/ApiResponse.js";
import { ServerContentLocator } from "../common/ServerContentLocator.js";
import type { PlayStore } from "../domain/PlayStore.js";
import type { RunnerStore } from "../domain/RunnerStore.js";

export const createHandlerToCreatePlay = (playStore: PlayStore): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			if (!req.body.contentLocator || (!req.body.contentLocator.contentId && !req.body.contentLocator.path)) {
				throw new BadRequestError({ errorMessage: "handleCreatePlay(): contentLocator is not given or invalid" });
			}
			const contentLocator = new ServerContentLocator(req.body.contentLocator);
			const initialJoinPlayerId = req.body.initialJoinPlayerId;
			const initialJoinPlayerName = req.body.initialJoinPlayerName;
			const initialJoinPlayer = initialJoinPlayerId ? { id: initialJoinPlayerId, name: initialJoinPlayerName } : undefined;
			const inheritsJoinedFromLatest = req.body.inheritsJoinedFromLatest;
			const inheritsAudioFromLatest = req.body.inheritsAudioFromLatest;
			const playId = await playStore.createPlay({
				contentLocator,
				initialJoinPlayer,
				inheritsJoinedFromLatest,
				inheritsAudioFromLatest
			});
			responseSuccess<PlayApiResponseData>(res, 200, playStore.getPlayInfo(playId));
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToGetPlay = (playStore: PlayStore): express.RequestHandler => {
	return (req, res, next) => {
		try {
			const playId = req.params.playId;
			const playInfo = playStore.getPlayInfo(playId);
			if (!playInfo) {
				throw new NotFoundError({
					errorMessage: "Play is not found"
				});
			}
			responseSuccess<PlayApiResponseData>(res, 200, playInfo);
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
				plays.map(play => playStore.getPlayInfo(play.playId)!)
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

export const createHandlerToSendEvent = (playStore: PlayStore, toLatestPlay: boolean = false): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			if (!toLatestPlay && !req.params.playId) {
				throw new BadRequestError({ errorMessage: "PlayId is not given" });
			}
			if (!Array.isArray(req.body.events)) {
				throw new BadRequestError({ errorMessage: "events is not an array" });
			}
			const playId = toLatestPlay ? playStore.getLatestPlay()?.playId : req.params.playId;
			const events: Event[] = req.body.events; // TODO 厳密なバリデーション

			const amflow = playId != null ? await playStore.getDebugAMFlow(playId) : null;
			if (!amflow) {
				throw new NotFoundError({ errorMessage: `PlayLog is not found. playId:${playId}` });
			}
			events.forEach(ev => amflow.sendEvent(ev));
			responseSuccess<void>(res, 200, null);
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToSendNamagameCommentByTemplate = (playStore: PlayStore, runnerStore: RunnerStore): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const playId = req.params.playId;
			const name = req.body.name;
			if (!playId) {
				throw new BadRequestError({ errorMessage: "Invalid runnerId" });
			}
			if (!name) {
				throw new BadRequestError({ errorMessage: "No name given" });
			}

			const playInfo = playStore.getPlayInfo(playId);
			if (!playInfo) {
				throw new BadRequestError({ errorMessage: `No play found for ${playId}` });
			}
			const runnerId = playInfo.runners[0]?.runnerId;
			if (!runnerId) {
				throw new BadRequestError({ errorMessage: `No runner for ${playId}` });
			}

			runnerStore.sendCommentsByTemplate(runnerId, name);
			responseSuccess<void>(res, 200, null);
		} catch (e) {
			next(e);
		}
	};
};

function maybeBoolOf(s: string): boolean | undefined {
	return (s === "true") || (s === "false" ? false : undefined);
}

export const createHandlerToSendNamagameComment  = (playStore: PlayStore, runnerStore: RunnerStore): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const playId = req.params.playId;
			const { comment, userID }  = req.body;
			const command = req.body.command || undefined; // 空文字列は undefined にする
			const isAnonymous = maybeBoolOf(req.body.isAnonymous) ?? false;
			const vpos = req.body.vpos ?? undefined;

			if (!playId) {
				throw new BadRequestError({ errorMessage: "Invalid runnerId" });
			}
			if (vpos != null && !(typeof vpos === "number" && !isNaN(vpos))) {
				throw new BadRequestError({ errorMessage: `Invalid vpos: ${vpos}` });
			}
			const playInfo = playStore.getPlayInfo(playId);
			if (!playInfo) {
				throw new BadRequestError({ errorMessage: `No play found for ${playId}` });
			}
			const runnerId = playInfo.runners[0]?.runnerId;
			if (!runnerId) {
				throw new BadRequestError({ errorMessage: `No runner for ${playId}` });
			}

			// null/undefined は「省略された」として扱う。
			const commentData = { comment, command, userID, isAnonymous, vpos };
			if (command == null)
				delete commentData.command;
			if (userID == null)
				delete commentData.userID;
			if (vpos == null)
				delete commentData.vpos;

			const success = runnerStore.sendComment(runnerId, commentData);
			responseSuccess<boolean>(res, 200, success);
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
			const amflow = playStore.createAMFlow(playId); // TODO より無駄のない getDebugAMFlow() を使う。要動作確認。
			if (!amflow) {
				throw new NotFoundError({ errorMessage: `PlayLog is not found. playId:${playId}` });
			}
			const dumpData = amflow.dump() as DumpedPlaylog;
			const playInfo = playStore.getPlayInfo(playId);
			if (playInfo) {
				dumpData.__serve = {
					duration: playInfo.durationState.duration,
				};
			}
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
