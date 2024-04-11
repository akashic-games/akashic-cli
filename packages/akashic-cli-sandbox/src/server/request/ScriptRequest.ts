import express = require("express");

export interface ScriptRequest extends express.Request {
	baseDir: string;
	useRawScript: boolean;
}

export interface ScriptRequestHandler extends express.RequestHandler {
	(req: ScriptRequest, res: express.Response, next: Function): any;
}
