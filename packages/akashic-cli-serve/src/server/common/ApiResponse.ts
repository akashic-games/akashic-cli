import * as express from "express";
import { ErrorInterface } from "./ApiError";

export const responseSuccess = <T>(res: express.Response, status: number, data: T): void => {
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
