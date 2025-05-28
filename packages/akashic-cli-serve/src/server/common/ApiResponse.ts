import type * as express from "express";
import type { ErrorInterface } from "./ApiError.js";

export const responseSuccess = <T>(res: express.Response, status: number, data: T | null): void => {
	const response = {
		meta: {
			status
		},
		data
	};
	res.status(status).json(response);
};

export const responseError = (res: express.Response, err: ErrorInterface): void => {
	const response = {
		meta: {
			status: err.status,
			errorCode: err.code,
			errorMessage: err.message
		},
		data: err.data
	};
	res.status(err.status).json(response);
};
