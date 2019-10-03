import * as express from "express";
import { Play } from "@akashic/headless-driver";
import { PlayStore } from "../domain/PlayStore";

export const createHandleToGetHealthChecker = (playStore: PlayStore): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const plays = playStore.getPlays();
			const playsInfo = plays.map(play => {
				return {
					playId: play.playId,
					status: play.status,
					createdAt: play.createdAt,
					lastSuspendedAt: play.lastSuspendedAt,
					clientInstances: playStore.getClientInstances(play.playId)
				};
			});
			res.render("health-checker", {
				playsInfo
			});
		} catch (e) {
			next(e);
		}
	};
};
