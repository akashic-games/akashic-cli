import * as fs from "fs";
import * as path from "path";
import * as express from "express";

export const createScriptAssetController = (baseDir: string): express.RequestHandler => {
	return (req: express.Request, res: express.Response, next: Function): void => {
		const scriptPath = path.join(baseDir, req.params.scriptName);
		const gameJsonPath = path.join(baseDir, "game.json");
		if (!fs.existsSync(scriptPath) || !fs.existsSync(scriptPath)) {
			const err: any = new Error("Not Found");
			err.status = 404;
			next(err);
			return;
		}
		// TODO: chokidar等でgame.jsonの変更時だけ読み込みを行うようにする
		const gameJson: any = JSON.parse(fs.readFileSync(gameJsonPath).toString());
		let id = Object.keys(gameJson.assets).find((id) => gameJson.assets[id].path === req.params.scriptName);
		const content = fs.readFileSync(scriptPath);
		const responseBody = `
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
