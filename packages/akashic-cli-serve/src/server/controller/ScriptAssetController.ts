import * as fs from "fs";
import * as path from "path";
import * as express from "express";
import * as chokidar from "chokidar";

export const createScriptAssetController = (baseDir: string): express.RequestHandler => {
	const gameJsonPath = path.join(baseDir, "game.json");
	let gameJson: any = JSON.parse(fs.readFileSync(gameJsonPath).toString());

	const watcher = chokidar.watch(gameJsonPath, { persistent: true });
	watcher.on("change", () => {
		gameJson = JSON.parse(fs.readFileSync(gameJsonPath).toString());
	});
	return (req: express.Request, res: express.Response, next: Function): void => {
		const scriptPath = path.join(baseDir, req.params.scriptName);
		if (!fs.existsSync(scriptPath) || !fs.existsSync(scriptPath)) {
			const err: any = new Error("Not Found");
			err.status = 404;
			next(err);
			return;
		}
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
