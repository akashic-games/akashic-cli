import * as express from "express";
import { PlayStore } from "../domain/PlayStore";

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
