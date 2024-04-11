import fs = require("fs");
import path = require("path");
import type { SandboxConfiguration } from "@akashic/sandbox-configuration";
import express = require("express");
import sr = require("../request/ScriptRequest");


const controller: express.RequestHandler = (req: sr.ScriptRequest, res: express.Response, _next: Function) => {
	const scriptPath = path.resolve(path.join(req.baseDir, "sandbox.config.js"));

	if (! fs.existsSync(scriptPath)) {
		res.contentType("text/javascript");
		res.send(createLoadingScript({}));
		return;
	}
	let sandboxConfig = {};
	try {
		sandboxConfig = require(scriptPath);
		delete require.cache[require.resolve(scriptPath)]; // 設定ファイルの更新に追従するためアクセス毎にキャッシュを削除する
		sandboxConfig = completeConfigParams(sandboxConfig);
	} catch (error) {
		console.log(error);
	}
	res.contentType("text/javascript");
	res.send(createLoadingScript(sandboxConfig));
};

module.exports = controller;

function completeConfigParams(c: SandboxConfiguration): SandboxConfiguration {
	const config = {
		autoSendEventName: c.autoSendEventName ? c.autoSendEventName : "",
		events: c.events ? c.events : {},
		showMenu: !!c.showMenu,
		warn: c.warn ? c.warn : {}
	};
	return config;
}

function createLoadingScript(content: any): string {
	return `window.sandboxDeveloperProps = window.sandboxDeveloperProps || {};
window.sandboxDeveloperProps.sandboxConfig = ${JSON.stringify(content)};
`;
}
