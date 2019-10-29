import * as fs from "fs";
import * as path from "path";
import * as express from "express";
import * as chokidar from "chokidar";
import { getSystemLogger } from "@akashic/headless-driver";
import { SandboxConfig } from "../../common/types/SandboxConfig";
import { dynamicRequire } from "../domain/dynamicRequire";

export const createScriptAssetController = (baseDir: string): express.RequestHandler => {
	const gameJsonPath = path.join(baseDir, "game.json");
	let gameJson: any = JSON.parse(fs.readFileSync(gameJsonPath).toString());

	const watcher = chokidar.watch(gameJsonPath, { persistent: true });
	watcher.on("change", () => {
		try {
			gameJson = JSON.parse(fs.readFileSync(gameJsonPath).toString());
		} catch (e) {
			// do nothing
		}
	});

	const sandboxConfig = dynamicRequire<SandboxConfig>(path.resolve(baseDir, "sandbox.config.js"));
	const injection = sandboxConfig.injection;
	let markers: string[] = [];
	const injectionData: any = {};
	if (injection) {
		const markerPrefix = injection.markerPrefix || "// akashic-inject:";
		const keys = Object.keys(injection.items || {});
		keys.forEach(k => {
			const m = markerPrefix + k;
			markers.push(m);
			injectionData[m] = { key: k, item: injection.items[k] };
		});
	}

	function setupInjection(code: string): string {
		return markers.reduce(function (acc, m) {
			const snip = `(window.__testbedInject || (window.__testbedInject = {}))["${injectionData[m].key}"] = {
				set: function (v) { ${injectionData[m].item.target} = v },
				onchange: function () { ${injectionData[m].item.onchange} }
			};`.replace(/\r\n/g, "");
			return acc.replace(m, snip);
		}, code);
	}

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
		const responseBody = `"use strict";
			if (! ("gScriptContainer" in window)) {
				window.gScriptContainer = {};
			}
			gScriptContainer["${id === undefined ? req.params.scriptName : id}"] = function(g) {
				(function(exports, require, module, __filename, __dirname) {
					${setupInjection(content.toString())}
				})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
			}
		`;
		res.contentType("text/javascript");
		res.send(responseBody);
	};
};
