import type * as express from "express";
import type { PlayStore } from "../domain/PlayStore.js";

export const createHandleToGetStatus = (playStore: PlayStore): express.RequestHandler => {
	return async (_req, res, next) => {
		try {
			res.render("health-check-status", {
				playsInfo: playStore.getPlaysInfo()
			});
		} catch (e) {
			next(e);
		}
	};
};
