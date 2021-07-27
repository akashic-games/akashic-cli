import * as express from "express";
import { PlayStore } from "../domain/PlayStore";

export const createHandleToGetStatus = (playStore: PlayStore): express.RequestHandler => {
	return async (_req, res, next) => {
		try {
			const plays = playStore.getPlays();
			const playsInfo = plays.map(play => {
				return {
					playId: play.playId,
					status: play.status,
					createdAt: play.createdAt,
					lastSuspendedAt: play.lastSuspendedAt,
					clientInstances: playStore.getClientInstances(play.playId),
					runners: playStore.getRunners(play.playId)
				};
			});
			res.render("health-check-status", {
				playsInfo
			});
		} catch (e) {
			next(e);
		}
	};
};
