import fs from "fs";
import path from "path";
import type { GameConfiguration, ScriptAssetConfigurationBase } from "@akashic/game-configuration";
import { makePathKeyObject } from "@akashic/game-configuration/lib/utils/makePathKeyObject.js";
import type { RequestHandler } from "express";

const controller: RequestHandler = (req, res, next): void => {
	const scriptPath = path.join(req.baseDir, req.params.scriptName);
	// TODO: pathがbaseDir以下かの検査（scriptNameに..とか入れられるとたどれちゃう）
	if (! fs.existsSync(scriptPath)) {
		const err = new Error("Not Found");
		err.status = 404;
		next(err);
		return;
	}
	const content = fs.readFileSync(scriptPath);
	res.contentType("text/javascript");
	if (req.useRawScript) {
		res.send(content);
	} else {
		const gameJson: GameConfiguration = JSON.parse(fs.readFileSync(path.join(req.baseDir, "game.json"), { encoding: "utf-8" }));
		const assetMap = makePathKeyObject(gameJson.assets);
		const scriptAssetConfig = assetMap[req.params.scriptName] as (ScriptAssetConfigurationBase | undefined);
		res.render("script", {
			key: req.originalUrl,
			scriptContent: content,
			scriptName: req.params.scriptName,
			exports: scriptAssetConfig?.exports
		});
	}
};

export default controller;
