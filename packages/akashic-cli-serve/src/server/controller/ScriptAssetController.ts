import * as fs from "fs";
import * as path from "path";
import type { GameConfiguration } from "@akashic/akashic-cli-commons";
import type { ScriptAssetConfigurationBase } from "@akashic/game-configuration";
import { makePathKeyObject } from "@akashic/game-configuration/lib/utils/makePathKeyObject.js";
import type * as express from "express";
import * as gameConfigs from "../domain/GameConfigs.js";

export const createScriptAssetController = (baseDir: string, index: number): express.RequestHandler => {
	// TODO: require() のキャッシュするモジュールのインターフェース (index でアクセスする点) と register() 箇所を見直す
	gameConfigs.register(index.toString(), baseDir);

	return (req: express.Request, res: express.Response, next: Function): void => {
		const scriptName = req.params.scriptName;
		const scriptPath = path.join(baseDir, scriptName);
		if (!fs.existsSync(scriptPath)) {
			const err: any = new Error("Not Found");
			err.status = 404;
			next(err);
			return;
		}

		const content = fs.readFileSync(scriptPath);
		const key = `${req.protocol}://${req.get("host") + req.originalUrl}`;

		// TODO: game.json の内容に変化が無い限りキャッシュから読み込むように修正
		const gameJson: GameConfiguration = JSON.parse(fs.readFileSync(path.join(baseDir, "game.json"), { encoding: "utf-8" }));
		const assetMap = makePathKeyObject(gameJson.assets);
		const scriptAssetConfig = assetMap[scriptName] as (ScriptAssetConfigurationBase | undefined); // global asset の場合 undefined
		const exports = scriptAssetConfig?.exports ?? [];

		let postContent = "";
		for (const variableName of exports) {
			postContent += `exports["${variableName}"] = typeof ${variableName} !== "undefined" ? ${variableName} : undefined;\n`;
		}

		const responseBody = `"use strict";
			if (! ("gScriptContainer" in window)) {
				window.gScriptContainer = {};
			}
			gScriptContainer["${key}"] = function(g) {
				var Math = window.akashicServe.scriptHelper.overrides.MeddlingMath;

				(function(exports, require, module, __filename, __dirname) {
					${content}
					${postContent}
				})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
			}
		`;
		res.contentType("text/javascript");
		res.send(responseBody);
	};
};
