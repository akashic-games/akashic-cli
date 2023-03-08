import * as fs from "fs";
import * as path from "path";
import type * as express from "express";
import * as gameConfigs from "../domain/GameConfigs";

export const createScriptAssetController = (baseDir: string, index: number): express.RequestHandler => {
	// TODO: require() のキャッシュするモジュールのインターフェース (index でアクセスする点) と register() 箇所を見直す
	gameConfigs.register(index.toString(), baseDir);

	return (req: express.Request, res: express.Response, next: Function): void => {
		const scriptPath = path.join(baseDir, req.params.scriptName);
		if (!fs.existsSync(scriptPath) || !fs.existsSync(scriptPath)) {
			const err: any = new Error("Not Found");
			err.status = 404;
			next(err);
			return;
		}

		const content = fs.readFileSync(scriptPath);
		const key = `${req.protocol}://${req.get("host") + req.originalUrl}`;

		const responseBody = `"use strict";
			if (! ("gScriptContainer" in window)) {
				window.gScriptContainer = {};
			}
			gScriptContainer["${key}"] = function(g) {
				var Math = window.akashicServe.scriptHelper.overrides.MeddlingMath;

				(function(exports, require, module, __filename, __dirname) {
					${content}
				})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
			}
		`;
		res.contentType("text/javascript");
		res.send(responseBody);
	};
};
