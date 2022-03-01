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
		const gameJson = gameConfigs.get(index.toString());
		const id = Object.keys(gameJson.assets).find((id) => gameJson.assets[id].path === req.params.scriptName);

		const content = fs.readFileSync(scriptPath);
		const responseBody = `"use strict";
			if (! ("gScriptContainer" in window)) {
				window.gScriptContainer = {};
			}
			gScriptContainer["${id === undefined ? req.params.scriptName : id}"] = function(g) {
				(function(exports, require, module, __filename, __dirname) {
					${content}
				})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
			}
		`;
		res.contentType("text/javascript");
		res.send(responseBody);
	};
};
